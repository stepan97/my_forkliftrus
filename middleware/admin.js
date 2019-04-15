module.exports = function admin(req, res, next) {
  // if (!req.user.roles.isAdmin) return res.status(403).send('Access denied.');

  return next();
};
