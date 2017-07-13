/* eslint-disable */
/**
 * Created by user on 7/3/2017.
 */
(function (angular) {
    angular.module('AuthenticateService', []);
    angular.module('AuthenticateService')
        .provider('Authenticate', AuthenticateProvider);
    function AuthenticateProvider() {
        let userStatus = false;
        const authConfig = {
            pathOnFail: 'login', // if user is not logged in take to this path
            pathOnSuccess: 'filter/All',
            key: 'AuthenticationKey'
        }

        return {
            config: function (option) {
                angular.extend(authConfig, option);
            },
            getStatus: ['$q', '$location', function ($q, $location) {
                return $q(function (resolve, reject) {
                    localforage.getItem(authConfig.key).then(function (value) {
                        userStatus = value === null ? false : value;

                        if (value === null || value === false) {
                            reject();
                            $location.path(authConfig.pathOnFail).replace();
                        } else {
                            resolve();
                        }
                    });
                });
            }],

            $get: function ($http, $q, $rootScope, $location) {
                return {

                    logIn: function (username, password) {
                        return new Promise(function (resolve, reject) {
                            if (username === 'user' && password === '1234') {
                                userStatus = true;
                                localforage.setItem(authConfig.key, userStatus).then(function () {
                                    resolve();
                                })
                            }
                            else {
                                reject('wrong user name or password');
                            }
                        })
                    },

                    logOut: function () {
                        userStatus = false;
                        localforage.setItem(authConfig.key, userStatus).then(function () {
                            $location.path(authConfig.pathOnFail).replace();
                            $rootScope.$apply();
                        })
                    },

                    getPath: function () {
                        return authConfig.pathOnFail;
                    },
                    getPathSuccess: function(){
                        return authConfig.pathOnSuccess;
                    },

                    isLoggedIn: function () {
                        return localforage.getItem(authConfig.key);
                    },
                };
            },
        };

    };
})(window.angular);
