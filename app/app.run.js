(function (angular) {
    /**
     * Created by user on 7/10/2017.
     */
    angular.module('Liwam').run(Run);
    Run.$inject = ['$rootScope', '$timeout', '$routeParams', 'Todo', 'Authenticate'];

    function Run($rootScope, $timeout, $routeParams, Todo, Authenticate) {
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
        $rootScope.userName = '';
        $rootScope.password = '';

        const compute = function (filter) {
            Todo.getTask().then(function (tasks) {
                $timeout(function () {
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

        $rootScope.$on('$routeChangeSuccess', function (event, toRoute) {
            if (Object.prototype.hasOwnProperty.call(toRoute.params, 'filter')) {
                compute(toRoute.params.filter);
            }
            else {
                compute('All');
            }
        });

        $rootScope.add = function () {
            $rootScope.taskList = Todo.addTask($rootScope.task);
            $rootScope.task = '';
        };

        $rootScope.remove = function (taskId) {
            Todo.removeTask(taskId);
        };

        $rootScope.toggle = function (taskId) {
            Todo.updateWhenToogled(taskId);
        };

        $rootScope.setFilter = function (filter) {
            $rootScope.filter = filter;
            compute(filter);
        };

        $rootScope.logOut = function () {
            Authenticate.logOut();
        }

        $rootScope.logIn = function () {
            Authenticate.logIn($rootScope.userName, $rootScope.password);
            $rootScope.userName = '';
            $rootScope.password = '';

        }

        Todo.subscribe($rootScope, function () {
            compute($routeParams.filter);
        });
    }
})(window.angular);