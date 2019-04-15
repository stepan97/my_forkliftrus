const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const deleteImage = require('../utils/deleteImage');
const { ShippingAndPayment, validateDelivery, validateShipping } = require('../models/ShippingAndPayment');

router.get('/', async (req, res) => {
  const shippingAndPayment = await ShippingAndPayment.findOne();
  res.send(shippingAndPayment);
});

router.put('/', [auth, admin], async (req, res) => {
  const values = req.body;

  const { error } = validateDelivery(values);
  if (error) return res.status(400).send(error.details[0].message);

  const shippingAndPayment = await ShippingAndPayment.findOne();
  if (!shippingAndPayment) {
    // if (!values.shippingMethods) values.shippingMethods = [];
    // if (!values.delivery) values.delivery = [];
    values.shippingMethods = [];

    const model = new ShippingAndPayment({
      shippingMethods: values.shippingMethods,
      delivery: values.delivery,
      conclusion: values.conclusion,
    });

    await model.save();

    return res.send(model);
  }

  shippingAndPayment.delivery = values.delivery;
  shippingAndPayment.conclusion = values.conclusion;

  await shippingAndPayment.save();

  return res.send(shippingAndPayment);
});

// upload image for shipping method
router.put('/shippingMethods/image/:id', [auth, admin, validateObjectId], async (req, res) => {
  if (!res.files.image) return res.status(400).send('No image provided.');

  const values = {
    title: req.body.title,
    image: '',
  };

  const { error } = validateShipping(values);
  if (error) return res.status(400).send(error.details[0].message);

  const model = await ShippingAndPayment.findOne();
  if (!model) return res.status(400).send('Nothing to edit.');

  // upload image
  // save data to db
  const { image } = req.files;
  values.image = `/static/images/products/${Date.now()}_${image.name}`;

  image.mv(`.${values.image}`, async (err) => {
    if (err) {
      // TODO: log the error
      return res.status(500).send('Could not upload image. Please try again later.');
    }

    model.shippingMethods.push(values);
    await model.save();
    return res.send(model);
  });
});

// TODO: test
// remove item from shipping methods
router.delete('/shippingMethods/image/:id', [auth, admin, validateObjectId], async (req, res) => {
  const model = await ShippingAndPayment.findOne();
  if (!model) return res.status(400).send('Nothing to delete.');

  const { shippingMethods } = model;

  const index = shippingMethods.findIndex(value => value._id === req.params.id);
  if (index < 0) return res.status(400).send('Invalid id.');

  const path = shippingMethods[index].image;
  model.shippingMethods = shippingMethods.map(val => val._id !== req.params.id);

  await model.save();

  res.send(model);

  await deleteImage(path);
});

module.exports = router;
