const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running... (Dev Mode)');
  });
}

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/playwizard', {
  serverSelectionTimeoutMS: 2000
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.warn('\n⚠️ MongoDB is not running locally or unreachable.');
    console.warn(`⚠️ The application will continue to run, but game saving will not work. (Error: ${err.message})\n`);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
