const middleware = require("../middleware/validate");
const conn = require("./database");

var common = {
  // Response
  response: (req, res, code, message, data) => {
    middleware.getMessage(req.lang, message, function (translated_message) {
      const response = {
        code: code,
        message: translated_message,
        data: data,
      };

      if (code === 0) {
        res.status(401).send(response);
      } else {
        res.status(200).send(response);
      }
    });
  },

  // Check unique username
  uniqueUsername: function (username, callback) {
    const checkUniqueUsername = `SELECT * FROM tbl_user WHERE username = '${username}' AND is_active = 1 AND is_deleted = 0;`;

    conn.query(checkUniqueUsername, function (error, isUniqueUsername) {
      if (!error && isUniqueUsername.length === 0) {
        callback(true, []);
      } else if (!error) {
        callback(false, isUniqueUsername);
      } else {
        callback(false, []);
      }
    });
  },

  checkCart: function (user_id, book_id, callback) {
    const checkUniqueUsername = `SELECT * FROM tbl_cart WHERE user_id = ${user_id} AND book_id = ${book_id}`;

    conn.query(checkUniqueUsername, function (error, result) {
      if (!error && result.length > 0) {
        callback(true, []);
      } else {
        callback(false, []);
      }
    });
  },

  // Check unique email
  uniqueEmail: function (email, callback) {
    const checkUniqueEmail = `SELECT * FROM tbl_user  WHERE email = '${email}' AND is_active = 1 AND is_deleted = 0;`;
    conn.query(checkUniqueEmail, function (error, isUniqueEmail) {
      if (!error && isUniqueEmail.length === 0) {
        callback(true, []);
      } else if (!error) {
        callback(false, isUniqueEmail);
      } else {
        console.log(error);
        callback(false, []);
      }
    });
  },

  // Get userdata
  getUser: function (id, callback) {
    const userData = `SELECT * FROM tbl_user WHERE id = '${id}' AND is_active = 1 AND is_deleted = 0;`;

    conn.query(userData, function (error, userInfo) {
      if (!error && userInfo.length > 0) {
        callback(userInfo);
      } else {
        callback([]);
      }
    });
  },
};

module.exports = common;
