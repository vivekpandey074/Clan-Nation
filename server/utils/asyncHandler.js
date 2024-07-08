const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(err.statusCode || 500).send({
        success: err.success,
        message: err.message || "Internal server error",
      });
    }
  };
};

module.exports = asyncHandler;
