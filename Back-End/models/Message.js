const mongoose = require("mongoose");
const { Schema } = mongoose;
const messageSchema = new Schema({
  message: { type: String, required: true },
  mail: { type: String, required: true },
  photo: { type: String, default: "models/no-picture.jpg" },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Message", messageSchema);
