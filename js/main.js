$(document).ready(function(){
    getTasks();
});

const apiKey='40rTGTJISnh2xBZMV9Q6UQyAqBM1ITcH';

function getTasks(){
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey='+apiKey,function(data){
    let unorderedList = document.createElement("ul");
    unorderedList.setAttribute('class', 'list-group');

    $.each(data, function(key, task){
      let listItem = document.createElement("li");
      listItem.setAttribute('class', 'list-group-item');
      let textNode = document.createTextNode(task.task_name+" "+task.category+ " "+task.due_date);

      listItem.append(textNode);
      unorderedList.append(listItem);
    });
    $("#tasks").html(unorderedList);
    console.log(data);
  });
}
