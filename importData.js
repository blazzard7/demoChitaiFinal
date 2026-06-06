const XLSX = require('xlsx');
const path = require('path');

const {
  sequelize,
  Role,
  User,
  Category,
  Product,
  PickupPoint,
  Order,
  OrderItem
} = require('./models');

const file = name => path.join(__dirname, 'import', name);

const read = name => {
  const book = XLSX.readFile(file(name), { cellDates: true });
  return XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: '' });
};

const readNoHeader = name => {
  const book = XLSX.readFile(file(name));
  return XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { header: 1, defval: '' });
};

const txt = value => String(value || '').trim();
const num = value => Number(value) || 0;

const date = value => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  if (typeof value === 'number') {
    return new Date((value - 25569) * 86400 * 1000).toISOString().slice(0, 10);
  }

  const parts = txt(value).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

  if (parts) {
    const d = Number(parts[1]);
    const m = Number(parts[2]);
    const y = Number(parts[3]);
    const lastDay = new Date(y, m, 0).getDate();

    return new Date(y, m - 1, Math.min(d, lastDay)).toISOString().slice(0, 10);
  }

  return null;
};

const getRole = value => {
  value = txt(value).toLowerCase();

  if (value.includes('администратор')) return 'admin';
  if (value.includes('менеджер')) return 'manager';

  return 'client';
};

const parseItems = value => {
  const parts = txt(value).split(',').map(x => x.trim());
  const result = [];

  for (let i = 0; i < parts.length; i += 2) {
    result.push({
      article: parts[i],
      quantity: num(parts[i + 1]) || 1
    });
  }

  return result;
};

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await OrderItem.truncate();
  await Order.truncate();
  await Product.truncate();
  await User.truncate();
  await PickupPoint.truncate();
  await Category.truncate();
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

  await Role.findOrCreate({ where: { name: 'client' } });
  await Role.findOrCreate({ where: { name: 'manager' } });
  await Role.findOrCreate({ where: { name: 'admin' } });

  const roles = await Role.findAll();
  const roleId = Object.fromEntries(roles.map(r => [r.name, r.id]));

  for (const row of readNoHeader('Пункты выдачи_import.xlsx')) {
    if (txt(row[0])) {
      await PickupPoint.findOrCreate({ where: { address: txt(row[0]) } });
    }
  }

  for (const row of read('user_import.xlsx')) {
    await User.create({
      fullName: txt(row['ФИО']),
      login: txt(row['Логин']),
      password: txt(row['Пароль']),
      roleId: roleId[getRole(row['Роль сотрудника'])]
    });
  }

  const productsRows = read('Tovar.xlsx');

  for (const row of productsRows) {
    const name = txt(row['Категория товара']);

    if (name) {
      await Category.findOrCreate({ where: { name } });
    }
  }

  const categories = await Category.findAll();
  const categoryId = Object.fromEntries(categories.map(c => [c.name, c.id]));

  for (const row of productsRows) {
    const supplier = txt(row['Поставщик']);

    await Product.create({
      article: txt(row['Артикул']),
      name: txt(row['Наименование товара']),
      author: supplier,
      categoryId: categoryId[txt(row['Категория товара'])],
      unit: txt(row['Единица измерения']) || 'шт.',
      price: num(row['Цена']),
      discount: num(row['Действующая скидка']),
      stock: num(row['Кол-во на складе']),
      supplier,
      manufacturer: txt(row['Производитель']),
      description: txt(row['Описание товара']),
      imagePath: txt(row['Фото']) || 'picture.png',
      isActive: true
    });
  }

  const products = await Product.findAll();
  const productId = Object.fromEntries(products.map(p => [p.article, p.id]));

  const users = await User.findAll();
  const userId = Object.fromEntries(users.map(u => [u.fullName, u.id]));

  for (const row of read('Заказ_import.xlsx')) {
    const order = await Order.create({
      orderNumber: txt(row['Номер заказа']),
      orderDate: date(row['Дата заказа']),
      deliveryDate: date(row['Дата доставки']),
      pickupPointId: num(row['Адрес пункта выдачи']),
      userId: userId[txt(row['ФИО авторизированного клиента'])] || null,
      clientFullName: txt(row['ФИО авторизированного клиента']),
      receiveCode: txt(row['Код для получения']),
      status: txt(row['Статус заказа'])
    });

    for (const item of parseItems(row['Артикул заказа'])) {
      if (productId[item.article]) {
        await OrderItem.create({
          orderId: order.id,
          productId: productId[item.article],
          quantity: item.quantity
        });
      }
    }
  }

  console.log('Импорт завершён');
  process.exit();
}

start().catch(error => {
  console.log(error);
  process.exit(1);
});