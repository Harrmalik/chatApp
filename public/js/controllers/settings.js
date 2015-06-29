var appSettings = angular.module("appSettings", ['appServices']);

appSettings.controller('settingsController', [ 'userFactory', '$scope', '$rootScope', 
    function(userFactory, $scope, $rootScope) {
	$scope.tab = "personal";
	$scope.user = userFactory.query();
	
	$scope.selectTab = function(currentTab){
		$scope.tab = currentTab;
	};
	
	$scope.selectImg = function(currentImg){
		$scope.avatar = currentImg;
	};
	
	$scope.isSelected = function(currentTab){
		return $scope.tab === currentTab;
	};
	
	$scope.update = function(display, img) {
	    if (!display)
	        display = $rootScope.user_display;
	        console.log('img' + img);
	   if (0 > img && img < images.length)
	        img = $rootScope.user_avatar;
	        
	        console.log('img' + img);
	        console.log('img' + $rootScope.user_avatar);
	        console.log('display' + display);
	        console.log('img' + $rootScope.user_display);
	        
		userFactory.update(
		    {name: $rootScope.current_user}, {display_name: display, avatar: img}, {new:true}
		);
		$rootScope.user_avatar = images[img];
		$rootScope.user_display = display;
	};
}]);