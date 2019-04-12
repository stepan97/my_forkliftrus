const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async (req, res, next) => {
  // const token = req.header("x-auth-token");
  // if(!token){
  //     return res.status(401).send("Forbidden. No token provided.");
  // }

  // const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  // if(!decoded) return res.status(403).send("Access denied.");

  // req.user = decoded;
  next();
};
