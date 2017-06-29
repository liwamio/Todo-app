/**
 * Created by user on 6/28/2017.
 */
(function (angular) {
    angular.module("TodoService",[]);
    angular.module("TodoService")
        .provider("Todo",Todo);
         function Todo(){

             localforage.config({
                 name: 'LIWAM',
                 storeName: 'LIWAM',
                 description: 'LIWAM',
             });

            let taskList = [];
            const key = "ToDoTasks";
            const EVENT = 'CHANGE';
            const syncToLocalStorage = function(){
              return localforage.setItem(key,angular.copy(taskList));
            };
        return{
            $get: function(){
                return {

        addTask: function(task){
            if(task.length === 0){
                return taskList;
            }
              taskList.push({
              id: Date.now(),
              task: task,
              done: false
              });
              return angular.copy(taskList);
        },
        getTask: function(){
            return new Promise(function(resolve,reject){
                localforage.getItem(key).then(function(value){
                    taskList = value === null ? [] : value;
                    resolve(angular.copy(taskList));
                },
                function(){
                    taskList = [];
                    resolve(angular.copy(taskList));
                });
            });
        },

        removeTask: function(taskId){
            let removeIndex = -1;
            for(let i=0; i<taskList.length; i++){
                if(taskList[i].id === taskId){
                    removeIndex = i;
                }
            }
            if(removeIndex !=-1)
            taskList.splice(removeIndex,1);

        },

        updateWhenToogled: function(taskId){
            let toogleIndex = -1;
            for(let i=0; i<taskList.length; i++){
                if(taskList[i].id === taskId){
                    toogleIndex = i;
                }
            }
            taskList[toogleIndex].done = !taskList[toogleIndex].done;
        },


                };
            },
        };

    };
})(window.angular);