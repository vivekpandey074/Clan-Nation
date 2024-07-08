const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const authMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization)
    throw new ApiError(401, "Unauthorized-please login first");

  const token = req.headers.authorization.split(" ")[1];

  const decryptedtoken = jwt.verify(token, process.env.TOKEN_SECRET);

  req.body.userId = decryptedtoken.userId;

  next();
});

module.exports = authMiddleware;
