/* installed 3rd party packages */
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let passport = require('passport');

let passportJWT = require('passport-jwt');
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;


let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');
let app = express();
let cors = require('cors');
// create a user model instance
let userModel = require('../models/user');
let User = userModel.User;

// config mongoDB
let mongoose = require('mongoose');
let DB = require('./db');

// point mongoose to DB URI

mongoose.connect(DB.URI);
let mongDB = mongoose.connection;
mongDB.on('error',console.error.bind(console,'Connection Error:'));
mongDB.once('open', ()=> {
  console.log('connected to the MongoDB');
});
mongoose.connect(DB.URI,{useNewURIParser:true,useUnifiedTopology:true})

// Set-up Express Session
app.use(session({
  secret:"SomeSecret",
  saveUninitialized:false,
  resave:false
}))

// implement a User Authentication
passport.use(User.createStrategy());

// serialize and deserialze the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// initialize flash
app.use(flash());




let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let concertsRouter = require('../routes/concerts');



// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

let jwtoptions = {};
jwtoptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtoptions.secretOrKey = DB.secret;


app.use('/', indexRouter); 
app.use('/users', usersRouter); 
app.use('/concerts-list', concertsRouter); 


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error',
  {
    title:"Error"
  }
  );
});
let Strategy = new JWTStrategy(jwtoptions,(jwt_payload,done)=>{
  User.findById(jwt_payload.id, (err, user) => {
   if (err) return done(err, false);
   return done(null, user);
  });
});

passport.use(Strategy);
module.exports = app;
