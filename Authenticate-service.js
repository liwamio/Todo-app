/**
 * Created by user on 7/3/2017.
 */
(function(angular){
    angular.module('AuthenticateService',[]);
    angular.module('AuthenticateService')
        .provider('Authenticate',AuthenticateProvider);
    function AuthenticateProvider(){

        localforage.config({
            name: 'LIWAM',
            storeName: 'LIWAM',
            description: 'LIWAM',
        });

        let userStatus = false;
        const key = 'AuthenticationKey';
        return{
            $get: ['$rootScope', '$location',function($rootScope, $location){
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
            return userStatus;
        },
        logOut: function(){
            userStatus = false;
            localforage.setItem(key, userStatus).then(function(){
                $location.path('/login').replace();
                $rootScope.$apply();
            })
            return userStatus;
        },
        getStatus: function(){
            return new Promise (function (resolve, reject){
                localforage.getItem(key).then(function(value){
                    resolve(value);
                })
            })
        }
                };
            }],
        };

    };
})(window.angular);