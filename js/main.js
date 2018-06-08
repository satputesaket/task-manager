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
      listItem.setAttribute('class', 'list-group-items');
      let textNode = document.createTextNode(task.task_name);
      let span = document.createElement("span");
      span.setAttribute('class','due_on')
      let spanTextNode = document.createTextNode("[Due on]: "+task.due_date);
      span.append(spanTextNode);

      listItem.append(textNode);
      listItem.append(span);

      if(task.is_urgent){

        span = document.createElement("span");
        span.setAttribute('class','label label-danger')
        spanTextNode = document.createTextNode(" Urgent ");
        span.append(spanTextNode);
        listItem.append(span);


      }
      let div = document.createElement("div");
      div.setAttribute('class','pull-right');
      let atag = document.createElement("a");
      atag.setAttribute('class','btn btn-primary');
      textNode = document.createTextNode("Edit");
      atag.append(textNode);
      div.append(atag);

      atag = document.createElement("a");
      atag.setAttribute('class','btn btn-danger');
      textNode = document.createTextNode("Delete");
      atag.append(textNode);
      div.append(atag);

      listItem.append(div);
    //  listItem.append(`<div class='pull-right'><a href='#' class='btn btn-primary'>Edit</a><a href='#' class='btn btn-primary'>Delete</a></div>``);
      unorderedList.append(listItem);
    });
    $("#tasks").html(unorderedList);
    console.log(data);
  });
}
