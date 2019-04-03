const router = require('express').Router();
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const { Product, validateProduct } = require('../models/Product');

// returns products in a category
router.get('/fromCategory/:id', validateObjectId, async (req, res) => {
  const products = await Product.find({
    category: req.params.id,
  });

  return res.send(products);
});

// get a product by id
router.get('/:id', validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(400).send('Product with given id was not found.');

  return res.send(product);
});

// creates a new product
router.post('/', auth, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product(req.body);

  await product.save();

  return res.send(product);
});

// edit an existing product
router.put('/:id', auth, validateObjectId, async (req, res) => {
  const values = req.body;
  const product = await Product.findOneAndUpdate({ _id: req.params.id }, {
    title: values.title,
  }, { new: true });
  if (!product) return res.status(400).send('Product with given id was not found.');

  return res.send(product);
});


// delete a product
router.delete('/:id', auth, validateObjectId, async (req, res) => {
  const product = await Product.findOneAndRemove({ _id: req.params.id });
  if (!product) return res.status(400).send('Product with given id was not found.');

  return res.send(product);
});

module.exports = router;
