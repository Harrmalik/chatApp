var express = require('express');
var router = express.Router();


module.exports = function(passport){
    
    /* GET home page. */
    router.get('/', function(req, res, next) {
        if(req.user) {
            successRedirect: '/auth/success';
            res.render('index', { title: "Chirp"});
        }
    	console.log("request is " + req.user.username);
    	res.render('index', { title: "Chirp"});
    });

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        console.log(req.body);
        res.send({state: 'failure', user: null, message: "eeff"});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;

};