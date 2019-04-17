const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const CallOrdersController = require('../controllers/callsController');
const { CallOrder, validateCallOrder } = require('../models/CallOrder');
const { newCallOrder  } = require('../startup/socket');

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const call = await CallOrdersController.getById(req.params.id);
  if (!call) return res.status(400).send('Call with given id was not found.');

  return res.send(call);
});

router.post('/', async (req, res) => {
  const result = await CallOrdersController.post(req.body);
  if (result.error) return res.status(400).send({ error: result.error });

  // emit socket event to admins
  newCallOrder(result.data);

  return res.send(result.data);
});

module.exports = router;
