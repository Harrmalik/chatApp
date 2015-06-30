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
				$rootScope.getAvatar(data.user.avatar);
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
	
	$scope.checkSession = function(){
		$http.get('/success').success(function(data){
			if(data.state == 'success' && data.user){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$rootScope.user_display = data.user.display_name;
				$rootScope.getAvatar(data.user.avatar);
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
	};
	
	$scope.checkSession();
});