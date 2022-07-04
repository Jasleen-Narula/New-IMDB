const mongoose = require("mongoose");
require('dotenv').config()
const mongoDbUrl =
  process.env.NODE_ENV === "test"
    ? global.__MONGO_URI__ + "movieDB"
    : process.env.MONGODB_URL;

async function dbConnect() {
  try {
    const conn = await mongoose.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodb connected");
    return conn;
  } catch (e) {
    throw new Error(e);
  }
}
module.exports = dbConnect;
