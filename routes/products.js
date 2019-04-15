const router = require('express').Router();
const { exists } = require('fs');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const { Product, validateProduct } = require('../models/Product');

// returns products in a category
router.get('/fromCategory/:id', validateObjectId, async (req, res) => {
  const products = await Product.find({
    category: req.params.id,
  }).select('-_v');

  return res.send(products);
});

// returns products with discount >= 0 (sale)
router.get('/sale', async (req, res) => {
  const products = await Product.find({
    discount: { $gt: 0 },
  });

  return res.send(products);
});

// get a product by id
router.get('/:id', validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id).select('-_v');

  if (!product) return res.status(400).send('Product with given id was not found.');

  return res.send(product);
});

// creates a new product
router.post('/', [auth, adminAuth], async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // TODO: test
  const product = new Product(req.body);

  await product.save();

  return res.send(product);
});

// set main image
router.put('/images/mainImage/:id', [auth, adminAuth, validateObjectId], async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).send('No image url provided.');

  exists(`.${imageUrl}`, async (fileExists) => {
    if (!fileExists) return res.status(400).send(`Image with given url does not exist: ${imageUrl}`);

    const product = await Product.findOneAndUpdate({ _id: req.params.id }, {
      $set: {
        mainImage: imageUrl,
      },
    }, { new: true });
    if (!product) return res.status(400).send('Product with given image was not found.');
    return res.send(product);
  });
});

// upload image
router.put('/images/:id', [auth, adminAuth, validateObjectId], async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send('Product with given id was not found.');

  const { images } = req.files;
  if (!images) return res.status(400).send('No files provided.');

  const date = Date.now();
  const uploadErrors = [];

  if (images instanceof Array) {
    let count = 0;
    images.forEach(async (image) => {
      count += 1;
      const path = `/static/images/products/${date}_${image.name}`;

      image.mv(`.${path}`, async (err) => {
        if (err) {
          uploadErrors.push(image.name);
        } else {
          product.images.push(path);
        }
      });

      if (count === images.length) {
        await product.save();
        return res.send(uploadErrors);
      }
    });
  } else {
    const path = `/static/images/products/${date}_${images.name}`;

    images.mv(`.${path}`, async (err) => {
      if (err) {
        return res.send([images.name]);
      }

      product.images.push(path);
      await product.save();
      return res.send([]);
    });
  }
});

// edit an existing product
router.put('/:id', [auth, adminAuth], validateObjectId, async (req, res) => {
  const values = req.body;
  const product = await Product.findOneAndUpdate({ _id: req.params.id }, {
    title: values.title,
  }, { new: true });
  if (!product) return res.status(400).send('Product with given id was not found.');

  return res.send(product);
});

// delete a product
router.delete('/:id', [auth, adminAuth], validateObjectId, async (req, res) => {
  const product = await Product.findOneAndRemove({ _id: req.params.id });
  if (!product) return res.status(400).send('Product with given id was not found.');

  return res.send(product);
});

module.exports = router;
