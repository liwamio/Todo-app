/**
 * Created by user on 6/28/2017.
 */
(function(angular){
    'use strict'
    angular.module('Liwam',['TodoService']);
    angular.module('Liwam')
        .controller('liwamController',liwamController);
    liwamController.$inject = ['$scope','Todo'];
    function liwamController ($scope,Todo){
             $scope.taskList = Todo.getTask();
             $scope.task = '';
             $scope.Filter = 'All';

            const manageList = function(){
                $scope.taskList = Todo.getTask().filter(function(task){
                    switch($scope.Filter){
                        case 'All':
                            return true;
                        case 'Done':
                            return task.done;
                        case 'Undone':
                            return !task.done;
                        default:
                            return true;
                    }
                })
            }

            $scope.add = function(){
                $scope.taskList = Todo.addTask($scope.task);
                $scope.task = '';
            },

            $scope.remove = function (taskId) {
                Todo.removeTask(taskId);
                manageList();
            },

            $scope.toggle = function (taskId){
                Todo.updateWhenToogled(taskId);
            },

            $scope.setFilter = function(filter){
                $scope.Filter  = filter;
                manageList();
            }

        };

})(window.angular);

