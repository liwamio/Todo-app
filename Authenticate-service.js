/* eslint-disable */
/**
 * Created by user on 7/3/2017.
 */
(function(angular){
    angular.module('AuthenticateService',[]);
    angular.module('AuthenticateService')
        .provider('Authenticate',Authenticate);
    function Authenticate(){
        let userStatus = false;
        let Path = 'login'
        let key = 'AuthenticationKey';

        return{
            setKey: function(keys){
                key = keys;
            },

            setPath: function(path){
                Path = path;
            },

            getStatus: ['$q', '$location', function($q, $location) {
                return $q(function(resolve, reject) {
                    localforage.getItem(key).then(function(value){
                        userStatus = value === null ? false : value;

                        if (value === null || value === false) {
                            reject();
                            console.log(Path);
                            $location.path(Path).replace();
                        } else {
                            resolve();
                        }
                    });
                });
            }],

            $get:function($http,$q,$rootScope, $location){
                return{

        logIn: function(username, password){
            if(username === 'user' && password === '1234'){
                userStatus = true;
                localforage.setItem(key, userStatus).then(function(){
                    $location.path('/').replace();
                    $rootScope.$apply();
                })
            }else {
                alert("wrong user name or password!");
            }
        },

        logOut: function(){
            userStatus = false;
                localforage.setItem(key, userStatus).then(function(){
                    $location.path('/login').replace();
                    $rootScope.$apply();
                })
        },

        getPath: function(){
            return Path;
        },

        isLoggedIn: function() {
            return localforage.getItem(key);
        },
                };
            },
        };

    };
})(window.angular);
