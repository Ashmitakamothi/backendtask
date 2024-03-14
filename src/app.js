
const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const db = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', usersRoutes);

// Start the server and connect to the database
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database at:', res.rows[0].now);
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});
