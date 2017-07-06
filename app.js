/* eslint-disable */
/**
 * Created by user on 6/28/2017.
 */
(function(angular){
    angular.module('Liwam',['TodoService','ngRoute','AuthenticateService']);
    angular.module('Liwam')
        .config(function($routeProvider){
          $routeProvider
            .when('/login',{
                templateUrl: 'view/login.html',
                controller: logController,
                resolve:{'isLoggedOut': ['Authenticate',function(AuthenticateProvider){
                    AuthenticateProvider.setPath('login');
                    AuthenticateProvider.setKey('AuthenticationKey');
                    return AuthenticateProvider.getStatus();
                }]}
            })
            .when('/',{
                templateUrl: 'view/home.html',
                controller: homeController,
                resolve:{'isLoggedIn': ['Authenticate',function(AuthenticateProvider){
                    AuthenticateProvider.setPath('login');
                    AuthenticateProvider.setKey('AuthenticationKey');
                    return AuthenticateProvider.getStatus();
                }]}
            })
            .when('/:filter', {
                templateUrl: 'view/home.html',
                controller: homeController,
                resolve:{'isLoggedIn': ['Authenticate',function(AuthenticateProvider){
                    AuthenticateProvider.setPath('login');
                    AuthenticateProvider.setKey('AuthenticationKey');
                    return AuthenticateProvider.getStatus();
                }]}
            })
            .otherwise({
                templateUrl: 'view/not-found.html',
            })
        })
        .controller('logController',logController)
        .controller('homeController',homeController)
        .run(Run);

       logController.$inject = ['$location','Authenticate','isLoggedOut'];
          function logController($location,Authenticate,isLoggedOut){
            if(isLoggedOut === true){
                $location.path('/home').replace();
            }
            else {
                $location.path('/'+Authenticate.getPath()).replace();
            }
          };

       homeController.$inject = ['$location','Authenticate','isLoggedIn'];
          function homeController($location,Authenticate,isLoggedIn){
            if(isLoggedIn === false){
                $location.path('/'+Authenticate.getPath()).replace();
            }
          };

       Run.$inject = ['$rootScope','$timeout','Todo','Authenticate'];

          function Run($rootScope, $timeout, Todo, Authenticate) {
          localforage.config({
              name: 'LIWAM',
              storeName: 'LIWAM',
              description: 'LIWAM',
          });
          $rootScope.task = '';
          $rootScope.taskList = [];
          $rootScope.taskListLength = 0;
          $rootScope.compeleted = 0;
          $rootScope.filter = 'All';

          $rootScope.add = function(task){
            $rootScope.taskList = Todo.addTask(task);
            $rootScope.task = '';
          };


          const compute = function(filter) {
            Todo.getTask().then(function(tasks) {
                $timeout(function(){
                  $rootScope.compeleted = tasks.filter(function (task) {
                    return task.done;
                  }).length;

                  $rootScope.taskListLength = tasks.length;
                  $rootScope.taskList = tasks.filter(function (task) {
                    switch (filter) {
                      case 'All':
                        return true;

                      case 'Done':
                        return task.done;

                      case 'Undone':
                        return !task.done;

                      default:
                        return true;
                    }
                  });
                });
            });
          };

          $rootScope.$on('$routeChangeSuccess',function(event, toRoute) {
            if (Object.prototype.hasOwnProperty.call(toRoute.params, 'filter')) {
                compute(toRoute.params.filter);
            }
            else{
                compute('All');
            }
          });

          $rootScope.add = function(task){
            $rootScope.taskList = Todo.addTask(task);
            $rootScope.task = '';
          };

          $rootScope.remove = function (taskId) {
            Todo.removeTask(taskId);
          };

          $rootScope.toggle = function (taskId) {
            Todo.updateWhenToogled(taskId);
          };

          $rootScope.setFilter = function(filter){
            $rootScope.filter = filter;
            compute(filter);
          };

          $rootScope.logOut = function(){
             Authenticate.logOut();
          }

          $rootScope.logIn = function(userName,password){
             Authenticate.logIn(userName, password);
          }

          Todo.subscribe($rootScope, function() {
            compute($rootScope.filter);
          });
        }
})(window.angular);

