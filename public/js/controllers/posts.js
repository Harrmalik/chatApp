var appPosts = angular.module('appPosts', ['appServices']);

appPosts.controller('postsController',['$scope', '$rootScope', 'postFactory', 'userFactory', 'followFactory', function($scope, $rootScope, postFactory, userFactory, followFactory){
						//Changing this up a little... 
	// $scope.posts = postFactory.query();
	
	
	$scope.users = userFactory.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
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
	
	// $scope.followUser = function(name, post)	{
	// 	console.log(name);
	// 	console.log(post);
	// 	followFactory.update({name: name}, post);
	// };
	
	// $scope.getUserInfo = function(name){
	// 	followFactory.query({name: name}, function(data){
	// 		console.log(data);
	// 		$scope.followers = data[0].followers.length;
	// 		$scope.following = data[0].follows.length;
	// 		$scope.newFeed = data[0].follows;
	// 		console.log(data[0].follows);
	// 		angular.forEach(data[0].follows, function(key, value){
	// 			console.log("key " + key);
	// 			postFactory.query({id: key}, function(data){
	// 				console.log(data.length);
	// 				console.log(data[0]);
	// 				for(var i = 0; i < data.length; i++){
	// 					$scope.posts.push(data[i]);
	// 				}
	// 			console.log($scope.posts);
	// 			});
	// 		});
	// 	});
	// };
	// $scope.getUserInfo();
	
	$scope.getUserAvatar = function(user){
		//$scope.users = userFactory.query({name: user});
		//console.log($scope.users.resource);
		//console.log('hey');
	};
	
}]);

appPosts.controller('followsController',['$scope', '$rootScope', 'postFactory', 'userFactory', 'followFactory', 'followingService', 
		function($scope, $rootScope, postFactory, userFactory, followFactory,followingService){
    
    $scope.posts = [];
    $scope.selected = {};
	$scope.selected.Post = {};
	$scope.following = 0;

    
    $scope.followUser = function(name, post)	{
		console.log(name);
		console.log(post);
		followFactory.update({name: name}, post);
	};
	
	$scope.getUserInfo = function(name){
		followFactory.query({name: name}, function(data){
			console.log(data);
			$scope.followers = data[0].followers.length;
			$scope.following = data[0].follows.length;
			$scope.newFeed = data[0].follows;
			console.log(data[0].follows);
				angular.forEach(data[0].follows, function(key, value){
					console.log("key " + key);
					postFactory.query({id: key}, function(data){
						console.log(data.length);
						console.log(data[0]);
						for(var i = 0; i < data.length; i++){
							$scope.posts.push(data[i]);
						}
					console.log($scope.posts);
					});
					console.log('why');
				});
		});
	};
	if($rootScope.check === 0){
		$scope.getUserInfo($rootScope.current_user);
		$rootScope.check ++;
	};
}]);

appPosts.directive('userInfoBox', function(){
	return {
		restrict: 'E',
		templateUrl: 'userInfoBox.html',
		controller: 'followsController',
		controllerAs: 'follCtrl'
	};
});

appPosts.directive('chatFeed', function(){
	return {
		restrict: 'E',
		templateUrl: 'chatFeed.html',
		controller: 'followsController',
		controllerAs: 'follCtrl'
		
	};
});