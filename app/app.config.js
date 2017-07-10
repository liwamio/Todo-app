/**
 * Created by user on 7/10/2017.
 */
(function (angular) {
angular.module('appConfig',['ngRoute','AuthenticateService','appController']);
angular.module('appConfig')
    .config(function ($routeProvider, AuthenticateProvider) {
        AuthenticateProvider.config({path: 'login'});
        $routeProvider
            .when('/login', {
                templateUrl: 'app/view/login.html',
                controller: 'logController',
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