require('dotenv').config();

module.exports = {
  mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${
    process.env.DB_HOST
  }/test?retryWrites=true`,
  jwtSecret: process.env.JWT_SECRET
};
