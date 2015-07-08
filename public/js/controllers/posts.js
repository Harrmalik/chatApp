var appPosts = angular.module('appPosts', ['appServices']);

appPosts.controller('postsController',['$scope', '$rootScope', 'postFactory', 'userFactory', 'followFactory', '$location', '$routeParams', function($scope, $rootScope, postFactory, userFactory, followFactory, $location, $routeParams){
	
	$scope.paramName = $routeParams.param1;
	// $scope.posts = postFactory.query();
	$scope.posts = [];
	$scope.currentsFollows = [];
    $scope.selected = {};
	$scope.selected.Post = {};
	$scope.following = 0;
	$scope.followers = 0;
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
			$scope.newPost = {created_by: '', text: '', created_at: ''};
			$scope.getUserInfo($scope.whoEver);
		});
	};
	
	$scope.delete = function(post)	{
		postFactory.delete({id: post._id});
		$scope.getUserInfo($scope.whoEver);
	};
	
	$scope.edit = function(post) {
		$scope.selected.Post = post;
	};
	
	$scope.save = function(post) {
		postFactory.update({id:post._id}, post);
		$scope.getUserInfo($scope.whoEver);
	};
	
	$scope.addLike = function(post) {
		post.likes = post.likes + 1;
		postFactory.update({id: post._id}, post);
		$scope.getUserInfo($scope.whoEver);
	};
	
	$scope.deleteUser = function(name)	{
		$rootScope.signout();
		userFactory.delete({name: name});
		$scope.posts = postFactory.query();
	};
	
	$scope.followUser = function(name, post)	{
		followFactory.update({name: name}, post);
	};
	
	$scope.getUserInfo = function(name){
		$scope.posts = [];
		followFactory.query({name: name}, function(data){
			$scope.followers = data[0].followers.length;
			$scope.following = data[0].follows.length;
			data[0].follows.push(name);
			// console.log($rootScope.current_user_Follows);
			// if($rootScope.current_user === name){
			// 	$rootScope.current_user_Follows = data[0].follows;
			// 	console.log($rootScope.current_user_Follows);
			// }
			for(var n = 0; n < data[0].follows.length; n++){
				postFactory.query({id: data[0].follows[n]}, function(data){
					for(var i = 0; i < data.length; i++){
						$scope.posts.push(data[i]);
					}
				});
			}
		});
		
	};
	
	if(typeof $scope.paramName === 'undefined'){
		$scope.getUserInfo($rootScope.current_user);
		$scope.whoEver = $rootScope.current_user;
	} else{
		console.log($scope.paramName);
		$scope.getUserInfo($scope.paramName);
		$scope.whoEver = $scope.paramName;
	}
	
	$scope.friendPage = function(name){
		if(name === $rootScope.current_user){
			$location.path('/');
			console.log(name);
			console.log($rootScope.current_user);
		}
		$location.path('/user').search({param1: name});
	};
	
	$scope.checkFollows = function(name){
		var checkedOut = true;
		for(var i = 0; i < $rootScope.current_user_Follows.length; i++){
			if(name == $rootScope.current_user_Follows[i]){
				checkedOut = false;
			}
		}
		return checkedOut;
	};
	
	$scope.getUserAvatar = function(user){
		//$scope.users = userFactory.query({name: user});
		//console.log($scope.users.resource);
		//console.log('hey');
	};
	
	$scope.getusers = function(){
		userFactory.query({},function(data){
			for(var i = 0; i< data.length; i++){
				data[i].avatar = images[data[i].avatar];
			}
			$scope.users = data;
		});
		
		console.log($scope.users);
		
	};
	$scope.getusers();
}]);

appPosts.controller('userInfoController',['$scope', '$rootScope', 'userPostFactory', 'followFactory', '$routeParams', 
		function($scope, $rootScope, userPostFactory, followFactory, $routeParams){
    
    $scope.paramName = $routeParams.param1;
    console.log($scope.paramName);
	$scope.getUserBox = function(name){
		followFactory.query({name: name}, function(data){
			$scope.username = data[0].username;
			$scope.user_display = data[0].display_name;
			$scope.user_avatar = images[data[0].avatar];
			$scope.followers = data[0].followers.length;
			$scope.following = data[0].follows.length;
			$scope.getTweetAmount($scope.username);
		});
	};
	
	$scope.getTweetAmount = function(name){
		userPostFactory.query({name: name}, function(data){
			$scope.cheeps = data;
		});
	};
	
	if(typeof $scope.paramName === 'undefined'){
		$scope.getUserBox($rootScope.current_user);
	} else{
		$scope.getUserBox($scope.paramName);
	}
	
	
}]);

appPosts.directive('userInfoBox', function(){
	return {
		restrict: 'E',
		templateUrl: 'userInfoBox.html',
		controller: 'userInfoController',
		controllerAs: 'userInCtrl'
	};
});

appPosts.directive('chatFeed', function(){
	return {
		restrict: 'E',
		templateUrl: 'chatFeed.html',
		controller: 'postsController',
		controllerAs: 'postCtrl'
	};
});