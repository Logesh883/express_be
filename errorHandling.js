function error_handler(status, message) {
  const err = new Error();

  err.status = status || 400;
  err.message = message;
  return err;
}
module.exports = error_handler;
