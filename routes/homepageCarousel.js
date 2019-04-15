const router = require('express').Router();
const { DEFAULT_PRODUCT_IMAGE } = require('./contacts');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { HomepageCarousel, validateHompageCarousel } = require('../models/HomepageCarousel');

router.get('/', async (req, res) => {
  const carousel = await HomepageCarousel.find();
  res.send(carousel);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const carousel = await HomepageCarousel.findById(req.params.id);

  if (!carousel) return res.status(400).send('Homepage carousel with given id was not found.');

  return res.send(carousel);
});

// create new homepage carousel item
router.post('/', [auth, admin], async (req, res) => {
  const values = req.body;

  values.image = values.image || DEFAULT_PRODUCT_IMAGE;
  values.buttonText = values.buttonText || 'Посмотреть';

  const { error } = validateHompageCarousel(values);
  if (error) return res.status(400).send(error.details[0].message);

  const homepageCarousel = new HomepageCarousel({
    title: values.title,
    description: values.description,
    image: values.image,
    buttonText: values.buttonText,
    url: values.url,
  });

  await homepageCarousel.save();

  return res.send(homepageCarousel);
});

router.put('/:id', [auth, admin], validateObjectId, async (req, res) => {
  const values = req.body;

  const { error } = validateHompageCarousel(values);
  if (error) return res.status(400).send(error.details[0].message);

  const homepageCarousel = await HomepageCarousel.findOneAndUpdate({ _id: req.params._id }, {
    title: values.title,
    description: values.description,
    image: values.image,
    buttonText: values.buttonText,
    url: values.url,
  }, { new: true });
  if (!homepageCarousel) return res.status(400).send('Homepage carousel with given id was not found.');

  return res.send(homepageCarousel);
});

router.delete('/:id', [auth, admin], validateObjectId, async (req, res) => {
  const carousel = await HomepageCarousel.findByIdAndRemove(req.params.id);
  if (!carousel) return res.status(400).send('Homepage carousel with given id was not found.');

  return res.send(carousel);
});

module.exports = router;
