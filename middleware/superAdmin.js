module.exports = function superAdmin(req, res, next) {
  // if (!req.user.roles.isSuperAdmin) return res.status(403).send('Access denied.');

  return next();
};
