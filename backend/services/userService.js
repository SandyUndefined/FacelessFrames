const User = require("../models/User");

const UserService = {
  async createUser({ name, email, password }) {
    try {
      const user = await User.create({ name, email, password });
      return user;
    } catch (error) {
      console.error("Error creating a new user:", error);
      throw error;
    }
  },

  async findUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  async findUserById(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  },
};

module.exports = UserService;
