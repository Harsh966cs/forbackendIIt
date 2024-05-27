const bcrypt = require('bcrypt');
const User = require('./userMode'); // Corrected file name from 'userMode' to 'userModel'
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connection = require('./dbConfig'); // Corrected spelling from 'conection' to 'connection'
const jwt = require('jsonwebtoken');
const auth = require('./auth')
app.use(bodyParser.json());
const port = process.env.PORT || 1000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
   
    if (existingUser) {
      return res.status(409).send("User already exists");
    }
    else
    {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        email,
        password: hashedPassword
      });
  
      // Save the user
      const savedUser = await user.save();
      res.status(201).send({
        message: "User created successfully",
        user: savedUser
      });
    }

    // Hash the password
   
  } catch (error) {
    res.status(500).send({
      message: "Error creating user",
      error
    });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare password
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({
        message: "Password does not match"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email
      },
      "RANDOM-TOKEN",
      { expiresIn: "24h" }
    );

    res.status(200).send({
      message: "Login successful",
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).send({
      message: "Error logging in",
      error
    });
  }
});

// free endpoint
app.get('/free-endpoint', (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get('/auth-endpoint', auth,(request, response) => {
  response.json({ message: "You are authorized to access me" });
});

app.listen(port, () => {
  console.log("Server listening at port", port);
});

connection();
