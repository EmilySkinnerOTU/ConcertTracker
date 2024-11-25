let express = require('express');
let router = express.Router();
let mongoose = require('mongoose'); 
let jwt = require('jsonwebtoken');
const concerts = require('../models/concerts'); 

//display concertlist
module.exports.displayConcertslist = (req, res, next) => {
    concerts.find((err, concertslist) => {
        if (err) {
            return console.error(err);
        } else {
            // Log testing, had issues with not definded earlier
            console.log('Concerts data being passed to template:', concertslist);
            res.render('concerts/list', {
                title: 'Concerts',
                Concertslist: concertslist,  // Make sure this matches the template variable name
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
};
//display add
module.exports.displayAddPage = (req,res,next)=> {
    res.render('concerts/add',{
        title:'Add Concert',
        displayName: req.user ? req.user.displayName:''  
    })
}
//process add
module.exports.processAddPage = (req,res,next)=> {
    let newconcert = concert ({
    "Artist":req.body.Artist,
    "Genre":req.body.Genre,
    "Date":req.body.Date,
    "Location": req.body.Location,
    "Cost":req.body.Cost
    });
    concerts.create(newconcert,(err,concerts) => {
     if(err)
     {
         console.log(err);
         res.end(err);
     }
     else
     {
         res.redirect('/concerts-list');
     }
    })
 
 }
//display edit
 module.exports.displayEditPage = (req,res,next)=> {
    let id = req.params.id;
    concerts.findById(id,(err,concertsToEdit) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.render('concerts/edit',{title:'Edit Concert', 
            concerts:concertsToEdit,
            displayName: req.user ? req.user.displayName:''  });
        }
    });
}
//process edit
 module.exports.processEditPage = (req,res,next)=> {
    let id=req.params.id;
    let updateconcerts = concerts({

        "_id":id,
        "Artist":req.body.Artist,
        "Genre":req.body.Genre,
        "Date":req.body.Date,
        "Location": req.body.Location,
        "Cost":req.body.Cost
    });
    concerts.updateOne({_id:id},updateconcerts,(err) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/concerts-list');
        }
    });
}
//delete operations
module.exports.performDelete = (req,res,next)=> {
    let id =req.params.id;
    concerts.deleteOne({_id:id},(err)=>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/concerts-list');
        }
    });
}