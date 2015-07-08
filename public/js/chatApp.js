var app = angular.module('chatApp', ['ngRoute', 'appSettings', 'appServices', 'appAuthentication', 'appPosts']).run(function($rootScope, $http){
  
	$rootScope.images = ['/images/finn.png', '/images/cartman.jpeg', '/images/stewie.png', '/images/shaggy.jpg', '/images/sponge.jpeg', '/images/rnm.png'];
});


app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: '/feed.html',
      controller: 'authController'
    })
    //the timeline display
    .when('/user', {
      templateUrl: '/feed.html',
      controller: 'authController'
    })
    //the timeline display
    .when('/inbox', {
      templateUrl: '/inbox.html'
      // controller: 'postsController'
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