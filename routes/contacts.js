const router = require('express').Router();
const Contact = require('../models/Contact');

// TODO: test all routes here

router.get('/', async (req, res) => {
  const contacts = await Contact.findOne();
  res.send(contacts);
});

router.get('/partners', async (req, res) => {
  const partners = await Contact.findOne()
    .select('partners');

  res.send(partners);
});

router.get('/phoneNumbers', async (req, res) => {
  const phoneNumbers = await Contact.findOne()
    .select('phoneNumbers');

  res.send(phoneNumbers);
});

router.get('/email', async (req, res) => {
  const email = await Contact.findOne()
    .select('email');
  res.send(email);
});

router.get('/address', async (req, res) => {
  const address = await Contact.findOne()
    .select('address');
  res.send(address);
});

router.get('/workingHours', async (req, res) => {
  const workingHours = await Contact.findOne()
    .select('workingHours');
  res.send(workingHours);
});

module.exports = router;
