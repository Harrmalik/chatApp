var appShows = angular.module('appShows', ['appServices']);

appShows.controller('showController',['$scope', '$location', '$routeParams', '$http', 
    function($scope, $location, $routeParams, $http){
        $scope.networkUri = $routeParams.network;
        $scope.showUri = $routeParams.show;
        $scope.network = {};
        $scope.show = {};
        $http.get('/data/' + $routeParams.show + '.json').success(function(data) {
          $scope.show = data;
        });
        $http.get('/data/' + $routeParams.network + '.json').success(function(data) {
          $scope.network = data;
        });
}]);