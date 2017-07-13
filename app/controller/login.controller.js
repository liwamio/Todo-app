/**
 * Created by user on 7/13/2017.
 */
/**
 * Created by user on 7/10/2017.*/
(function (angular) {
    angular.module('Liwam').controller('loginController',
        ['$scope','$timeout', '$location', 'Authenticate',
            function loginController($scope, $timeout, $location, Authenticate) {
                $scope.userName = '';
                $scope.password = '';
                Authenticate
                    .isLoggedIn()
                    .then(function (user) {
                        if (user === true) {
                            $location.path('filter/All').replace();
                        }
                        else {
                            $location.path(Authenticate.getPath()).replace();
                        }


                        $scope.logIn = function () {
                            Authenticate.logIn($scope.userName, $scope.password).then(function(){
                                $timeout(function(){
                                    $location.path(Authenticate.getPathSuccess());
                                })
                            });
                            $scope.userName = '';
                            $scope.password = '';

                        }
                    });
            }]);
})(window.angular);
