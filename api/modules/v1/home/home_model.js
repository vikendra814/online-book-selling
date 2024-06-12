const conn = require("../../../config/database");
const { error } = require("../../../languages/en");
const constant = require("../../../config/constant");
const common = require("../../../config/common");
var asyncLoop = require("node-async-loop");

var home = {
  addBook: function (request, callback) {
    var ins = {
      user_id: request.user_id,
      title: request.body.title,
      author: request.body.author,
      thumbnail: request.body.thumbnail,
      pdf_of_book: request.body.book_pdf,
      no_of_pages: request.body.no_of_pages,
      price: request.body.price,
      tags: request.body.tags,
    };
    conn.query(`INSERT INTO tbl_book SET ?`, ins, (error, result) => {
      if (!error) {
        callback("1", { keyword: "success", content: "" }, result);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "comment post" } },
          []
        );
      }
    });
  },

  bookListing: function (request, callback) {
    var pr = "";
    if (request.body.search != undefined && request.body.search != "") {
      pr = `and title like '%${request.body.search}%'`;
    }

    const limit = request.body.limit ? parseInt(request.body.limit) : 1;
    const page = request.body.page ? parseInt(request.body.page) : 1;
    const offset = (page - 1) * limit;

    const q = `SELECT SQL_CALC_FOUND_ROWS  *,DATE_FORMAT(created_at, '%d-%m-%Y') as cdate,CONCAT('${constant.THUMBNAIL}',thumbnail) AS thumbnail,CONCAT('${constant.BOOK}',pdf_of_book) AS book from tbl_book where is_active=1 AND is_delete=0 AND user_id=${request.user_id} ${pr} LIMIT ${limit} OFFSET ${offset}`;
    conn.query(q, function (error, result) {
      if (!error) {
        conn.query("SELECT FOUND_ROWS() as total", function (err, res) {
          if (!err) {
            const totalRecords = res[0].total;
            const totalPages = Math.ceil(totalRecords / limit);
            callback(
              "1",
              { keyword: "list_success", content: "" },
              {
                book: result,
                totalPages: totalPages,
                currentPage: page,
              }
            );
          } else {
            callback(
              "0",
              {
                keyword: "error",
                content: { error: "fetching the total count" },
              },
              []
            );
          }
        });
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "fetching the user" } },
          []
        );
      }
    });
  },

  deleteBook: function (request, callback) {
    conn.query(
      `update tbl_book set is_delete=1 where id=?`,
      [request.body.id],
      function (error, result) {
        if (!error) {
          callback("1", { keyword: "list_success", content: "" }, result);
        } else {
          callback("0", { keyword: "no_data", content: "" }, []);
        }
      }
    );
  },

  //userside api

  allBookListing: function (request, callback) {
    var pr = "";
    if (request.body.search != undefined && request.body.search != "") {
      pr = `AND title LIKE '%${request.body.search}%'`;
    }

    const q = `SELECT *, DATE_FORMAT(created_at, '%d-%m-%Y') AS cdate, CONCAT('${constant.THUMBNAIL}', thumbnail) AS thumbnail, CONCAT('${constant.BOOK}', pdf_of_book) AS book FROM tbl_book WHERE is_active = 1 AND is_delete = 0 ${pr}`;
    conn.query(q, function (error, result) {
      if (!error) {
        callback("1", { keyword: "list_success", content: "" }, result);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "fetching the user" } },
          []
        );
      }
    });
  },

  placeOrder: function (req, callback) {
    const getCart = `SELECT 
                          c.*, b.* 
                      FROM 
                          tbl_cart c
                      JOIN
                          tbl_book b
                      ON
                          c.book_id = b.id
                      WHERE 
                          c.user_id = '${req?.user_id}' AND 
                          b.is_active = 1 AND b.is_delete = 0;`;

    conn?.query(getCart, function (error, cart) {
      if (!error && cart.length > 0) {
        const sub_total = cart.reduce((a, v) => (a = a + v.qty * v.price), 0);
        const charge = 50;
        const orderData = {
          user_id: req?.user_id,
          order_no: `BOOK${Date.now()}`,
          quantity: cart.reduce((a, v) => (a = a + v.qty), 0),
          sub_total: sub_total,
          delivery_charge: charge,
          total: sub_total + charge,
          status: "pending",
        };
        const order = `INSERT INTO tbl_order SET ?;`;
        conn.query(order, orderData, function (error, orderData) {
          if (!error) {
            asyncLoop(
              cart,
              (item, next) => {
                const detailsData = {
                  order_id: orderData.insertId,
                  book_id: item.book_id,
                  qty: item.qty,
                  per_book_price: item.price,
                  total: item.qty * item.price,
                };
                const detailsQuery = `INSERT INTO tbl_order_details SET ?`;
                conn?.query(
                  detailsQuery,
                  [detailsData],
                  function (error, result) {
                    if (error) {
                      next(error);
                    } else {
                      next();
                    }
                  }
                );
              },
              function (error) {
                if (error) {
                  callback(
                    "0",
                    {
                      keyword: "error",
                      content: { error: "adding order details" },
                    },
                    []
                  );
                } else {
                  const cartDelete = `delete from tbl_cart  WHERE user_id = '${req?.user_id}';`;

                  conn?.query(cartDelete, function (error, result) {
                    if (!error && result.affectedRows > 0) {
                      callback(
                        "1",
                        { keyword: "order_placed", content: "" },
                        []
                      );
                    } else {
                      callback(
                        "0",
                        {
                          keyword: "error",
                          content: { error: "deleting the cart" },
                        },
                        []
                      );
                    }
                  });
                }
              }
            );
          } else {
            callback(
              "0",
              { keyword: "error", content: { error: "placing the order" } },
              []
            );
          }
        });
      } else if (!error) {
        callback("0", { keyword: "no_data", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "fetching the cart" } },
          []
        );
      }
    });
  },
  //cart related apis

  addToCart: function (req, callback) {
    const { book_id, quantity } = req?.body;
    common?.checkCart(req?.user_id, book_id, function (response, data) {
      if (response === true) {
        if (quantity !== 0) {
          const cartUpdate = `UPDATE tbl_cart SET qty = ${quantity} WHERE user_id = ${req?.user_id} AND 
                                book_id = ${book_id}`;

          conn.query(cartUpdate, function (error, cart) {
            if (!error && cart.affectedRows > 0) {
              callback("1", { keyword: "success_cart", content: "" }, []);
            } else {
              callback(
                "0",
                {
                  keyword: "error",
                  content: { error: "updating the cart quantity" },
                },
                []
              );
            }
          });
        } else {
          const cartDelete = `DELETE FROM tbl_cart WHERE user_id = '${req?.user_id}' AND book_id = '${book_id}'`;

          conn.query(cartDelete, function (error, cart) {
            if (!error && cart.affectedRows > 0) {
              callback("1", { keyword: "delete_cart", content: "" }, []);
            } else {
              callback(
                "0",
                {
                  keyword: "error",
                  content: { error: "removing the cart quantity" },
                },
                []
              );
            }
          });
        }
      } else if (data.length === 0) {
        const queryData = {
          user_id: req?.user_id,
          book_id: book_id,
          qty: quantity,
        };

        const cart = `INSERT INTO tbl_cart SET ?;`;

        conn.query(cart, queryData, function (error, cartData) {
          if (!error) {
            callback("1", { keyword: "success_cart", content: "" }, []);
          } else {
            callback(
              "0",
              { keyword: "error", content: { error: "adding to cart" } },
              []
            );
          }
        });
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "checking the cart" } },
          []
        );
      }
    });
  },

  listingCart: function (req, callback) {
    const { book_id } = req?.body;

    let bookCondition = "";
    if (book_id !== undefined && book_id !== null && book_id !== "") {
      bookCondition = `AND c.book_id = '${book_id}'`;
    } else {
      bookCondition = ``;
    }

    const cart = `SELECT 
                      c.*, b.*, CONCAT('${constant.THUMBNAIL}', b.thumbnail) AS thumbnail_image,
                      CONCAT('${constant.BOOK}', b.pdf_of_book) AS book 
                  FROM 
                      tbl_cart c 
                  JOIN 
                      tbl_book b 
                  ON 
                      c.book_id = b.id 
                  WHERE 
                      c.user_id = '${req?.user_id}' ${bookCondition};`;

    conn.query(cart, function (error, result) {
      if (!error) {
        callback("1", { keyword: "success_cart", content: "" }, result);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "listing cart" } },
          []
        );
      }
    });
  },

  //user side order
  OrderDetails: function (request, callback) {
    const q = `select *,DATE_FORMAT(created_at, '%d-%m-%Y') as cdate from tbl_order where user_id=${request.user_id}`;
    conn.query(q, function (error, result) {
     
      if (!error) {
        callback("1", { keyword: "list_success", content: "" }, result);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "fetching the user" } },
          []
        );
      }
    });
  },

  orderListing: function (request, callback) {
    const q = `select *,DATE_FORMAT(created_at, '%d-%m-%Y') as cdate from tbl_order`;
    conn.query(q, function (error, result) {
      if (!error) {
        callback("1", { keyword: "list_success", content: "" }, result);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "fetching the user" } },
          []
        );
      }
    });
  },


  updateStatus: function(request, callback) {
    let response = "rejected";
    if (request.body.res === "accept") {
      response = "accepted";
    }
    const q = `UPDATE tbl_order SET status =? WHERE id =?`;
    conn.query(q, [response, request.body.id], function(error, result) {
      if (!error) {
        callback("1", { keyword: "Update_success", content: "" }, result);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "some error occured" } },
          []
        );
      }
    });
  },

};

module.exports = home;
