const router = require('express').Router();
const { Catalogue } = require('../models/Cataluge');
const { Category } = require('../models/Category');
const { Product } = require('../models/Product');

router.get('/', async (req, res) => {
  const searchKeywords = req.body.search;
  if (!searchKeywords) return res.status(400).send('No serach keywords provided.');

  const catalogues = await Catalogue.find({ title: searchKeywords });
  const categories = await Category.find({ title: searchKeywords });
  const products = await Product.find({ title: searchKeywords });

  res.send({
    catalogues,
    categories,
    products,
  });
});

module.exports = router;
