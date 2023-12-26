const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // Check if the 'user' property exists on the request object
        if (!req.user) {
            return res.status(403).send('Access denied. No user found.');
        }

        // Check if the user's role is included in the allowed roles for the route
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send('Access denied. User does not have the required role.');
        }

        next(); // User has the required role, proceed to the next middleware
    };
};

module.exports = authorize;
