const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1]; // Assuming "Bearer TOKEN"
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the token using your JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to the request object
        next(); // Pass control to the next middleware
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = authenticate;
