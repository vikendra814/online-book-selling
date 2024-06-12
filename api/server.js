require("dotenv").config();

const express = require("express");

let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true }));

const cors = require("cors");
app.use(cors());

// Make an uploads folder -> Inside that create thumbnail and books folder in which the book pdf and thumbnail images will be stored respectively.
app.use('/uploads', express.static(__dirname + '/uploads/thumbnail'));
app.use('/profileUploads', express.static(__dirname + '/uploads/books'));

app.use("/", require("./middleware/validate").extractHeaderLanguage);
app.use("/", require("./middleware/validate").validateHeaderToken);

const auth = require("./modules/v1/auth/route");
const home = require("./modules/v1/home/route");

app.use("/api/v1/auth", auth);
app.use("/api/v1/home", home); 

try {
  app.listen(process.env.PORT);
  console.log(`Server Running at Port: ${process.env.PORT}`);
} catch (error) {
  console.log("failed" + error);
}
