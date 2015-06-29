var appPosts = angular.module('appPosts', ['appServices']);

appPosts.controller('postsController',['$scope', '$rootScope', 'postFactory', 'userFactory', 'followFactory', function($scope, $rootScope, postFactory, userFactory, followFactory){
						//Changing this up a little... 
	$scope.posts = postFactory.query();
	posts = postFactory.query();
	console.log(posts);
	$scope.users = userFactory.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	$scope.selected = {};
	$scope.selected.Post = {};
	$scope.following = 0;
	// First get a note currentPostect from the factory
	
/*
//used for basic read from json
	postFactory.getAll().success(function(data){
		$scope.posts = data;
	});
*/
	$scope.post = function() {
		$scope.newPost.created_by = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		postFactory.save($scope.newPost, function(){
			$scope.posts = postFactory.query();
			$scope.newPost = {created_by: '', text: '', created_at: ''};
		});
	};
	
	$scope.delete = function(post)	{
		postFactory.delete({id: post._id});
		$scope.posts = postFactory.query();
	};
	
	$scope.edit = function(post) {
		$scope.selected.Post = post;
	};
	
	$scope.save = function(post) {
		postFactory.update({id:post._id}, post);
		$scope.posts = postFactory.query();
	};
	
	$scope.addLike = function(post) {
		post.likes = post.likes + 1;
		postFactory.update({id: post._id}, post);
		$scope.posts = postFactory.query();
	};
	
	$scope.deleteUser = function(name)	{
		$rootScope.signout();
		userFactory.delete({name: name});
		$scope.posts = postFactory.query();
	};
	
	$scope.followUser = function(name, post)	{
		console.log(name);
		console.log(post);
		followFactory.update({name: name}, post);
	};
	
	// $rootScope.$watch(function(){return $rootScope.authenticated;},function(newValue, oldValue){
	// 	if(newValue && (newValue !== oldValue)){
	// 		$scope.getUserInfo();
	// 	}
	// });
	$scope.getUserInfo = function(){
		console.log("we in this bitch!");
		var allPosts = {};
		followFactory.query({name: $rootScope.current_user},function(data){
			$scope.followers = data[0].followers.length;
			$scope.following = data[0].follows.length;
			$scope.newFeed = data[0].follows;
			console.log($scope.newFeed);
			var post;
			angular.forEach($scope.newFeed,function(key, value){
				console.log("key " + key);
				post = postFactory.query({id: key});
				console.log(post);
				console.log(post.length);
				var i = 0;
				while(i < post.length){
					allPosts.push(post[i]);
				}
				console.log(allPosts);
			});
			return allPosts;
		});
		
	};
	
	
	$scope.getUserAvatar = function(user){
		//$scope.users = userFactory.query({name: user});
		console.log($scope.users.resource);
		console.log('hey');
	};
	
}]);