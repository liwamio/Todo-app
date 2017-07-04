/* eslint-disable */
/**
 * Created by user on 6/28/2017.
 */
(function(angular){
    angular.module('Liwam',['TodoService','ngRoute','AuthenticateService']);
    angular.module('Liwam')
        .config(function($routeProvider){
          $routeProvider
            .when('/:filter?', {
                templateUrl: 'view/filter.html',
                resolve: {'isLoggedIn': function(Authenticate,$window) {
                    localforage.getItem('AuthenticationKey')
                         .then(function(value){
                             if (value=== true) {
                             }else {
                                alert("you haven't logged in.");
                                $window.location.href = 'index.html'
                            }
                    })
                }
                },
            })
            .otherwise({
              templateUrl: 'view/not-found.html',
              resolve: {'isLoggedIn': function(Authenticate,$window){
                localforage.getItem('AuthenticationKey')
                    .then(function(value){
                        if(value === true){
                        }else{
                            alert("you haven't logged in.");
                            $window.location.href = 'index.html';
                        }
                    })
              }},
            })
        })
        .run(Run);

        Run.$inject = ['$rootScope','$timeout','Todo','Authenticate'];

        function Run($rootScope, $timeout, Todo, Authenticate) {
          $rootScope.task = '';
          $rootScope.taskList = [];
          $rootScope.taskListLength = 0;
          $rootScope.compeleted = 0;
          $rootScope.filter = 'All';

          $rootScope.add = function(){
            $rootScope.taskList = Todo.addTask($rootScope.task);
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
                } else {
                    compute('All');
                }

          });

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

          Todo.subscribe($rootScope, function() {
            compute($rootScope.filter);
          });
        }
})(window.angular);

