/* eslint-disable */

(function (angular) {
    /**
     * Created by user on 7/10/2017.
     */
    angular.module('Liwam').run(Run);
    Run.$inject = ['$rootScope', '$timeout', '$location', '$routeParams', 'Todo', 'Authenticate'];

    function Run($rootScope, $timeout, $location, $routeParams, Todo, Authenticate) {
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
        $rootScope.user = '';
        $rootScope.userVaribale = true;
        $rootScope.oldPassword = '';
        $rootScope.newPassword1 = '';
        $rootScope.newPassword2 = '';

        //Authenticate.addUser('user', '1234');
        angular.element(function () {
            $rootScope.$emit('CHANGE');
        });
        const compute = function (filter) {
            if (filter === undefined) {
                return [];
            }

            $timeout(function() {
                Todo.getTask().then(function (tasks) {
                    $rootScope.compeleted = tasks.filter(function (task) {
                        return task.done;
                    }).length;

                    $rootScope.taskListLength = tasks.length;
                    $rootScope.taskList = tasks.filter(function (task) {
                        switch ((filter.toUpperCase())) {
                            case 'ALL':
                                $rootScope.filter='All';
                                return true;

                            case 'DONE':
                                $rootScope.filter='Done';
                                return task.done;

                            case 'UNDONE':
                                $rootScope.filter='Undone';
                                return !task.done;

                            default:
                                $location.path('/filter/All');
                        }
                    });
                });
            });
        };

        $rootScope.$on('$routeChangeSuccess', function (event, toRoute) {
            if (Object.prototype.hasOwnProperty.call(toRoute.params, 'filter')) {
                    $rootScope.filter = toRoute.params.filter;
                    compute(toRoute.params.filter);
            }
            else {
                $rootScope.filter = 'All';
                compute('All')
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

        $rootScope.logOut = function () {
            Authenticate.logOut();
        };

        $rootScope.clicked = function (index) {
            for (let i = 0; i < $rootScope.taskList.length; i++) {
                if ($rootScope.taskList[i].edit === true) {
                    $rootScope.taskList[i].edit = false;
                }
            }
            $rootScope.taskList[index].edit = true;
        };

        $rootScope.updated = function (index) {
            Todo.edit($rootScope.taskList[index].task, index);
            $rootScope.taskList[index].edit = false;
        };

        Todo.subscribe($rootScope, function () {
            compute($routeParams.filter);
        });

        Authenticate.subscribe($rootScope, function () {
            Authenticate.getUsers();
            Authenticate.getLoggedInUser().then(function (value) {
                setTimeout(function () {
                    $rootScope.user = value.userName;
                })
            })
        });

        $rootScope.setting = function () {
            $location.path('AccountSetting');

        };

        $rootScope.changePassword = function (oldPass, newPass1, newPass2) {
            if (Authenticate.getPassword($rootScope.user) === oldPass) {
                if (newPass1 === newPass2) {
                    Authenticate.changePassword($rootScope.user, newPass1);
                }
                else {
                    alert('passwords don\'t match');
                    return;
                }
            }
            else {
                alert('wrong password')
                return;
            }
            alert('password changed successfully!');
            $('.modal-backdrop').remove();
            Authenticate.logOut();
            $rootScope.oldPassword, $rootScope.newPassword1, $rootScope.newPassword2 = '';
        };

        $rootScope.changeUsername = function () {
            Authenticate.changeUsername($rootScope.user);
            $rootScope.userVaribale = true;
        }
    }
})(window.angular);
