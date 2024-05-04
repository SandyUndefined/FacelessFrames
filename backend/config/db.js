require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER, // user
  process.env.DB_PASSWORD,
  {
    // password
    host: process.env.DB_HOST,
    dialect: "mysql", // specify the dialect
    logging: true, // disable logging; default: console.log
  }
);

// Check if the connection is successful
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
