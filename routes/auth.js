const router = require('express').Router();
const { User, validateUser } = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// User login
router.post('/signin', async (req, res, next) => {
  const values = req.body;
  const { error } = validateSignIn(values);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: values.email });
  if(!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(values.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password.');

  const token = await user.generateAuthToken();

  return res.send({ token: token });
});

// User registration
router.post('/signup', async (req, res, next) => {
  const values = req.body;
  const { error } = validateUser(values);
  if (error) return res.status(400).send(error.details[0].message);

  const exists = await User.findOne({ email: values.email });
  if(exists) return res.status(400).send('User with this email already exists.');

  const user = new User({
    name: values.name,
    email: values.email,
    password: values.password
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.send({ token: token });
});

function validateSignIn(values){
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required()
  };

  return Joi.validate(values, schema);
}

module.exports = router;