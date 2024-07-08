const { body, validationResult } = require("express-validator");

const registerValidator = () => {
  return [
    body("firstname").trim().notEmpty().withMessage("Please provide firstname"),
    body("lastname").trim().notEmpty().withMessage("Please provide lastname"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Please provide email")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Please provide password"),
  ];
};

const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Please provide valid email")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password").trim().notEmpty().withMessage("Please provider password"),
  ];
};

const handleValidate = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(",");

  if (errors.isEmpty()) return next();
  else {
    res.status(400).send({
      statues: false,
      message: errorMessages,
    });
  }
};

module.exports = { registerValidator, loginValidator, handleValidate };
