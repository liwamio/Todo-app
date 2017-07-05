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
            })
            .when('/',{
               templateUrl: 'view/home.html'
            })
            .when('/:filter', {
              templateUrl: 'view/filter.html',
            })
            .otherwise({
              templateUrl: 'view/not-found.html',
            })
        })
        .run(Run);

        Run.$inject = ['$rootScope','$timeout','Todo','Authenticate','$location'];

        function Run($rootScope, $timeout, Todo, Authenticate, $location) {
          $rootScope.task = '';
          $rootScope.taskList = [];
          $rootScope.taskListLength = 0;
          $rootScope.compeleted = 0;
          $rootScope.filter = 'All';
          $rootScope.loggedIn = false;
          Authenticate.getStatus().then(function(value){
              $timeout(function(){
                  $rootScope.loggedIn = value;
              })
          })

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
             $rootScope.loggedIn = Authenticate.logOut();
          }
          $rootScope.logIn = function(){
              $rootScope.loggedIn = Authenticate.logIn($rootScope.userName, $rootScope.password);
          }


          Todo.subscribe($rootScope, function() {
            compute($rootScope.filter);
          });
        }
})(window.angular);

