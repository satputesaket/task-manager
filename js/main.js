$(document).ready(function(){
    getTasks();
    getCategories();
    getCategoryOptions();
    $("#add_category").on('submit', addCategory);
    $("#add_task").on('submit', addTask);
    $("body").on('click', ".btn-edit-task", setTask);
    $("#edit_task").on('submit', editTasks);
    $("body").on('click', ".btn-delete-task", deleteTask);
    $("body").on('click', ".btn-edit-category", setCategory);
    $("#edit_category").on('submit', editCategories);
    $("body").on('click', ".btn-delete-category", deleteCategory);



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
      atag.setAttribute('class','btn btn-primary btn-edit-task');
      atag.setAttribute('data-task-name',task.task_name);
      atag.setAttribute('data-task-id',task._id.$oid);


      textNode = document.createTextNode("Edit");
      atag.append(textNode);
      div.append(atag);

      atag = document.createElement("a");
      atag.setAttribute('class','btn btn-danger btn-delete-task');
      textNode = document.createTextNode("Delete");
      atag.setAttribute('data-task-name',task.task_name);
      atag.setAttribute('data-task-id',task._id.$oid);
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

function setTask(){
  let task_id=$(this).data('task-id');
  sessionStorage.setItem('current_id',task_id);
  window.location.href="edittasks.html";
  return false;
}

function deleteTask(){
  let task_id=$(this).data('task-id');

  $.ajax({
    url:"https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/"+task_id+"?apiKey="+apiKey,
    async:true,
    type:'DELETE',
    contentType:"application/json",
    success:function(data){
      alert("DELETED successfully!!");
      window.location.href="index.html";
    },
    error:function(xhr, status, err){
      console.log(err);
    }
  });


}



function getTasksById(id){
  console.log("get tasks called by "+id);
  $.get(`https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/${id}?apiKey=${apiKey}`,function(task){
     $('#task_name').val(task.task_name);
     $('#categories').val(task.category).attr('selected',true);
     $('#is_urgent').val(task.is_urgent).attr('selected',true);;

     var d = new Date(Date.parse(task.due_date));
     date = [
       d.getFullYear(),
       ('0' + (d.getMonth() + 1)).slice(-2),
       ('0' + d.getDate()).slice(-2)
      ].join('-');

     console.log(Date.parse(task.due_date));
     $('#due_date').val(`${date}`);

  });
}


function editTasks(e){
  e.preventDefault();

  let task_id = sessionStorage.getItem('current_id');
  console.log(task_id);
  let task_name = $('#task_name').val();
  let category = $('#categories').val();
  let due_date = $('#due_date').val();
  let is_urgent = $('#is_urgent').val();

  $.ajax({
    url:"https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/"+task_id+"?apiKey="+apiKey,
    data:JSON.stringify({
      "task_name":task_name,
      "category":category,
      "due_date":due_date,
      "is_urgent":is_urgent
    }),
    type:'PUT',
    contentType:"application/json",
    success:function(data){
      alert("Added successfully!!");
      window.location.href="index.html";
    },
    error:function(xhr, status, err){
      console.log(err);
    }
  });
  console.log("add task");

}

function addTask(e){
  let task_name = $('#task_name').val();
  let category = $('#categories').val();
  let due_date = $('#due_date').val();
  let is_urgent = $('#is_urgent').val();

  $.ajax({
    url:'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey='+apiKey,
    data:JSON.stringify({
      "task_name":task_name,
      "category":category,
      "due_date":due_date,
      "is_urgent":is_urgent
    }),
    type:'POST',
    contentType:"application/json",
    success:function(data){
      alert("Added successfully!!");
      window.location.href="index.html";
    },
    error:function(xhr, status, err){
      console.log(err);
    }
  });
  e.preventDefault();
  console.log("add task");

}
function getCategoryOptions(){
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey='+apiKey,function(data){

    console.log(data);
    $.each(data, function(key, category){
      let option = document.createElement("option");
      option.setAttribute("value",category.category_name);
      option.append( document.createTextNode(category.category_name));
      $("#categories").append(option);
    });

  });
}


  function getCategories(){
    $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey='+apiKey,function(data){
      let unorderedList = document.createElement("ul");
      unorderedList.setAttribute('class', 'list-group');

      $.each(data, function(key, category){
        let listItem = document.createElement("li");
        listItem.setAttribute('class', 'list-group-items');
        let textNode = document.createTextNode(category.category_name);

        listItem.append(textNode);

        let div = document.createElement("div");
        div.setAttribute('class','pull-right');
        let atag = document.createElement("a");
        atag.setAttribute('class','btn btn-primary btn-edit-category');
        atag.setAttribute('data-category-name',category.category_name);
        atag.setAttribute('data-category-id',category._id.$oid);


        textNode = document.createTextNode("Edit");
        atag.append(textNode);
        div.append(atag);

        atag = document.createElement("a");
        atag.setAttribute('class','btn btn-danger btn-delete-category');
        textNode = document.createTextNode("Delete");
        atag.setAttribute('data-category-name',category.category_name);
        atag.setAttribute('data-category-id',category._id.$oid);
        atag.append(textNode);
        div.append(atag);

        listItem.append(div);
      //  listItem.append(`<div class='pull-right'><a href='#' class='btn btn-primary'>Edit</a><a href='#' class='btn btn-primary'>Delete</a></div>``);
        unorderedList.append(listItem);
      });
      $("#category").html(unorderedList);
      console.log(data);
    });
  }

  function addCategory(e){
    let category_name = $('#category_name').val();

    $.ajax({
      url:'https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey='+apiKey,
      data:JSON.stringify({
        "category_name":category_name
      }),
      type:'POST',
      contentType:"application/json",
      success:function(data){
        alert("Added successfully!!");
        window.location.href="categories.html";
      },
      error:function(xhr, status, err){
        console.log(err);
      }
    });
    e.preventDefault();
    console.log("add task");

  }

  function setCategory(){
    let category_id=$(this).data('category-id');
    sessionStorage.setItem('current_category_id',category_id);
    window.location.href="editcategories.html";
    return false;
  }

function getCategoriesById(id){
  console.log("get tasks called by "+id);
  $.get(`https://api.mlab.com/api/1/databases/taskmanager/collections/categories/${id}?apiKey=${apiKey}`,function(category){
     $('#category_name').val(category.category_name);

  });
}
function editCategories(e){
  e.preventDefault();

  let category_id = sessionStorage.getItem('current_category_id');
  let category_name = $('#category_name').val();

  $.ajax({
    url:"https://api.mlab.com/api/1/databases/taskmanager/collections/categories/"+category_id+"?apiKey="+apiKey,
    data:JSON.stringify({
      "category_name":category_name
    }),
    type:'PUT',
    contentType:"application/json",
    success:function(data){
      alert("Added successfully!!");
      window.location.href="categories.html";
    },
    error:function(xhr, status, err){
      console.log(err);
    }
  });
  console.log("add task");

}


function deleteCategory(e){
  let category_id=$(this).data('category-id');

  $.ajax({
    url:"https://api.mlab.com/api/1/databases/taskmanager/collections/categories/"+category_id+"?apiKey="+apiKey,
    async:true,
    type:'DELETE',
    contentType:"application/json",
    success:function(data){
      alert("DELETED successfully!!");
      window.location.href="categories.html";
    },
    error:function(xhr, status, err){
      console.log(err);
    }
  });


}
