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
        it('should create a new user', function(data){
           controller("authController", {$scope : scope});
           $rootScope.current_user = "User";
           expect(rootScope.authenticated).toEqual(true);
           expect(location.path).toBe('/');
           expect(data.state).toBe('success');
        });
        
        it('should fail to create a user' , function(data){
           controller("authController", {$scope: scope});
           $scope.error_message = "Failure to create user";
           expect(data.state).not.toBe('succes');
        });
        
        it('should get the signout page', function(){
            controller("authController", {$scope: scope});
            $httpBackend.whenGET("../signout").respond(500);
            $rootScope.current_user = "";
            expect(rootScope.authenticated).toEqual(true);
        });
    });
});