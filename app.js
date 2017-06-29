/**
 * Created by user on 6/28/2017.
 */
(function(angular){
    'use strict'
    angular.module('Liwam',['TodoService']);
    angular.module('Liwam')
        .controller('liwamController',liwamController);
    liwamController.$inject = ['$scope','Todo','$timeout'];
    function liwamController ($scope,Todo,$timeout){
             $scope.taskList = []
             $scope.taskListLength = 0;
             $scope.task = '';
             $scope.Filter = 'All';

            const manageList = function() {
                Todo.getTask().then(function(tasks){
                    $timeout(function(){
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
                    Todo.event();
                })
            }

            $scope.add = function(){
                $scope.taskList = Todo.addTask($scope.task);
                $scope.task = '';
            },

            $scope.remove = function (taskId) {
                Todo.removeTask(taskId);
            },

            $scope.toggle = function (taskId){
                Todo.updateWhenToogled(taskId);

            $scope.setFilter = function(filter){
                $scope.Filter  = filter;
                manageList();
            },

            Todo.subscribe($scope,function() {
                Todo.getTask().then(function (tasks) {
                  $timeout(function(){
                    $scope.compeleted = tasks.filter(function (task) {
                        return task.done;
                    }).length;
                    $scope.taskListLength = tasks.length;
                    manageList();
                });
                });
            });


        };

})(window.angular);

