const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const STORAGE_KEY = 'simple-task-manager';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'Chưa có việc nào. Hãy thêm việc đầu tiên!';
    emptyItem.style.justifyContent = 'center';
    emptyItem.style.color = '#6b7280';
    taskList.appendChild(emptyItem);
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = task.completed ? 'completed' : '';

    const left = document.createElement('div');
    left.className = 'left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index));

    const label = document.createElement('span');
    label.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Xoá';
    deleteButton.addEventListener('click', () => deleteTask(index));

    left.append(checkbox, label);
    item.append(left, deleteButton);
    taskList.appendChild(item);
  });
}

function addTask(text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  tasks.unshift({ text: cleanText, completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

renderTasks();
