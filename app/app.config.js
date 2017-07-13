/* eslint-disable */
/**
 * Created by user on 7/10/2017.
 */
(function (angular) {
    angular.module('Liwam')
        .config(function ($routeProvider, AuthenticateProvider) {
            AuthenticateProvider.config({pathOnFail: 'login'});
            $routeProvider
                .when('/login', {
                    templateUrl: 'app/view/login.html',
                    controller: 'loginController',
                })
                .when('/filter/:filter', {
                    templateUrl: 'app/view/home.html',
                    resolve: {
                        isLoggedIn: AuthenticateProvider.getStatus,
                    },
                })
                .otherwise({
                    templateUrl: 'app/view/not-found.html',
                })
        })
})(window.angular);
