const express = require('express');
const fileUpload = require('express-fileupload');
const error = require('../middleware/error');
const catalogues = require('../routes/catalogues');
const categories = require('../routes/categories');
const products = require('../routes/products');

module.exports = function initRoutes(app) {
  app.use(express.json());

  // allow CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use('/static', express.static('static'));
  app.use(fileUpload());
  app.use('/catalogues', catalogues);
  app.use('/categories', categories);
  app.use('/products', products);

  app.use('*', (req, res) => {
    res.send('not found.');
  });

  app.use(error);
};
