/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const auth = require('../middleware/auth');
const { User, validateUser } = require('../models/User');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-_v -password');
  if (!user) return res.status(400).send('User with given id was not found.');

  return res.send(user);
});

// forgot password
router.get('/forgotPassword', async (req, res) => {
  const { email } = req.query;

  const { error } = Joi.validate({ email }, { email: Joi.string().email().required() });
  if (error) return res.status(400).send(error.details[0].message);

  // TODO: create token
  // TODO: update user in db
  // TODO: send email

  return res.send('Check Your email.');
});

// reset password
router.get('/reset/:token', async (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(400).send('Invalid token.');

  const user = await User.findOne({ passwordResetToken: token });
  if (!user) return res.status(400).send('Invalid token.');

  // TODO: generate new password
  const password = '';
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const userToken = user.generateAuthToken();

  return res.send({ token: userToken });
});

// Edit user
router.put('/', auth, async (req, res) => {
  const values = req.body;
  const { error } = validateUser(values);
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);
  values.password = await bcrypt.hash(values.password, salt);

  const user = await User.findByIdAndUpdate(req.user._id, values, { new: true });
  if (!user) return res.status(400).send('User not found.');

  const token = user.generateAuthToken();

  return res.send({ token });
});

router.delete('/:id', auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.user._id);
  if (!user) return res.status(400).send('User not found.');

  return res.send('Removed.');
});

module.exports = router;
