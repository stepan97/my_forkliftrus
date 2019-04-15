const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { CallOrder, validateCallOrder } = require('../models/CallOrder');
const { pushCallOrder, callHasBeenViewed } = require('../startup/socket');

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const call = await CallOrder.findByIdAndRemove(req.params.id);
  if (!call) return res.status(400).send('Call with given id was not found.');

  callHasBeenViewed(call._id);

  return res.send(call);
});

router.post('/', async (req, res) => {
  const values = req.body;

  const { error } = validateCallOrder(values);
  if (error) return res.status(400).send(error.details[0].message);

  const callOrder = new CallOrder({
    name: values.name,
    phoneNumber: values.phoneNumber,
  });

  // await callOrder.save();

  // emit event to admins, TODO: handle error (re init io)
  const err = pushCallOrder(callOrder);
  if (err) console.log(err);

  return res.send('Call Order saved.');
});

module.exports = router;
