const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { pushFeedback, feedbackHasBeenViewed } = require('../startup/socket');
const { Feedback, validateFeedback } = require('../models/Feedback');

router.get('/', [auth, admin], async (req, res) => {
  const feedbacks = await Feedback.find();
  return res.send(feedbacks);
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const feedback = await Feedback.findByIdAndRemove(req.params.id);
  if (!feedback) return res.status(400).send('Feedback with given id was not found.');

  feedbackHasBeenViewed(feedback.id);

  return res.send(feedback);
});

router.post('/', [auth], async (req, res) => {
  const values = req.body;
  const { error } = validateFeedback(values);
  if (error) return res.status(400).send(error.details[0].message);

  const feedback = new Feedback({
    name: values.name,
    email: values.email || '',
    phone: values.phone,
    feedbackMessage: values.feedbackMessage,
  });

  await feedback.save();

  pushFeedback(feedback);

  return res.send(feedback);
});

module.exports = router;
