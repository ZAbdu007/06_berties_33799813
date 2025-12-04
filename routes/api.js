const express = require('express');
const router = express.Router();

// GET /api  – (optional) simple info page
router.get('/', function (req, res) {
  res.send('Berties Books API. Try /api/books');
});

// Lab 9b: /api/books
// Supports:
//   ?search=world
//   ?minprice=5
//   ?max_price=10
//   ?sort=name   or   ?sort=price
router.get('/books', function (req, res, next) {

  // Start from the basic Lab 9b query:
  // "SELECT * FROM books"
  let sqlquery = 'SELECT * FROM books';

  // Extra features (Part C of Lab 9b)
  let conditions = [];
  let params = [];

  // --- Task 3: search term (e.g. ?search=world) ---
  if (req.query.search) {
    // Like in Lab 6e search extension, but now as an API filter :contentReference[oaicite:3]{index=3}
    conditions.push('name LIKE ?');
    params.push('%' + req.query.search + '%');
  }

  // --- Task 4: price range (e.g. ?minprice=5&max_price=10) ---
  if (req.query.minprice) {
    conditions.push('price >= ?');
    params.push(req.query.minprice);
  }

  if (req.query.max_price) {
    conditions.push('price <= ?');
    params.push(req.query.max_price);
  }

  // Add WHERE if we have any conditions
  if (conditions.length > 0) {
    sqlquery += ' WHERE ' + conditions.join(' AND ');
  }

  // --- Task 5: sort option (?sort=name or ?sort=price) ---
  if (req.query.sort === 'name') {
    sqlquery += ' ORDER BY name';
  } else if (req.query.sort === 'price') {
    sqlquery += ' ORDER BY price';
  }

  // Execute the SQL query – exactly like Lab 9b example, but with params
  db.query(sqlquery, params, (err, result) => {
    // Return results as a JSON object (Lab 9b style) :contentReference[oaicite:4]{index=4}
    if (err) {
      res.json(err);
      next(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
