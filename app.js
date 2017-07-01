/* eslint-disable */
/**
 * Created by user on 6/28/2017.
 */
(function(angular){
    'use strict'
    angular.module('Liwam',['TodoService']);
    angular.module('Liwam')
        .config(function($routeProvider){
            $routeProvider
                .when('/:value',{
                    templateUrl: "done.html",
                    controller: "liwamController",

                })
        })
        .controller('liwamController',liwamController);
    liwamController.$inject = ['$scope','Todo','$timeout'];
    function liwamController ($scope,Todo,$timeout){
             $scope.taskList = [];
             $scope.taskListLength = 0;
             $scope.task = '';
             $scope.show = true;
             $scope.routeVaraible = {vari:$routeParams.value}
             $scope.Filter = 'All';
             $scope.compeleted = 0;

            const compute = function() {
                Todo.getTask().then(function(tasks) {
                  $timeout(function(){

                    $scope.compeleted = tasks.filter(function (task) {
                        return task.done;
                    }).length;

                    $scope.taskListLength = tasks.length;

                    $scope.taskList = tasks.filter(function (task) {
                        switch ($scope.Filter) {
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

           compute();

            $scope.add = function(){
                $scope.taskList = Todo.addTask($scope.task);
                $scope.task = '';
            },

            $scope.remove = function (taskId) {
                Todo.removeTask(taskId);
            },

            $scope.toggle = function (taskId){
                Todo.updateWhenToogled(taskId);
             },

            $scope.setFilter = function(filter){
                $scope.Filter = filter;
                compute();
            },

            Todo.subscribe($scope,function() {
              compute();
            });
        };
})(window.angular);

