const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.json());

app.use(cors());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  port:'3306',
  user: 'root',
  password: '',
  database: 'user'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// User Sign-Up Endpoint
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Insert the user into the database
  connection.query('INSERT INTO login (username, email, password) VALUES (?, ?, ?)', [username, email, password], (error, results, fields) => {
    if (error) {
      console.error('Error signing up:', error);
      res.status(500).send('Error signing up');
      return;
    }
    res.status(201).send('User signed up successfully');
  });
});

// User Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
    if (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Error logging in');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Invalid username or password');
    } else {
      res.status(200).send('User logged in successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
