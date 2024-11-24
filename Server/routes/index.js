var express = require('express');
var router = express.Router();

/* GET home page. */
/* Creates a route to each accessible page on the website*/
router.get('/', function(req, res, next) {
  res.render('mainPage', { title: 'Home Page' });
});

router.get('/aboutMe', function(req, res, next) {
  res.render('aboutMe', { title: 'About Me' });
});
router.get('/mainPage', function(req, res, next) {
  res.render('mainPage', { title: 'Home Page' });
});
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});
router.get('/contactMe', function(req, res, next) {
  res.render('contactMe', { title: 'Contact Me' });
});
router.get('/submitComplete', function(req, res, next) {
  res.render('submitComplete', { title: 'Submission Complete' });
});

module.exports = router;
