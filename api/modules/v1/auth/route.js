const express = require("express");
var router = express.Router();
const common = require("../../../config/common");
const auth_model = require("./auth_model");
const { t } = require("localizify");
const middleware = require("../../../middleware/validate");
// APIs

// Login
router.post("/login", function (req, res) {
  const rules = { email: "required", password: "required" };
  const messages = { required: t("required") };

  if (middleware.checkValidation(res, req.body, rules, messages)) {
    auth_model.login(req.body, function (code, message, data) {
      common.response(req, res, code, message, data);
    });
  }
});

// Signup
router.post("/signup",function (req, res) { 
  const rules = {
    username: "required",
    email: "required",
    password: "required",
  };
  const messages = { required: t("required") };

  if (middleware.checkValidation(res, req.body, rules, messages)) {
    auth_model.signup(req.body, function (code, message, data) {
      common.response(req, res, code, message, data);
    });
  }
});

module.exports = router;

