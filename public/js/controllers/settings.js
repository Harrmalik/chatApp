var appSettings = angular.module("appSettings", ['appServices']);

appSettings.controller('settingsController', [ 'userFactory', '$scope', '$rootScope', '$route',
    function(userFactory, $scope, $rootScope, $route) {
	$scope.tab = "personal";
	$scope.user = userFactory.query();
	// for the time being im storing this variable here...
	$scope.whoEver = $rootScope.current_user;
	
	$scope.selectTab = function(currentTab){
		$scope.tab = currentTab;
	};
	
	$scope.selectImg = function(currentImg){
		$scope.avatar = currentImg;
	};
	
	$scope.isSelected = function(currentTab){
		return $scope.tab === currentTab;
	};

	$scope.imgSelected = function(currentAvatar){
		return $scope.avatar === currentAvatar;
	};
	
	$scope.update = function(display, img) {
	    if (!display)
	        display = $rootScope.user_display;
	        

	        console.log('img' + img);
	        console.log('img' + $rootScope.user_avatar);
	        console.log('display' + display);
	        console.log('display' + $rootScope.user_display);
	        
		userFactory.update(
		    {name: $rootScope.current_user}, {display_name: display, avatar: img}
		);
		$rootScope.user_avatar = images[img];
		$rootScope.user_display = display;
		$route.reload();
	};
}]);