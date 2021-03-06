const mongoose = require('mongoose');
const { mongoURI } = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error.message);
    // Terminate process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
