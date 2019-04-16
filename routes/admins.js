const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const validateObjectId = require('../middleware/validateObjectId');
const { User } = require('../models/User');

function validate(admin) {
  const schema = {
    name: Joi.string().min(3).required(),
    password: Joi.string().required(),
  };

  return Joi.validate(admin, schema);
}

router.get('/', async (req, res) => {
  const admins = await User.find({ 'roles.isAdmin': true });
  return res.send(admins);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const admin = await User.findOne({ _id: req.params.id, 'roles.isAdmin': true });
  if (!admin) return res.status(400).send('Admin with given id was not found.');

  return res.send(admin);
});

// Add a new admin
router.post('/', async (req, res) => {
  const values = req.body;
  const { error } = validate(values);
  if (error) return res.status(400).send(error.details[0].message);

  const admin = new User({
    name: values.name,
    password: values.password,
    roles: { isAdmin: true },
    isActive: true,
  });

  if (values.email) admin.email = values.email;

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);

  await admin.save();

  return res.send('New admin created successfully.');
});

router.delete('/:id', validateObjectId, async (req, res) => {
  const admin = await User.findByIdAndRemove(req.params.id, { new: true });
  if (!admin) return res.status(400).send('Admin with given id was not found.');

  return res.send(`Admin ${admin.name} deleted.`);
});

module.exports = router;
