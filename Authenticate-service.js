/**
 * Created by user on 7/3/2017.
 */
(function(angular){
    angular.module('AuthenticateService',[]);
    angular.module('AuthenticateService')
        .provider('Authenticate',Authenticate);
    function Authenticate(){

        localforage.config({
            name: 'LIWAM',
            storeName: 'LIWAM',
            description: 'LIWAM',
        });

        let userStatus = false;
        const key = 'AuthenticationKey';
        return{
            $get: function($window){
                return{
        logIn: function(username, password){
            if(username === 'user' && password === '1234'){
                userStatus = true;
                localforage.setItem(key, userStatus);
                $window.location.href = "home.html";
            }else {
                alert("wrong user name or password!");
            }
        },
        logOut: function(){
            userStatus = false;
            localforage.setItem(key, userStatus);
            $window.location.href = "index.html";
        },
                };
            },
        };

    };
})(window.angular);