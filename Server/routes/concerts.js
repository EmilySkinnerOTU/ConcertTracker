let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Concerts = require('../models/concerts');
const concerts = require('../models/concerts');

//Authentication
function requireAuth(req,res,next){
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

//Router get main
router.get('/',async(req,res,next)=>{
try{
    const Concertslist = await concerts.find();
    res.render('concerts/list',{
        title:'concerts',
        displayName: req.user? req.user.displayName:'',
        Concertslist:Concertslist
    })}
    catch(err){
        console.error(err);
        res.render('concerts/list',{
            error:'Error on the server'
        })
    }
    });
    //router get home
    router.get('/home',async(req,res,next)=>{
        try{
            const Concertslist = await concerts.find();
            res.render('concerts/list',{
                title:'concerts',
                displayName: req.user? req.user.displayName:'',
                Concertslist:Concertslist
            })}
            catch(err){
                console.error(err);
                res.render('concerts/list',{
                    error:'Error on the server'
                })
            }
            });
 //router get add   
router.get('/add',async(req,res,next)=>{
    try{
        res.render('concerts/add',{
            title: 'Add Concerts',
            displayName: req.user? req.user.displayName:''
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('concerts/list',{
            error:'Error on the server'
        })
    }
});
//router post add
router.post('/add',async(req,res,next)=>{
    try{
        let newconcerts = concerts({
            "Artist":req.body.Artist,
            "Genre":req.body.Genre,
            "Date":req.body.Date,
            "Location":req.body.Location,
            "Cost":req.body.Cost
        });
        concerts.create(newconcerts).then(()=>{
            res.redirect('/concerts-list');
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('concerts/list',{
            error:'Error on the server'
        })
    }
});
//router get edit
router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const concertsEdit= await concerts.findById(id);
        res.render('concerts/edit',
            {
                title:'Edit concerts',
                displayName: req.user? req.user.displayName:'',

                concerts:concertsEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err);
    }
});
//router post edit
router.post('/edit/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        let updatedconcerts = concerts({
            "_id":id,
            "Artist":req.body.Artist,
            "Genre":req.body.Genre,
            "Date":req.body.Date,
            "Location":req.body.Location,
            "Cost":req.body.Cost
        });
        concerts.findByIdAndUpdate(id,updatedconcerts).then(()=>{
            res.redirect('/concerts-list')
        })
    }
    catch(err){
        console.error(err);
        res.render('concerts/list',{
            error:'Error on the server'
        })
    }
});
//router get delete
router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        concerts.deleteOne({_id:id}).then(()=>{
            res.redirect('/concerts-list')
        })
    }
    catch(error){
        console.error(err);
        res.render('concerts/list',{
            error:'Error on the server'
        })
    }
});
module.exports = router;
