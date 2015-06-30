var app = angular.module('chatApp', ['ngRoute', 'appSettings', 'appServices', 'appAuthentication', 'appPosts']).run(function($rootScope, $http){
	//$rootScope.authenticated = false;
	//$rootScope.current_user = 'Guest';
	$rootScope.user_display = $rootScope.current_user;
	$rootScope.user_avatar = 1;
  $rootScope.check = 0;

	$rootScope.getAvatar = function(index) {
		$rootScope.user_avatar = images[index];
	};
});



app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: '/main.html',
      controller: 'authController'
    })
    //the timeline display
    .when('/edit', {
      templateUrl: '/edit.html',
      controller: 'postsController'
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



app.controller('navController', function($scope) {
  	$scope.page = "index";
	
	$scope.selectedPage = function(currentPage) {
		$scope.page = currentPage;
	};
	
	$scope.isSelected = function(currentPage) {
		return $scope.page === currentPage;
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

var images = ['/images/finn.png', '/images/cartman.jpeg', '/images/stewie.png', '/images/shaggy.jpg', '/images/sponge.jpeg', '/images/rnm.png'];