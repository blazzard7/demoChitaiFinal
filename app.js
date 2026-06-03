const express = require('express');
const sequelize = require('./db');
require('./models');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const session = require('express-session');
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('public'));

function isManagerOrAdmin(req, res, next) {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'manager')) {
        return next();
    }
    res.redirect('/products');
}

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/products');
    }

    const role = req.session.user.role;

    if (role === 'admin' || role === 'manager') {
        return res.redirect('/orders');
    }

    res.redirect('/products');
});

app.get('/login', (req, res) => 
    res.render('login', { error: null }));

app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const user = await sequelize.models.User.findOne({
        where: { login, password }
    });
    if (user) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid login or password' });
    }
});
app.get('/products', async (req,res) => {
    const products = await sequelize.models.Product.findAll();
    res.render('products', { products });
});
app.get('/orders',isManagerOrAdmin, async (req,res) => {
    const orders = await sequelize.models.Order.findAll();
    res.render('orders', { orders });
});
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('http://localhost:3000');
    });
}).catch(err => console.error('Unable to connect to the database:', err));