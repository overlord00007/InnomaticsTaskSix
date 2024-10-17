// Task Array to store tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskNameInput = document.getElementById('taskName');
const dueDateInput = document.getElementById('dueDate');
const categoryInput = document.getElementById('category');
const priorityInput = document.getElementById('priority');
const filterButtons = document.querySelectorAll('.filters button');

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskAction);
filterButtons.forEach(button => 
  button.addEventListener('click', () => filterTasks(button.dataset.filter))
);

// Add Task
function addTask() {
  const taskName = taskNameInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categoryInput.value;
  const priority = priorityInput.value;

  if (!taskName || !dueDate) {
    alert('Please enter both task name and due date.');
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskName,
    dueDate,
    category,
    priority,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskNameInput.value = '';
  dueDateInput.value = '';
}

// Handle Task Actions (Complete, Edit, Delete)
function handleTaskAction(e) {
  const taskId = e.target.closest('li').dataset.id;

  if (e.target.classList.contains('delete')) {
    tasks = tasks.filter(task => task.id != taskId);
  } else if (e.target.classList.contains('toggle')) {
    const task = tasks.find(task => task.id == taskId);
    task.completed = !task.completed;
  }

  saveTasks();
  renderTasks();
}

// Render Tasks Based on Filter
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
  });

  filteredTasks.forEach(task => {
    const taskElement = document.createElement('li');
    taskElement.className = `task ${task.completed ? 'completed' : ''}`;
    taskElement.dataset.id = task.id;

    taskElement.innerHTML = `
      <span>${task.name} | Due: ${task.dueDate} | ${task.category} | ${task.priority}</span>
      <div>
        <button class="toggle">${task.completed ? 'Undo' : 'Complete'}</button>
        <button class="delete">Delete</button>
      </div>
    `;

    taskList.appendChild(taskElement);
  });
}

// Save Tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter Tasks
function filterTasks(filter) {
  renderTasks(filter);
}

// Initial Render
renderTasks();
