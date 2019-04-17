const express = require('express');
// middlewares
const fileUpload = require('express-fileupload');
const auth = require('../middleware/auth');
const superAdminAuth = require('../middleware/superAdmin');
const error = require('../middleware/error');
// routes
const catalogues = require('../routes/catalogues');
const categories = require('../routes/categories');
const products = require('../routes/products');
const contacts = require('../routes/contacts');
const homepageCarousel = require('../routes/homepageCarousel');
const search = require('../routes/search');
const shippingAndPayment = require('../routes/shippingAndPayment');
const authRoutes = require('../routes/auth');
const admins = require('../routes/admins');
// socket
const callOrders = require('../routes/callOrders');
const productOrders = require('../routes/productOrders');
const feedback = require('../routes/feedback');

module.exports = function initRoutes(app) {
  app.use(express.json());

  // allow CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // static folder
  app.use('/static', express.static('static'));

  // file upload supprort
  app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp/',
  }));

  // routes
  app.get('/', (req, res) => {res.send('ok')});
  app.use('/search', search);
  app.use('/catalogues', catalogues);
  app.use('/categories', categories);
  app.use('/products', products);
  app.use('/auth', authRoutes);
  app.use('/contacts', contacts);
  app.use('/homepageCarousel', homepageCarousel);
  app.use('/shippingAndPayment', shippingAndPayment);
  app.use('/admins', [auth, superAdminAuth], admins);

  app.use('/callOrders', callOrders);
  app.use('/productOrders', productOrders);
  app.use('/feedback', feedback);

  // not found (404)
  app.use('*', (req, res) => {
    res.send('not found.');
  });

  // error middleware
  app.use(error);
};
