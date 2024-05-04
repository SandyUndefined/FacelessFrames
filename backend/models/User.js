const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {}

User.init(
  {
    // Define the model attributes
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize, // Pass the connection instance
    modelName: "User", // Define the model name
  }
);

sequelize
  .sync({ force: true }) // Use with caution!
  .then(() => {
    console.log("Tables have been created successfully.");
  })
  .catch((err) => {
    console.error("Error creating tables:", err);
  });

module.exports = User;
