/**
 * Created by user on 7/10/2017.*/
(function (angular) {
    angular.module('Liwam').controller('pathController',
        ['$location', 'Authenticate',
            function pathControllerInit($location, Authenticate) {
                Authenticate
                    .isLoggedIn()
                    .then(function (user) {
                        if (user === true) {
                            $location.path('filter/All').replace();
                        }
                        else{
                            $location.path(Authenticate.getPath()).replace();
                        }
                    });
            }]);
})(window.angular);
