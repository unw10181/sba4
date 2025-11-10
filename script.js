// Retrieves tasks from the local storages 
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Inputs
//Const because scope is global throghout js. 
const taskName = document.getElementById("taskName");
const category = document.getElementById("taskCategory");
const deadLine = document.getElementById("taskDeadLine");
const taskStatus = document.getElementById("taskStatus");
const addTaskBtn = document.getElementById("addTaskBtn");

// UL list within the HTML
const taskList = document.getElementById("taskList");

// FIlters utilized to indentify features of tasks, 
const applyFilterBtn = document.getElementById("applyFilterBtn");
const filterStatus = document.getElementById("filterStatus");
const filterCategory = document.getElementById("filterCategory");

// Function saved tasks to local storage. Function uses tasks and 
// JSON turns array to string. 
function saveTask() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task. When addTaskBtn clicked function takes values from selected categories 
// And input 
addTaskBtn.addEventListener("click", function (event) {
  event.preventDefault(); //prevents empty submission 

  if (taskName.value === "" || deadLine.value === "") return;

  let newTask = {
    id: Date.now(), //current date utilized as unique ID
    name: taskName.value,
    category: category.value,
    deadLine: deadLine.value,
    taskStatus: taskStatus.value,
  }; //Creates Object 

  tasks.push(newTask); //Adds newTasks Object to tasks array 
  saveTask(); //saves to local storage 
  displayTasks(); //renders function 

  taskName.value = "";
  deadLine.value = "";
  taskStatus.value = "Not Started"; 
});

// Check overdue
function checkOverDue(task) {
  let now = new Date(); //new date instance 
  let due = new Date(task.deadLine); 
  return now > due && task.taskStatus !== "Completed";
}

// Display tasks
function displayTasks(list = tasks) {
  taskList.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    let task = list[i];
//Checks due date
    if (checkOverDue(task)) {
      task.taskStatus = "Overdue";
    }

    let li = document.createElement("li");

    li.innerHTML = `
      <strong>${task.name}</strong><br>
      Category: ${task.category}<br>
      Deadline: ${task.deadLine}<br>

      Status:
      <select class="update-status" data-id="${task.id}">
        <option value="Not Started" ${
          task.taskStatus === "Not Started" ? "selected" : ""
        }>Not Started</option>
        <option value="In Progress" ${
          task.taskStatus === "In Progress" ? "selected" : ""
        }>In Progress</option>
        <option value="Completed" ${
          task.taskStatus === "Completed" ? "selected" : ""
        }>Completed</option>
        <option value="Overdue" ${
          task.taskStatus === "Overdue" ? "selected" : ""
        }>Overdue</option>
      </select>

      <button class="delete-btn" data-id="${task.id}">Delete</button>
      <hr>
    `;

    taskList.appendChild(li);
  }

  addStatusListeners();
  addDeleteListeners();
  saveTask();
}

// Function to update status. 
function addStatusListeners() {
  let selects = document.getElementsByClassName("update-status");

  for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener("change", function () {
        //iterates through list to ID. updates the status of the currentitem
      let id = Number(this.getAttribute("data-id"));
      let newStatus = this.value;

      for (let j = 0; j < tasks.length; j++) {
        if (tasks[j].id === id) {
          tasks[j].taskStatus = newStatus;
        }
      }

      saveTask();
      displayTasks();
      //renders output 
    });
  }
}

// Delete task
function addDeleteListeners() {
  let buttons = document.getElementsByClassName("delete-btn");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      let id = Number(this.getAttribute("data-id"));

      tasks = tasks.filter(function (task) {
        return task.id !== id;
      });
      //function removes task that has matching ID. 

      saveTask();
      displayTasks();
    });
  }
}

// Filter
applyFilterBtn.addEventListener("click", function (event) {
  event.preventDefault(); //Cannot be empty

  let s = filterStatus.value;
  let c = filterCategory.value;

  let filtered = tasks.filter(function (task) {
    let matchStatus = task.taskStatus === s;
    let matchCategory = task.category === c;
    return matchStatus && matchCategory;
  });

  displayTasks(filtered);
});

// Load on start
displayTasks();
