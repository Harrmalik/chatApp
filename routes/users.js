var express = require('express');
var router = express.Router();

router.route('/users/:name')
	//updates specified post
	.put(function(req, res){
		User.findById(req.params.id, function(err, user){
			if(err)
				return res.send(err);

			// TODO: UPDATE USER SETTINGS
			user.save(function(err, post){
				if(err)
					return res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		console.log(req.params.name);
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


module.exports = router;