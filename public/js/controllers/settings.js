var appSettings = angular.module("appSettings", ['appServices']);

appSettings.controller('settingsController', [ 'userFactory', '$scope', '$rootScope', '$route',
    function(userFactory, $scope, $rootScope, $route) {
	$scope.tab = "personal";
	
	userFactory.query({name: $rootScope.current_user},function(data){
		$scope.user = data[0];
		console.log($scope.user);
	});
	console.log($scope.user);
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
		var check;
	    if (!display) {
	        display = $rootScope.user_display;
	    }
	        
		if(!img)
		img = $scope.user.avatar;
		
		console.log($scope.user.avatar);
		
    	userFactory.update(
		    {name: $rootScope.current_user}, {display_name: display, avatar: img}
		);

		// switch (check) {
		// 	case 'img':
		// 		userFactory.update(
		// 		    {name: $rootScope.current_user}, {avatar: img}
		// 		);
		// 		break;
		// 	case 'display':
		// 		userFactory.update(
		// 		    {name: $rootScope.current_user}, {display_name: display}
		// 		);
		// 		break;
			
		// 	default:

		// }
		$rootScope.user_avatar = images[img];
		$rootScope.user_display = display;
		$route.reload();
	};
}]);