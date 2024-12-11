const mongoose = require("mongoose");
// require("dotenv").config()

const connectDatabase = async () => {
  try {
    const databaseConfig = "mongodb://127.0.0.1/graduateKMA";
    // const URL = `mongodb+srv://hoangvu1872k2:20d6aEd8ScyOYIhJ@cluster0.tloqv3t.mongodb.net/?retryWrites=true&w=majority`;
    const connect = await mongoose.connect(databaseConfig);
    // const connect = await mongoose.connect(URL);
    console.log(`da ket noi mongodb: ${connect.connection.host}`);
  } catch (error) {
    console.log("chua the ket noi toi mongodb");
    console.log(error);
  }
};

module.exports = connectDatabase;
