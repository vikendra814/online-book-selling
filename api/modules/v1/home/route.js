const express = require("express");
const multer=require('multer');
var router = express.Router();
const common = require("../../../config/common");
const home_model = require("./home_model");
const { t } = require("localizify");
const middleware = require("../../../middleware/validate");
// APIs

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      cb(null, __dirname + "/../../../uploads/thumbnail");
    } else {
      cb(null, __dirname + "/../../../uploads/books");
    }
  },
  filename: function (req, file, cb) {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      const thumbnail = `${Date.now()}_thumbnail_${file.originalname}`;
      req.body.thumbnail = thumbnail;
      cb(null, thumbnail);
    } else {
      const book = `${Date.now()}_book_${file.originalname}`;
      req.body.book_pdf = book;
      cb(null, book);
    }
  },
});

const upload = multer({ storage: storage });


// book listing
router.post("/book-listing", function (req, res) {
  //console.log(req.body);
  home_model.bookListing(req, function (code, message, data) {
    common.response(req, res, code, message, data);
  });
});



router.post("/add-book", upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "book_pdf", maxCount: 1 },
]), function (req, res) {
  home_model.addBook(req, function (code, message, data) {
    common.response(req, res, code, message, data);
  });
});

router.post("/delete-book", function (req, res) {
  home_model.deleteBook(req, function (code, message, data) {
    common.response(req, res, code, message, data);
  });
});


router.post("/book-detail", function (req, res) {
  home_model.bookDetail(req, function (code, message, data) {
    common.response(req, res, code, message, data);
  });
});

//user side apis

router.post("/all-book-listing", function (req, res) {
  home_model.allBookListing(req, function (code, message, data) {
    common.response(req, res, code, message, data);
  });
});


router.post("/place-order", function (req, res) {
  home_model.placeOrder(req, function (code, message, data) {
    common.response(req, res, code, message, data);
  });
});




//cart related
router.post("/add-to-cart", function (req, res) {
  const rules = { book_id: "required", quantity: "required" };

  const message = { required: t("required") };

  if (middleware?.checkValidation(res, req.body, rules, message)) {
    home_model.addToCart(req, function (code, message, data) {
      common.response(req, res, code, message, data);
    });
  }
});

// List cart
router.post("/listing-cart", function (req, res) {
  home_model?.listingCart(req, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

router.post("/order-details", function (req, res) {
  home_model?.OrderDetails(req, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

router.post("/order-listing", function (req, res) {
  home_model?.orderListing(req, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});
router.post("/update-status", function (req, res) {
  home_model?.updateStatus(req, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});


module.exports = router;
