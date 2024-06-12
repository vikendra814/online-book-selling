const url = `http://localhost:${process.env.PORT}/`;

var globals = {
  BOOK: `${url}profileUploads/`,
  THUMBNAIL:`${url}uploads/`
};

module.exports = globals;
