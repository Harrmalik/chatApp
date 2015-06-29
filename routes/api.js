var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.route('/posts')
	//creates a new post
	.post(function(req, res){

		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.likes = 0;
		post.save(function(err, post) {
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	//gets all posts
	.get(function(req, res){
		Post.find(function(err, posts){
			console.log('debug2');
			if(err){
				return res.status(500).send(err);
			}
			return res.status(200).send(posts);
		});
		// User.find(function(err, users){
		// 	if(err){
		// 		return res.status(500).send(err);
		// 	}
		// 	return res.status(200).send(users);
		// });
	});

//post-specific commands. likely won't be used
router.route('/posts/:id')
	//gets specified post
	.get(function(req, res){
		console.log(req.params.id);
		Post.find({created_by: req.params.id}).limit(10).sort({created_at: -1}).exec(function(err, post){
			if(err)
				return res.send(err);
			
			res.json(post);
		});
	}) 
	//updates specified post
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				return res.send(err);

			post.created_by = req.body.created_by;
			post.text = req.body.text;
			post.likes = req.body.likes;

			post.save(function(err, post){
				if(err)
					return res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				return res.send(err);
			res.json("deleted :(");
		});
	});
	
router.route('/users')
	.get(function(req, res){
		User.find(function(err, user){
			if(err){
				return res.status(500).send(err);
			}
			
			user.password = "";
			return res.status(200).send(user);
		});
	});
	
//post-specific commands. likely won't be used
router.route('/users/:name')
	//gets specified post
	.get(function(req, res){
		User.find({ username: req.params.name}, function(err, user){
			if(err)
			return res.send(err);
			
			user.password = "";
			res.json(user);
		});
	}) 
	.put(function(req, res){
		User.findOneAndUpdate({
			username: req.params.name
		},{display_name: req.body.display_name, avatar: req.body.avatar
		}, {new: true},function(err, user){
			if (err)
				return res.send(err);
			
				res.json(user);
			});
	})
	//deletes the user and all of their post
	.delete(function(req, res) {
		User.remove({
			username: req.params.name
			// TO-DO: DELETE USER AND ALL THEIR POSTS
		}, function(err) {
			if (err)
				return res.send(err);
			//res.json("destroyed that file");
		});
		Post.remove({
			created_by: req.params.name
		}, function(err) {
			if (err)
				return res.send(err);
			res.json("deleted :(");
		});
	});
	
router.route('/follow/:name')
	.get(function(req, res){
		User.find({username: req.params.name}, {"follows": 1, "followers": 1, "_id": 0}, function(err, data){
			if(err) return res.send(err);
			res.json(data);
		});
	})

	//current_user follows a new user
	.put(function(req, res){
		console.log("I'm being hit!!!!!!");
		console.log(req.params.name);
		console.log(req.body.created_by);
		
		User.findOneAndUpdate({
			username: req.params.name
		},{
			$push: {follows: req.body.created_by}
		},{
			
			upsert: true
		},
		function(err){
			if(err){
				return res.send(err);
			}
			//res.json("Following");
		});
		
		console.log(req.body.created_by);
		console.log(req.params.name);
		
		User.findOneAndUpdate({
			username: req.body.created_by
		},{
			$push: {followers: req.params.name}
		},{
			upsert: true
		},
		function(err){
			if(err){
				return res.send(err);
			}
			res.json("Followers!");
		});
	});


module.exports = router;