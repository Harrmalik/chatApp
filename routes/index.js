var express = require('express');
var router = express.Router();
//var express = require('authenticate')(passport);

/* GET home page. */
    router.get('/', function(req, res, next) {
        if(req.user) {
            successRedirect: '/auth/success';
            res.render('index', { title: "Chirp"});
        }
    	console.log("request is " + req.user.username);
    	res.render('index', { title: "Chirp"});
    });

module.exports = router;