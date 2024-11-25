let express = require('express');
const passport = require('passport');
let router = express.Router();
let jwt = require('jsonwebtoken');
let DB = require('../config/db');
//initial statements
let userModel = require('../models/user');
let User = userModel.User;


//diaply home
module.exports.displayHomePage = (req, res, next)=>{
    res.render('index', { 
        title: 'Home',
        displayName: req.user ? req.user.displayName:''    
    });
}




//display login
module.exports.displayLoginPage = (req, res,next) => {
    if (!req.user)
    {
        res.render('auth/login',
        {
            title: 'Login',
            message: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName: ''
        })
    }
    else
    {
        return res.redirect('/')
    }
}
//process login
module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',(err,user, info)=>
    {
        
        if(err)
        {
            return next(err);
        }
        
        if(!user)
        {
            req.flash('loginMessage',
            'AuthenticationError');
            return res.redirect('/login');
        }
        req.login(user,(err) => {
            if(err)
            {
                return next(err)
            }
            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.secret, {
                expiresIn: 604800 
            });

            res.json({success: true, msg: 'User Logged in Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }, token: authToken});
            
 
        });
    })(req,res,next)
}
//display registartion page
module.exports.displayRegisterPage = (req,res,next)=>{
    // check if the user is not logged in currently
    if(!req.user)
    {
        res.render('auth/register',
            {
                title: 'Register',
                message: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName: ''
            })
    }
    else
    {
        return res.redirect('/')
    }
}
//process registartion page
module.exports.processRegisterPage = (req,res,next) => {
    let newUser = new User({
        username: req.body.username,
        email:req.body.email,
        displayName: req.body.displayName
    })
    User.register(newUser, req.body.password, (err) =>{
        if(err)
        {
            console.log("Error: Inserting the new user");
            if(err.name=="UserExistsError")
                {
                    req.flash('registerMessage',
                    'Registration Error: User Already Exists');
                }
            return res.render('auth/register',
            {
                title:'Register',
                message: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName:''
            });
        }
        else
        {
            return passport.authenticate('local')(req,res,()=>{
                res.redirect('/concerts-list');
            })    
        }
    })
}

//logout application
module.exports.performLogout = (req,res,next)=>
{
        
    req.logout(function(err){
        if(err){
            return next(err);
        }
    })
    res.redirect('/');
}