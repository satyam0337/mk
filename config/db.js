const mongoose = require("mongoose");

const connect = async () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect('mongodb+srv://test:test@cluster0.mlcnreq.mongodb.net/?retryWrites=true&w=majority');
};
module.exports = connect;
