const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { newProductOrder } = require('../startup/socket');
const ProductOrdersController = require('../controllers/productOrdersController');

router.get('/myOrders', [auth], async (req, res) => {
  const myOrders = await ProductOrdersController.getOrdersForUser(req.user._id);
  return res.send(myOrders);
});

router.get('/all', [auth, admin], async (req, res) => {
  const orders = await ProductOrdersController.getAll();
  return res.send(orders);
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const order = await ProductOrdersController.getById(req.params.id);
  if (order.error) return res.status(400).send({ error: order.error });

  return res.send(order.data);
});

router.post('/', auth, async (req, res) => {
  const result = await ProductOrdersController.post(req.user._id, req.body);
  if (result.error) return res.status(400).send({ error: result.error });

  // emit socket event to admins
  newProductOrder(result.data);

  return res.send(result.data);
});

module.exports = router;
