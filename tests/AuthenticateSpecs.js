describe("app module", function(){
    beforeEach(module("appAuthentication"));
    
    describe("authController", function(){
        var scope, http, rootScope, controller, location;
        
        beforeEach(inject(function ($rootScope, $controller, $http, $scope, $location){
            scope = $scope.new();
            rootScope = $rootScope.new();
            http = $http;
            location = $location;
            controller= $controller;
            
        }));
        it('should assign user to an array with a blank username and passwaord', function() {
            controller("authController", {$scope: scope});
            expect(scope.user).toBe({username: '', password: ''})
        });
         it('should assign error_message to an empty string', function() {
            controller("authController", {$scope: scope});
            expect(scope.error_message).toBe('')
        });
        
    });
});