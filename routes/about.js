const router = require('express').Router();
const About = require('../models/About');

router.get('/', async (req, res, next) => {
  const about = await About.find();
  res.send(about);
});

module.exports = router;