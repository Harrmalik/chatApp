var appAuthentication = angular.module("appAuthentication", []);

appAuthentication.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';
	

	$scope.login = function(){
		$http.post('/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$rootScope.user_display = data.user.display_name;
				$rootScope.user_id = data.user._id;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		$http.post('/signup', $scope.user).success(function(data){
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
	
	//What does this do???? - Who wrote this?
	
	// This checks for whether the user has a current session or not
	// If is finds one automatically logs in else hits splash page -Malik
	$scope.checkSession = function(){
		var followArray = [];
		$http.get('/success').success(function(data){
			if(data.state == 'success' && data.user){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$rootScope.user_display = data.user.display_name;
				//Creates array of everyone the logged in user follows including their self
				followArray = data.user.follows;
				followArray.push($rootScope.current_user);
				$rootScope.current_user_Follows = followArray;
				console.log($rootScope.current_user_Follows);
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
	
	$scope.signout = function(){
		$http.get('../signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = "";
	};
	
	$scope.checkSession();
});