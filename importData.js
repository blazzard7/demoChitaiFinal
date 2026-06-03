const XLSX = require('xlsx');
const sequelize = require('./db');
require('./models');

const { User, Product, PickupPoint, Order, OrderItem } = sequelize.models;

function read(file) {
    const book = XLSX.readFile('./import/' + file);
    const sheet = book.Sheets[book.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
}

function readNoHeader(file) {
    const book = XLSX.readFile('./import/' + file);
    const sheet = book.Sheets[book.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

function role(value) {
    if (value === 'Администратор') return 'admin';
    if (value === 'Менеджер') return 'manager';
    return 'client';
}

function status(value) {
    return value === 'Завершен' || value === 'Завершён' ? 'completed' : 'new';
}
//заказы 
function excelDate(value) {
    if (!value) {
        return new Date().toISOString().slice(0, 10);
    }

    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    if (typeof value === 'number') {
        const date = new Date((value - 25569) * 86400 * 1000);

        if (!isNaN(date.getTime())) {
            return date.toISOString().slice(0, 10);
        }
    }

    const date = new Date(value);

    if (!isNaN(date.getTime())) {
        return date.toISOString().slice(0, 10);
    }

    return new Date().toISOString().slice(0, 10);
}
//заказы
async function start() {
    await sequelize.sync();

    await User.bulkCreate(read('user_import.xlsx').map(row => ({
        role: role(row['Роль сотрудника']),
        fullName: row['ФИО'],
        login: row['Логин'],
        password: row['Пароль']
    })), { ignoreDuplicates: true });

    console.log('Пользователи импортированы');

    await Product.bulkCreate(read('Tovar.xlsx').map(row => ({
        article: row['Артикул'],
        name: row['Наименование товара'],
        unit: row['Единица измерения'],
        price: row['Цена'],
        supplier: row['Поставщик'],
        manufacturer: row['Производитель'],
        category: row['Категория товара'],
        discount: row['Действующая скидка'] || 0,
        stock: row['Кол-во на складе'] || 0,
        description: row['Описание товара'],
        photo: row['Фото']
    })), { ignoreDuplicates: true });

    console.log('Товары импортированы');

    const points = [];

    readNoHeader('Пункты выдачи_import.xlsx').forEach(row => {
        row.forEach(address => {
            if (address) points.push({ address });
        });
    });

    await PickupPoint.bulkCreate(points, { ignoreDuplicates: true });

    console.log('Пункты выдачи импортированы');

//если время пиздец, то можно удалить и уебать через хтмл
    const orders = read('Заказ_import.xlsx');

    for (const row of orders) {
        const client = await User.findOne({
            where: { fullName: row['ФИО авторизированного клиента'] }
        });

        if (!client) continue;

        const [order] = await Order.findOrCreate({
            where: { orderNumber: row['Номер заказа'] },
            defaults: {
                orderDate: excelDate(row['Дата заказа']),
                deliveryDate: excelDate(row['Дата доставки']),
                pickupPointId: row['Адрес пункта выдачи'],
                clientId: client.id,
                pickupCode: row['Код для получения'],
                status: status(row['Статус заказа'])
            }
        });

        const items = String(row['Артикул заказа']).split(',').map(x => x.trim());

        for (let i = 0; i < items.length; i += 2) {
            const product = await Product.findOne({
                where: { article: items[i] }
            });

            if (!product) continue;

            await OrderItem.findOrCreate({
                where: {
                    orderId: order.id,
                    productId: product.id
                },
                defaults: {
                    quantity: Number(items[i + 1]) || 1
                }
            });
        }
    }

    console.log('Заказы импортированы');
    //нахуй
    console.log('Импорт завершён');

    process.exit();
}

start();