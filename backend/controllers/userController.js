const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userController = {
    async register(req, res) {
      const { name, email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
          return res.status(409).json({ message: "Email already in use" });
        }
  
        const newUser = await User.createUser({
          name,
          email,
          password: hashedPassword
        });
  
        const token = jwt.sign(
          { userId: newUser.id, email: newUser.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
  
        res.status(201).json({ token, userId: newUser.id, email: newUser.email });
      } catch (error) {
        console.error('Registration Error:', error); // Log detailed error
        res.status(500).json({ message: 'Could not register user', error: error.message });
      }
    },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, userId: user.id, email: user.email });
    } catch (error) {
      res.status(500).json({ message: 'Could not log in' });
    }
  }
};

module.exports = userController;
