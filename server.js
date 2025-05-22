// server.js
require('dotenv').config(); // Load environment variables first
const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Basic route for testing
app.get('/', (req, res) => {
  res.send('School Management API is running!');
});

// API Routes
app.use('/', schoolRoutes); // Mount school routes at root so paths are /addSchool and /listSchools

// Global error handler (simple version)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // The database connection test is now in config/db.js and runs on import.
}); 