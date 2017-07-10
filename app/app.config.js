/* eslint-disable */
/**
 * Created by user on 7/10/2017.
 */
(function (angular) {
    angular.module('Liwam')
        .config(function ($routeProvider, AuthenticateProvider) {
            AuthenticateProvider.config({path: 'login'});
            $routeProvider
                .when('/login', {
                    templateUrl: 'app/view/login.html',
                    controller: 'loginController',
                })
                .when('/', {
                    templateUrl: 'app/view/home.html',
                    resolve: {
                        isLoggedIn: AuthenticateProvider.getStatus,
                    },
                })
                .when('/:filter', {
                    templateUrl: 'app/view/home.html',
                    resolve: {
                        isLoggedIn: AuthenticateProvider.getStatus,
                    },
                })
                .otherwise({
                    templateUrl: 'app//view/not-found.html',
                })
        })
})(window.angular);
