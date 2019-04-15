module.exports = function error(err, req, res, next) {
  // const error = {
  //     status: err.status || 500,
  //     message: err.message || "Something failed.",
  //     data: null,
  //     error: err.message || "Internal server error."
  // };

  // if(error.status >= 500)
  console.log('ERROR:', err);
  res.status(500).send(err);

  // res.status(error.status).send(error);
};
