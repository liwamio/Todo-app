/* eslint-disable */

/**
 * Created by user on 6/28/2017.
 */
(function (angular) {
    angular.module("TodoService", []);
    angular.module("TodoService")
        .provider("Todo", Todo);
    function Todo() {
        let taskList = [];
        const key = "ToDoTasks";
        const EVENT = 'CHANGE';
        const syncToLocalStorage = function () {
            return localforage.setItem(key, angular.copy(taskList));
        };
        return {
            $get: ['$rootScope', function ($rootScope) {
                return {

                    addTask: function (task) {
                        return new Promise(function(resolve, reject) {
                            taskList.push({
                                id: Date.now(),
                                task: task,
                                done: false,
                                edit: false
                            });

                            syncToLocalStorage().then(function () {
                                $rootScope.$emit(EVENT);
                                resolve(angular.copy(taskList));
                            }, function(err) {
                                reject(err);
                            });
                        });

                    },
                    getTask: function () {
                        return new Promise(function (resolve, reject) {
                            localforage.getItem(key).then(function (value) {
                                    taskList = value === null ? [] : value;
                                    resolve(angular.copy(taskList));
                                },
                                function () {
                                    taskList = [];
                                    resolve(angular.copy(taskList));
                                });
                        });
                    },

                    removeTask: function (taskId) {
                        let removeIndex = -1;
                        for (let i = 0; i < taskList.length; i++) {
                            if (taskList[i].id === taskId) {
                                removeIndex = i;
                            }
                        }
                        if (removeIndex != -1)
                            taskList.splice(removeIndex, 1);
                        syncToLocalStorage().then(function () {
                            $rootScope.$emit(EVENT);
                        });
                    },

                    updateWhenToogled: function (taskId) {
                        let toogleIndex = -1;
                        for (let i = 0; i < taskList.length; i++) {
                            if (taskList[i].id === taskId) {
                                toogleIndex = i;
                            }
                        }
                        taskList[toogleIndex].done = !taskList[toogleIndex].done;
                        syncToLocalStorage().then(function () {
                            $rootScope.$emit(EVENT);
                        });
                    },

                    edit: function (updatedTask, index) {
                        taskList[index].task = updatedTask;
                        syncToLocalStorage().then(function () {
                            $rootScope.$emit(EVENT);
                        });
                    },

                    subscribe: function (scope, callback) {
                        const unsubscribe = $rootScope.$on(EVENT, callback);
                        scope.$on('$destroy', unsubscribe);
                        return unsubscribe;
                    },


                };
            }],
        };

    };
})(window.angular);
