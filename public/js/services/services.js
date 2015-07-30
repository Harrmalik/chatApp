var appServices = angular.module("appServices", ['ngResource']);

appServices.factory('postFactory',['$resource', function($resource){
	return $resource('/api/posts/:id', null,  
		{
        'update': { method:'put' }
    });
}]);

appServices.factory('userPostFactory',['$resource', function($resource){
	return $resource('api/userPosts/:name', null,  
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

appServices.factory('unfollowFactory',['$resource', function($resource){
	return $resource('/api/unfollow/:id', null,  
		{
        'update': { method:'put' }
    });
}]);

appServices.factory('searchService', ['postFactory', function(postFactory) {
    var allPosts = postFactory.query();
    return allPosts;
}]);