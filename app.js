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
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role === 'manager' || req.session.user.role === 'admin') {
        return next();
    }

    res.redirect('/products');
}
function isAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role === 'admin') {
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

    const user = await User.findOne({
        where: { login, password },
        include: [Role]
    });

    if (!user) {
        return res.render('login', {
            error: 'Неверный логин или пароль'
        });
    }

    req.session.user = {
        id: user.id,
        fullName: user.fullName,
        role: user.Role.name
    };

    if (user.Role.name === 'admin' || user.Role.name === 'manager') {
        return res.redirect('/orders');
    }

    return res.redirect('/products');
});
app.get('/products', async (req, res) => {
    const products = await Product.findAll({
        include: [Category],
        order: [['id', 'ASC']]
    });

    const categories = await Category.findAll({
        order: [['name', 'ASC']]
    });

    res.render('products', {
    products,
    categories,
    user: req.session.user || null,
    message: req.query.message || '',
    error: req.query.error || ''
});
});
app.get('/products/add', isAdmin, async (req, res) => {
    const categories = await Category.findAll();

    res.render('productForm', {
        product: null,
        categories,
        user: req.session.user
    });
});
app.post('/products/add', isAdmin, async (req, res) => {
    await Product.create({
        article: req.body.article,
        name: req.body.name,
        author: req.body.author,
        categoryId: req.body.categoryId,
        unit: req.body.unit,
        price: req.body.price,
        discount: req.body.discount || 0,
        stock: req.body.stock || 0,
        supplier: req.body.supplier,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        imagePath: req.body.imagePath || 'picture.png',
        isActive: true
    });

    res.redirect('/products?message=Товар успешно добавлен');
});
app.get('/products/:id/edit', isAdmin, async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    const categories = await Category.findAll();

    res.render('productForm', {
        product,
        categories,
        user: req.session.user
    });
});
app.post('/products/:id/edit', isAdmin, async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    await product.update({
        article: req.body.article,
        name: req.body.name,
        author: req.body.author,
        categoryId: req.body.categoryId,
        unit: req.body.unit,
        price: req.body.price,
        discount: req.body.discount || 0,
        stock: req.body.stock || 0,
        supplier: req.body.supplier,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        imagePath: req.body.imagePath || 'picture.png'
    });

    res.redirect('/products?message=Товар успешно изменён');
});
app.post('/products/:id/delete', isAdmin, async (req, res) => {
    const orderItem = await OrderItem.findOne({
        where: { productId: req.params.id }
    });

    if (orderItem) {
        return res.redirect('/products?error=Нельзя удалить товар, который есть в заказе');
    }

    await Product.destroy({
        where: { id: req.params.id }
    });

    res.redirect('/products?message=Товар успешно удалён');
});
app.get('/orders', isManagerOrAdmin, async (req, res) => {
    const orders = await Order.findAll({
        include: [
            PickupPoint,
            User,
            {
                model: OrderItem,
                include: [Product]
            }
        ],
        order: [['id', 'ASC']]
    });

    res.render('orders', {
        orders,
        user: req.session.user
    });
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