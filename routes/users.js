const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middleware for protected routes
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/users/login');
  } else {
    next();
  }
};

// REGISTER (GET)
router.get('/register', (req, res) => {
  res.render('register.ejs');
});

// REGISTER (POST)
router.post('/registered', (req, res, next) => {
  const plainPassword = req.body.password;

  bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
    if (err) return next(err);

    const sql = `
      INSERT INTO users (username, first, last, email, hashedPassword)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      req.body.username,
      req.body.first,
      req.body.last,
      req.body.email,
      hashedPassword
    ];

    db.query(sql, params, (err) => {
      if (err) return next(err);
      res.send('Registered! <a href="/users/login">Login now</a>');
    });
  });
});

// LOGIN (GET)
router.get('/login', (req, res) => {
  res.render('login.ejs');
});

// LOGIN (POST)
router.post('/loggedin', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = 'SELECT hashedPassword FROM users WHERE username = ?';

  db.query(sql, [username], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.send('Login failed – user not found.');
    }

    const hashedPassword = results[0].hashedPassword;

    bcrypt.compare(password, hashedPassword, (err, match) => {
      if (!match) return res.send('Login failed – wrong password.');

      // success → create session
      req.session.userId = username;
      res.send('Login successful! <a href="/books/list">Go to books</a>');
    });
  });
});

// LOGOUT
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(() => {
    res.send('Logged out. <a href="/users/login">Login again</a>');
  });
});

module.exports = router;

