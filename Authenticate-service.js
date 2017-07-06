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

        getStatus: function(){
            let deffered = $q.defer();
                localforage.getItem(key).then(function(value){
                    userStatus = value;
                    deffered.resolve(userStatus)
                });
            return deffered.promise;
        },

        setPath: function(path){
            Path = path;
        },

        getPath: function(){
            return Path;
        },

        setKey: function(keys){
            key = keys;
        },
                };
            },
        };

    };
})(window.angular);