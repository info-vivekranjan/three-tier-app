const mongoose = require("mongoose");

const connect = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Successfully connected to database");
  } catch (error) {
    console.error("DB connection failed, retrying in 5 seconds...", error.message);

    setTimeout(connect, 5000); // retry after 5 sec
  }
};

module.exports = connect;