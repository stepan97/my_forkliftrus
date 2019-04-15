const router = require('express').Router();
const { Contact, validateContacts } = require('../models/Contact');

// TODO: test

router.get('/', async (req, res) => {
  const contacts = await Contact.findOne()
    .populate('partners');
  res.send(contacts);
});

router.put('/', async (req, res) => {
  let contacts = await Contact.findOne();
  if (!contacts) {
    contacts = new Contact({
      email: '',
      phoneNumbers: [],
      partners: [],
      address: '',
      workingHours: '',
      mapCoordinates: { latitude: '', longitude: '' },
    });
  }

  const values = req.body;
  const { error } = validateContacts(values);
  if (error) return res.status(400).send(error.details[0].message);

  contacts.email = values.email;
  contacts.phoneNumbers = values.phoneNumbers;
  contacts.partners = values.partners;
  contacts.address = values.address;
  contacts.workingHours = values.workingHours;
  contacts.mapCoordinates = values.mapCoordinates;

  await contacts.save();

  return res.send(contacts);
});

module.exports = router;
