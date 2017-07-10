/**
 * Created by user on 7/10/2017.*/
(function (angular) {
    angular.module('appController', ['AuthenticateService']);
    angular.module('appController').controller('logController',
        ['$location', 'Authenticate',
            function logControllerInit($location, Authenticate) {
                Authenticate
                    .isLoggedIn()
                    .then(function (user) {
                        if (user === true) {
                            $location.path('/home').replace();
                        }
                    });
            }]);
})(window.angular);
