/**
 * Created by user on 7/3/2017.
 */
(function(angular){
    angular.module('Authentication',['ngRoute','AuthenticateService']);
    angular.module('Authentication')
        .controller('AuthenticationController',AuthenticationController);
    AuthenticationController.$inject = ['$scope','Authenticate']
    function AuthenticationController($scope,Authenticate){
        $scope.userName = '';
        $scope.password = '';
        $scope.signIn = function(){
            Authenticate.logIn($scope.userName,$scope.password);
        };
    }
})(window.angular);
