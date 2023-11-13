const mongoose = require("mongoose");

function ConnectDB(url) {
  mongoose.connect(url);
}

module.exports = ConnectDB;
