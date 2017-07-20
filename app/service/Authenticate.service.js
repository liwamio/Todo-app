/* eslint-disable */
/**
 * Created by user on 7/3/2017.
 */

(function (angular) {
    angular.module('AuthenticateService', []);
    angular.module('AuthenticateService')
        .provider('Authenticate', AuthenticateProvider);
    function AuthenticateProvider() {
        const EVENT = 'CHANGE';
        const authConfig = {
            pathOnFail: 'login', // if user is not logged in take to this path
            pathOnSuccess: 'filter/All',
            key: 'AuthenticationKey'
        };
        let users = [];

        let currentUser = {loggedIn: false, userName: '', id: ''};
        const userData = {
            key: 'users'
        };

        const syncToLocalStorage = function () {
            return localforage.setItem(userData.key, angular.copy(users));
        };

        return {
            config: function (option) {
                angular.extend(authConfig, option);
            },
            getStatus: ['$q', '$location', function ($q, $location) {
                return $q(function (resolve, reject) {
                    localforage.getItem(authConfig.key).then(function (value) {
                        if(value === null){
                            $location.path(authConfig.pathOnFail).replace();
                            return;
                        }
                        if (value.loggedIn === null || value.loggedIn === false) {
                            reject();
                            $location.path(authConfig.pathOnFail).replace();
                        } else {
                            resolve();
                        }
                    });
                });
            }],

            $get: function ($http, $q, $timeout, $rootScope, $location) {
                return {

                    logIn: function (username, password) {
                        let shaObj= new jsSHA("SHA-256","TEXT");
                        return new Promise(function (resolve, reject) {
                            for (let i = 0; i < users.length; i++) {
                                shaObj.update(password);
                                if (username === users[i].userName && users[i].password === shaObj.getHash("HEX")) {
                                    currentUser.loggedIn = true;
                                    currentUser.userName = users[i].userName;
                                    currentUser.id = users[i].id;
                                    localforage.setItem(authConfig.key, currentUser).then(function () {
                                        $rootScope.$emit(EVENT);
                                        resolve();
                                    })
                                }

                                else {
                                    reject('wrong user name or password');
                                    alert('wrong user name or password');
                                }
                            }
                        })
                    },

                    logOut: function () {
                        currentUser.loggedIn = false;
                        currentUser.userName = '';
                        currentUser.id = '';
                        localforage.setItem(authConfig.key, currentUser).then(function () {
                            $location.path(authConfig.pathOnFail).replace();
                            $rootScope.$apply();
                        })
                    },

                    getPath: function () {
                        return authConfig.pathOnFail;
                    },
                    getPathSuccess: function () {
                        return authConfig.pathOnSuccess;
                    },

                    isLoggedIn: function () {
                        return localforage.getItem(authConfig.key);
                    },
                    getUsers: function () {
                        return new Promise(function (resolve, reject) {
                            localforage.getItem(userData.key).then(function (value) {
                                $timeout(function () {
                                    users = value;
                                })
                            })
                        })
                    },

                    changePassword: function (userName, newPass) {
                        for (let i = 0; i < users.length; i++) {
                            if (users[i].userName === userName) {
                                let shaObj= new jsSHA("SHA-256","TEXT");
                                shaObj.update(newPass);
                                users[i].password = shaObj.getHash("HEX");
                                syncToLocalStorage().then(function () {
                                    $rootScope.$emit(EVENT);
                                })
                            }
                        }
                    },

                    addUser: function (userName, password) {
                        users.push({
                            userName: userName,
                            password: password,
                            loggedIn: false,
                            id: Date.now()
                        })
                        syncToLocalStorage().then(function () {
                            $rootScope.$emit(EVENT);
                        });
                    },

                    subscribe: function (scope, callback) {
                        const unsubscribe = $rootScope.$on(EVENT, callback);
                        scope.$on('$destroy', unsubscribe);
                        return unsubscribe;
                    },

                    getLoggedInUser: function () {
                        return new Promise(function (resolve, reject) {
                            localforage.getItem(authConfig.key).then(function (value) {
                                    resolve(angular.copy(value))
                                },
                                function () {
                                    reject([]);
                                })
                        })
                    },
                    getPassword: function (userName) {
                        let Password = '';
                        for (let i = 0; i < users.length; i++) {
                            if (users[i].userName === userName) {
                                Password = users[i].password;
                            }
                        }
                        return Password;
                    },

                    changeUsername: function (userName) {
                        let index = -1;
                        localforage.getItem(authConfig.key).then(function (value) {
                            for (let i = 0; i < users.length; i++) {
                                if (users[i].id === value.id) {
                                    index = i;
                                    console.log('inside if')
                                    if (users[i].userName === userName && i !== index) {
                                        alert('username already exists');
                                    }
                                    else {
                                        console.log('current username '+users[index].userName)
                                        console.log('second username '+ userName)
                                        users[index].userName = userName;
                                        currentUser.userName = userName;
                                        localforage.setItem(authConfig.key, currentUser).then(function () {
                                            syncToLocalStorage().then(function () {
                                                $rootScope.$emit(EVENT);
                                            })
                                        })
                                    }
                                }
                                else{
                                    console.log('inside else')
                                }
                            }
                        })

                    },
                    boot: function(){
                        localforage.getItem(userData.key).then(function(value){
                            if(value === null){

                                users.push({
                                    userName:'user',
                                    password: '1234',
                                    id: Date.now(),
                                    loggedIn: false});
                                let shaObj= new jsSHA("SHA-256","TEXT");
                                shaObj.update(users[0].password);
                                users[0].password = shaObj.getHash("HEX");
                                localforage.setItem(userData.key,users).then(function() {
                                    localforage.setItem(authConfig.key, currentUser);
                                    syncToLocalStorage().then(function () {
                                        $rootScope.$emit(EVENT);
                                    })

                                })
                        }
                            else{
                                $rootScope.$emit(EVENT);
                            }
                        })
                    }

                };
            },
        };

    };
})(window.angular);
