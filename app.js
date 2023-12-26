const express = require('express');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const usersRoutes = require('./routes/usersRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const authRoutes = require('./routes/authRoutes');
const ticketImagesRoute = require('./routes/ticketImagesRoutes');
const profileRoutes = require('./routes/profileRoutes'); 
const imageRoutes = require('./routes/imageRoutes');
const ticketRoutes = require('./routes/ticketRoutes');


const app = express();
app.use(express.json());
app.use(cors());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/messages', messagesRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/auth', authRoutes);
app.use('/api/tickets', ticketImagesRoute);
app.use('/api', profileRoutes);
app.use('/api', imageRoutes);
app.use('/api', ticketRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
