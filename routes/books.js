// Create a new router
const express = require("express")
const router = express.Router()
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/users/login');
  } else {
    next();
  }
};


router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});

// Get list of all books
router.get('/list', redirectLogin, function (req, res, next) {

    let sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.send(result);   // Send the book data as JSON
    });
});

// Export the router object so index.js can access it
module.exports = router
