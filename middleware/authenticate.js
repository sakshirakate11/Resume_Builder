const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied! No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user data from the token
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).send('Invalid token!');
    }
};

module.exports = { authenticate };