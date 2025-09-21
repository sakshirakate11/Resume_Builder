// index.js

// Load environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db'); // Import the database connection
const { authenticate } = require('./middleware/authenticate'); // Import middleware

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Default route - Serve the signup page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Signup Route - Register a new user
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).send('Username already exists. Please choose a different username.');
        }

        // Hash the password using bcrypt for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the MySQL users table
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send('User registered successfully!');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup. Please try again.');
    }
});

// Login Route - Authenticate a user
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Retrieve the user from the database
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(404).send('User not found!');
        }

        const user = rows[0];

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials!');
        }

        // Generate a JSON Web Token (JWT) for the user
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login. Please try again.');
    }
});

// Account Details Route
app.get('/account', authenticate, async (req, res) => {
    try {
        // Retrieve user account details from the database
        const [rows] = await db.query('SELECT username, email, created_at FROM users WHERE username = ?', [req.user.username]);

        if (rows.length === 0) {
            return res.status(404).send('Account details not found.');
        }

        res.json({
            username: rows[0].username,
            email: rows[0].email,
            createdAt: rows[0].created_at,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching account details.');
    }
});


// Example Protected Route
app.get('/protected', authenticate, (req, res) => {
    res.json({ username: req.user.username });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));