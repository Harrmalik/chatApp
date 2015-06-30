var appServices = angular.module("appServices", ['ngResource']);

appServices.factory('postFactory',['$resource', function($resource){
	return $resource('/api/posts/:id', null,  
		{
        'update': { method:'put' }
    });
}]);

appServices.factory('userFactory',['$resource', function($resource){
	return $resource('/api/users/:name', null,  
		{
        'update': { method:'put' }
    });
}]);

appServices.factory('followFactory',['$resource', function($resource){
	return $resource('/api/follow/:name', null,  
		{
        'update': { method:'put' }
    });
}]);

appServices.factory('followingService', function(){
    var check = 0;
    return check;
});