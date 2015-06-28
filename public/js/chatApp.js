var app = angular.module('chatApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http){
	$rootScope.authenticated = false;
	$rootScope.current_user = 'Guest';
	$rootScope.user_display = $rootScope.current_user;
	$rootScope.user_avatar = '/images/rnm.png';
	$rootScope.page = "index";
	
	$rootScope.selectedPage = function(currentPage) {
		$rootScope.page = currentPage;
	};
	
	$rootScope.isSelected = function(currentPage) {
		return $rootScope.page === currentPage;
	};

	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
	};
	$rootScope.getAvatar = function(index) {
		$rootScope.user_avatar = images[index];
	};
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: '/main.html',
      controller: 'mainController'
    })
    //the timeline display
    .when('/edit', {
      templateUrl: '/edit.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: '/login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: '/register.html',
      controller: 'authController'
    })
    //the signup display
    .when('/settings', {
      templateUrl: '/settings.html',
      controller: 'settingsController'
    });
});

// app.factory('postFactory', function($http) {
//   var factory = {};
//   factory. getAll = function() {
//     return $http.get('/api/posts');
//   };
//   return factory;
// });

app.factory('postFactory',['$resource', function($resource){
	return $resource('/api/posts/:id', null,  
		{
        'update': { method:'put' }
    });
}]);

app.factory('userFactory',['$resource', function($resource){
	return $resource('/api/users/:name', null,  
		{
        'update': { method:'put' }
    });
}]);

app.factory('followFactory',['$resource', function($resource){
	return $resource('/api/follow/:name', null,  
		{
        'update': { method:'put' }
    });
}]);

app.controller('mainController',['$scope', '$rootScope', 'postFactory', 'userFactory', 'followFactory', function($scope, $rootScope, postFactory, userFactory, followFactory){
	$scope.posts = postFactory.query();
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
		$scope.newPost.created_by = $rootScope.user_display;
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
	
	$rootScope.$watch(function(){return $rootScope.authenticated;},function(newValue){
		if(newValue){
			$scope.getUserInfo();
		}
	});
	
	$scope.getUserInfo = function(){
		console.log("we in this bitch!");
		followFactory.query({name: $rootScope.current_user},function(data){
			$scope.followers = data[0].followers.length;
			$scope.following = data[0].follows.length;
			$scope.newFeed = data[0].follows;
			console.log($scope.newFeed);
			angular.forEach($scope.newFeed,function(key, value){
				console.log(key);
				// postFactory.get({id: key});
			});
		});
		
	};
	
	$scope.getUserAvatar = function(){
		console.log($scope.users.query({username : "harrmalik"}));
	};

	
}]);

app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';
	

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$rootScope.user_display = data.user.display_name;
				$rootScope.user_id = data.user._id;
				$rootScope.getAvatar(data.user.avatar);
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
});

app.directive('focusMe', function($timeout) {
  return {
    scope: {
      focusMeIf:"="
    },
    link: function ( scope, element, attrs ) {
      if (scope.focusMeIf===undefined || scope.focusMeIf) {
        $timeout( function () { element[0].focus(); } );
      }
    }
  };
});

app.controller('settingsController', [ 'userFactory', '$scope', function(userFactory, $scope) {
	$scope.tab = "personal";
	$scope.avatar = 1;
	
	 //var images = {"image" : ['/images/finn.png', '/images/cartman.jpeg' , '/images/stewie.png' , '/images/shaggy.jpg' , '/images/sponge.jpeg'] };
	
	$scope.selectTab = function(currentTab){
		$scope.tab = currentTab;
	};
	
	$scope.selectImg = function(currentImg){
		$scope.avatar = currentImg;
		console.log("clicked");
		console.log($scope.avatar);
	};
	
	$scope.isSelected = function(currentTab){
		return $scope.tab === currentTab;
	};
	
	$scope.imgSelected = function(currentImg){
		return $scope.avatar === currentImg;
	};
}]);

var images = ['/images/finn.png', '/images/cartman.jpeg', '/images/finn.png', '/images/sponge.jpeg', '/images/stewie.png', '/images/rnm.png'];