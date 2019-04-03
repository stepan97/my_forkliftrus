const mongoose = require('mongoose');

module.exports = function validateObjectId(req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }

  const err = new Error('Invalid id.');
  err.status = 400;
  return next(err);
};
