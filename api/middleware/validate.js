const Validator = require("Validator");
const { default: localizify } = require("localizify");
var en = require("../languages/en");
const { t } = require("localizify");
var bypassMethods = new Array("login", "signup");
const conn = require("../config/database");

var middleware = {
  // Check validation rules
  checkValidation: function (res, request, rules, messages) {
    const v = Validator.make(request, rules, messages);

    if (v.fails()) {
      const errors = v.getErrors();

      let error;

      for (let key in errors) {
        error = errors[key][0];
        break;
      }

      const response = {
        code: 0,
        message: error,
        data: [],
      };

      res.status(400).send(response);

      return false;
    } else {
      return true;
    }
  },

  // Extracting language
  extractHeaderLanguage: function (req, res, callback) {
    let header_lang =
      req.headers["accept_language"] != undefined &&
      req.headers["accept_language"] != ""
        ? req.headers["accept_language"]
        : "en";
    req.lang = header_lang;
    req.language = header_lang == "en" ? en : en;

    localizify.add("en", en).add("en", en).setLocale(header_lang);

    callback();
  },

  // Convert language
  getMessage: function (language, message, callback) {
    callback(t(message.keyword, message.content));
  },

  //for checking the validation of the token to get user id
  validateHeaderToken: function (req, res, callback) {
    var headertoken =
      req.headers["token"] != undefined && req.headers["token"] != ""
        ? req.headers["token"]
        : "";

    var path = req.path.split("/");

    if (bypassMethods.indexOf(path[4]) === -1) {
      if (headertoken != "") {
        try {
          if (headertoken != "") {
            conn.query(
              "SELECT * from tbl_user WHERE token = ? ",
              [headertoken],
              function (error, result) {
                if (!error && result.length > 0) {
                  req.user_id = result[0].id;

                  callback();
                } else {
                  response_data = {
                    code: 0,
                    message: t("rest_keyword_invalid_token"),
                  };

                  res.status(401);
                  res.send(response_data);
                }
              }
            );
          } else {
            response_data = {
              code: 0,
              message: t("token_not_provided"),
            };

            res.status(401);
            res.send(response_data);
          }
        } catch (error) {
          console.log(error);

          response_data = {
            code: 0,
            message: t("rest_keyword_invalid_token"),
          };

          res.status(401);
          res.send(response_data);
        }
      } else {
        response_data = {
          code: 0,
          message: t("token_not_provided"),
        };

        res.status(401);
        res.send(response_data);
      }
    } else {
      callback();
    }
  },
};

module.exports = middleware;
