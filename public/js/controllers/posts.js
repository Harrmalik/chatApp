var appPosts = angular.module('appPosts', ['appServices']);

appPosts.controller('postsController',['$scope', '$rootScope', 'postFactory', 'userFactory', 'followFactory', 'userPostFactory', 'unfollowFactory', '$location', '$routeParams', function($scope, $rootScope, postFactory, userFactory, followFactory, userPostFactory, unfollowFactory, $location, $routeParams){
	
	$scope.paramName = $routeParams.param1;
	// $scope.posts = postFactory.query();
	$scope.posts = [];
	$scope.currentsFollows = [];
    $scope.selected = {};
	$scope.selected.Post = {};
	$scope.following = 0;
	$scope.followers = 0;
	$scope.users = userFactory.query();
	console.log("check 0" + $scope.users);
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
	// First get a note currentPostect from the factory
	
/*
//used for basic read from json
	postFactory.getAll().success(function(data){
		$scope.posts = data;
	});
*/
	$scope.post = function() {
		// $scope.newPost.created_by = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		// postFactory.save($scope.newPost, function(){
		postFactory.save({id: $rootScope.current_user}, $scope.newPost, function(){
			$scope.newPost = {created_by: '', text: '', created_at: ''};
			$scope.getUserInfo($scope.whoEver);
		});
	};
	
	$scope.delete = function(id, post)	{
		console.log(id);
		console.log(post);
		userPostFactory.update({name: id}, post);
		$scope.getUserInfo($scope.whoEver);
	};
	
	$scope.edit = function(post) {
		$scope.selected.Post = post;
		console.log(post);
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
		$scope.getUserInfo($scope.whoEver);
	};
	
	$scope.unfollowUser = function(id, post){
		unfollowFactory.update({id: id}, post);
		$scope.getUserInfo($scope.whoEver);
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
				postFactory.query({id: data[0].follows[n]}, function(postsData){
					console.log(postsData[0]);
					for(var i = 0; i < postsData[0].posts.length; i++){
						postsData[0].posts[i].created_by = postsData[0].username;
						$scope.posts.push(postsData[0].posts[i]);
					}
				});
			}
		});
		
	};
	
	if(typeof $scope.paramName === 'undefined'){
		$scope.getUserInfo($rootScope.current_user);
		$scope.whoEver = $rootScope.current_user;
	} else{
		$scope.getUserInfo($scope.paramName);
		$scope.whoEver = $scope.paramName;
	}
	
	$scope.friendPage = function(name){
		if(name === $rootScope.current_user){
			$location.path('/');
		}
		$location.path('/user').search({param1: name});
	};
	
	$scope.checkFollows = function(name){
		var checkedOut = true;
		console.log($rootScope.current_user_Follows);
		for(var i = 0; i < $rootScope.current_user_Follows.length; i++){
			//If current user doesn't follow name then checked out equals true
			if(name == $rootScope.current_user_Follows[i]){
				checkedOut = false;
			}
		}
		return checkedOut;
	};
	
	$scope.getUserAvatar = function(user){
		userFactory.query({},function(data){
			for(var i = 0; i< data.length; i++){
				data[i].avatar = images[data[i].avatar];
			}
			$scope.users = data;
		});
	};
	$scope.getUserAvatar();
	
	$scope.getusers = function(name){
		userFactory.query({name: name},function(data){
			for(var i = 0; i< data.length; i++){
				data[i].avatar = images[data[i].avatar];
			}
			$scope.users = data;
		});
	};
	//$scope.getusers();
	
var
  content = [
    {
      title: 'Horse',
      description: 'An Animal',
    },
    {
      title: 'Cow',
      description: 'Another Animal',
    },
    	  { title: 'Andorra' },
	  { title: 'United Arab Emirates' },
	  { title: 'Afghanistan' },
	  { title: 'Antigua' },
	  { title: 'Anguilla' },
	  { title: 'Albania' },
	  { title: 'Armenia' },
	  { title: 'Netherlands Antilles' },
	  { title: 'Angola' },
	  { title: 'Argentina' },
	  { title: 'American Samoa' },
	  { title: 'Austria' },
	  { title: 'Australia' },
	  { title: 'Aruba' },
	  { title: 'Aland Islands' },
	  { title: 'Azerbaijan' },
	  { title: 'Bosnia' },
	  { title: 'Barbados' },
	  { title: 'Bangladesh' },
	  { title: 'Belgium' },
	  { title: 'Burkina Faso' },
	  { title: 'Bulgaria' },
	  { title: 'Bahrain' },
	  { title: 'Burundi' }
  ]
;
	
	$('.ui.search.icon.input')
	  .search({
	    source : $scope.users, 
	    searchFields   : [
	      'username'
	    ],
	    searchFullText: false
	  })
	;
	console.log("check 1" + $scope.users);
	$scope.getusers();
	console.log("check 2" + $scope.users);
	
	var textBoxChange = function(){
		console.log("i'm being focused");
	}
	
}]);

appPosts.controller('userInfoController',['$scope', '$rootScope', 'userPostFactory', 'followFactory', '$routeParams', 
		function($scope, $rootScope, userPostFactory, followFactory, $routeParams){
    
    $scope.paramName = $routeParams.param1;
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
		templateUrl: '/directives/userInfoBox.html',
		controller: 'userInfoController',
		controllerAs: 'userInCtrl'
	};
});

appPosts.directive('chatFeed', function(){
	return {
		restrict: 'E',
		templateUrl: '/directives/chatFeed.html',
		controller: 'postsController',
		controllerAs: 'postCtrl',
	};
});