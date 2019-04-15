const router = require('express').Router();
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const deleteImage = require('../utils/deleteImage');
const { DEFAULT_PARTNERS_URL } = require('../constants');
const { Partner } = require('../models/Partner');
const { Contact } = require('../models/Contact');

router.get('/', async (req, res) => {
  const partners = await Partner.find()
    .select('-__v');
  return res.send(partners);
});

router.post('/', [auth, admin], async (req, res) => {
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
  };

  const partner = new Partner({
    title: req.body.title || '',
    image: req.body.image || '',
  });

  await partner.save();
  contacts.partners.push(partner._id);
  await contacts.save();


  return res.send(partner);
});

router.put('/image/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { image } = req.files;
  if (!image) return res.status(400).send('No image provided.');

  const partner = await Partner.findById(req.params.id);
  if (!partner) return res.status(400).send('Partner with given id was not found.');

  const path = `${DEFAULT_PARTNERS_URL}/${Date.now()}/${image.name}`;

  image.mv(`.${path}`, async (err) => {
    // TODO: log the error
    if (err) return res.status(500).send('Could not upload image. Please try again later.');

    partner.image = path;
    await partner.save();

    return res.send(partner);
  });
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const title = req.body.title || '';

  const partner = await Partner.findOneAndUpdate({ _id: req.params.id }, {
    $set: {
      title,
    },
  }, { new: true });
  if (!partner) return res.status(400).send('Partner with given id was not found.');

  return res.send(partner);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const partner = await Partner.findByIdAndRemove(req.params.id);
  if (!partner) return res.status(400).send('Partner with given id was not found.');

  res.send(partner);

  return deleteImage(partner.image);
});

module.exports = router;
