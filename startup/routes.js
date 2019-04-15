const express = require('express');
const fileUpload = require('express-fileupload');
const error = require('../middleware/error');
const catalogues = require('../routes/catalogues');
const categories = require('../routes/categories');
const products = require('../routes/products');
const admins = require('../routes/admins');
const auth = require('../middleware/auth');
const superAdminAuth = require('../middleware/superAdmin');

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
  app.use('/catalogues', catalogues);
  app.use('/categories', categories);
  app.use('/products', products);
  app.use('/admins', [auth, superAdminAuth], admins);

  // not found (404)
  app.use('*', (req, res) => {
    res.send('not found.');
  });

  // error middleware
  app.use(error);
};
