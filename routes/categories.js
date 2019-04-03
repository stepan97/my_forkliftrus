const router = require('express').Router();
const validateObjectId = require('../middleware/validateObjectId');
const { Category, validateCategory } = require('../models/Category');
const { Product } = require('../models/Product');

// get all categories
router.get('/', async (req, res) => {
  const categories = await Category.find()
    .populate('subcategories');

  res.send(categories);
});

// get category by id
router.get('/:id', validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate('subcategories');
  if (!category) return res.status(400).send('Category with given id was not found.');

  return res.send(category);
});

router.post('/', async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const values = req.body;

  const category = new Category({
    title: values.title,
    subcategories: [],
  });

  await category.save();

  return res.send(category);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const values = req.body;
  const { error } = validateCategory(values);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findOneAndUpdate({ _id: req.params.id }, {
    title: values.title,
    subcategories: values.subcategories || [],
  }, { new: true });
  if (!category) return res.status(400).send('Category with given id was not found.');

  return res.send(category);
});

router.delete('/:id', validateObjectId, async (req, res) => {
  const category = await Category.findOneAndRemove({ _id: req.params.id });
  if (!category) return res.status(400).send('Category with given id was not found.');

  await Product.deleteMany({ category: req.params.id });

  return res.send(category);
});

module.exports = router;
