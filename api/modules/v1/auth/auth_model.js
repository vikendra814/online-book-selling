const conn = require("../../../config/database");
const md5 = require("md5");
const common = require("../../../config/common");
const randomToken=require("random-token")

var auth = {
  // Login
  login: function (request, callback) {
    const { email, password } = request;
    const newToken = randomToken(16)
    const login = `SELECT * FROM tbl_user WHERE email = '${email}' AND password = '${md5(password)}' AND is_active = 1 AND is_deleted = 0;`;
    const tokenUpadte=`update tbl_user set token='${newToken}' WHERE email = '${email}' AND password = '${md5(password)}' AND is_active = 1 AND is_deleted = 0;`

    conn.query(login, function (error, userData) {
      if (!error && userData.length > 0) {
        conn.query(tokenUpadte, function (error, token) {
          if(!error){
            userData[0].token = newToken;
            callback("1", { keyword: "login_success", content: "" }, userData);
          }
          else{
            callback("0", { keyword: "login_failed", content: "" }, null);
          }

        });
      } else if (!error) {
        callback("0", { keyword: "invalid_credentials", content: "" }, []);
      } else {
        callback("0", { keyword: "error", content: { error: "login" } }, []);
      }
    });
  },

  signup: function (request, callback) {
    const { username, email, password ,role,gender} = request;
    console.log(request);

    const userData = {
      username: username,
      email: email,
      password: md5(password),
      token:randomToken(16),
      Role:role,
      gender:gender,
    };
    const signup = `INSERT INTO tbl_user SET ?;`;

    common.uniqueEmail(email, function (response, data) {
      if (response === true) {
        common.uniqueUsername(username, function (response, data) {
          if (response === true) {
            conn.query(signup, [userData], function (error, registered) {
              if (!error && registered.insertId > 0) {
                common.getUser(registered.insertId, function (userData) {
                  callback(
                    "1",
                    { keyword: "signup_success", content: "" },
                    userData
                  );
                });
              } else {
                callback(
                  "0",
                  { keyword: "error", content: { error: "signup" } },
                  []
                );
              }
            });
          } else if (response === false && data.length > 0) {
            callback("0", { keyword: "username_exists", content: "" }, []);
          } else {
            callback(
              "0",
              {
                keyword: "error",
                content: { error: "checking unique username" },
              },
              []
            );
          }
        });
      } else if (response === false && data.length > 0) {
        callback("0", { keyword: "email_exists", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "checking unique email" } },
          []
        );
      }
    });
  },
};

module.exports = auth;
