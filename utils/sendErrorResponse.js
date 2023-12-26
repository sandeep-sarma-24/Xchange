const sendErrorResponse = (res, status, message) => {
    res.status(status).json({ error: message });
};

module.exports = sendErrorResponse;
