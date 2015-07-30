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
	//gets top ten most recent posts from a specific user
	.get(function(req, res){
		User.find({username: req.params.id}, {posts: {$slice: -10}}, function(err, post){
			if(err)
				return res.send(err);
			
			post[0].password = "";
			res.json(post);
		});
	})
	//creates a new post
	.post(function(req, res){
		req.body.likes = 0;
		console.log(req.body);
		User.findOneAndUpdate({
			username: req.params.id
		},{
			$push: {posts: req.body}
		},{
			upsert: true
		},
		function(err){
			if(err){
				return res.send(err);
			}
			res.json("Created post!");
		});
	})
	//updates specified post
	.put(function(req, res){
		User.update({
			"posts._id": req.params.id
		},{
			$set: {
				"posts.$.text": req.body.text,
				"posts.$.likes": req.body.likes
			}
		},
			function(err, numAffected){
				if(err)
					return res.send(err);
	
				res.json(numAffected);
		});
	});
	
router.route('/userPosts/:name')
	.get(function(req, res){
		var name = req.params.name;
		Post.count({created_by: name},function(err, num){
			if(err){
				return res.status(500).send(err);
			}
			console.log("Malik look " + num);
			//Need better way then returning all the posts!
			res.json(num);
		});
	})
	//deletes specified post
	.put(function(req, res) {
		User.update({
			"_id": req.params.name
		}, {$pull: {"posts": {"_id": req.body._id}}}, function(err) {
			if (err)
				return res.send(err);
			res.json("deleted :(");
		});
	});
	
router.route('/users')
	// gets all users and avatars for user search
	.get(function(req, res){
		User.find({}, {"username": 1, "avatar": 1, "_id": 0}, function(err, users){
			if(err){
				return res.status(500).send(err);
			}
			
			
			return res.json(users);
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
		},{
			$set: {display_name: req.body.display_name, avatar: req.body.avatar}
		}, {
			new: true
			
		}, function(err, user){
			if (err)
				return res.send(err);
			console.log(user);
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
			res.json("destroyed that file");
		});
		// Post.remove({
		// 	created_by: req.params.name
		// }, function(err) {
		// 	if (err)
		// 		return res.send(err);
		// 	res.json("deleted :(");
		// });
	});
	
router.route('/follow/:name')
	.get(function(req, res){
		User.find({username: req.params.name}, {"created_at": 0, "password": 0, "_id": 0}, function(err, data){
			if(err) return res.send(err);
			res.json(data);
		});
	})

	//current_user follows a new user
	.put(function(req, res){
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

router.route("/unfollow/:id")
	//Unfollows selected user
	.put(function(req, res) {
		User.update({
			"_id": req.params.id
		}, {
			$pull: {
				"follows": req.body.created_by
			}
		}, function(err) {
			if (err)
				return res.send(err);
		});
		
		User.update({
			"_id": req.body.created_by
		}, {
			$pull: {
				"followers": req.params.id
			}
		}, function(err) {
			if (err)
				return res.send(err);
			res.json("Unfollow that fool!");
		});
	});

module.exports = router;