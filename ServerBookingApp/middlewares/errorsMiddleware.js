const errorsMiddleware = (err, req, res, next) => {
  res.status(res.statusCode);
  res.json({
    data: {
      mes: err.message,
      data: null,
      success: false,
    },
  });
};
module.exports = {
  errorsMiddleware,
};
