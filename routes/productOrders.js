const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { ProductOrder, validateOrder } = require('../models/ProductOrder');
const { pushProductOrder, productOrderHasBeenViewed } = require('../startup/socket');

router.get('/myOrders', [auth], async (req, res) => {
  const myOrders = await ProductOrder.find({ user: req.user._id });
  return res.send(myOrders);
});

router.get('/all', [auth, admin], async (req, res) => {
  const orders = await ProductOrder.find();
  return res.send(orders);
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const order = await ProductOrder.findByIdAndRemove(req.params.id);
  if (!order) return res.status(400).send('Product order with given id was not found.');

  productOrderHasBeenViewed(order._id);

  return res.send(order);
});

router.post('/', auth, async (req, res) => {
  const values = req.body;
  values.user = req.user._id;

  const { error } = validateOrder(values);
  if (error) return res.status(400).send(error.details[0].message);

  const order = new ProductOrder({
    user: values.user,
    orders: values.orders,
  });

  await order.save();

  pushProductOrder(order);

  return res.send(order);
});

module.exports = router;
