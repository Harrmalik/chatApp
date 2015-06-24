var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    if (req.method === "GET") {
        //contiune to the next middleware or request handler
        return next();
    }
    if (!req.isAuthenticated()) {
        //user not authenticated, redirect to login page
        res.redirect('/#/login');
    }
    
    //user authenticated contiune to next middleware
    return next();
});
router.route('/posts')
    //returns all posts
    .get(function(req, res) {
        //temporary solution
        res.send({message: 'TODO return all posts'});
    })
    
    //creates a new post
    .post(function(req, res) {
        //temporary solution
        res.send({message: 'TODO create a new post'});
    });
    
router.route('/posts/:id')
    //returns a particular posts
    .get(function(req, res) {
        //temporary solution
        res.send({message: 'TODO return a particular post ' + req.params.id});
    })
    
    //updates existing post
    .put(function(req, res) {
    //temporary solution
        res.send({message: 'TODO update this post ' + req.params.id});
    })
    
    //delete existing post
    .delete(function(req, res) {
    //temporary solution
        res.send({message: 'TODO delete this post ' + req.params.id});
    });

module.exports = router;