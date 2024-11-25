let express = require('express');
let router = express.Router();
let indexController = require('../controller/index');
let jwt = require('jsonwebtoken');


//get home pages (one with /home one without)
router.get('/', indexController.displayHomePage);
router.get('/home', indexController.displayHomePage);

//get other pages 

router.get('/concerts',indexController.displayServicePage);

router.get('/login',indexController.displayLoginPage);

router.post('/login',indexController.processLoginPage);

router.get('/register',indexController.displayRegisterPage);

router.post('/register',indexController.processRegisterPage);

router.get('/logout',indexController.performLogout);
module.exports = router;
