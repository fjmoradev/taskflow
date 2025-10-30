const apiUrl = 'http://localhost:3000/tasks';
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskTitle = document.getElementById('taskTitle');

// Cargar tareas
async function loadTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `
      <span style="text-decoration:${task.completed ? 'line-through' : 'none'}">
        ${task.title}
      </span>
      <div>
        <button onclick="toggleTask('${task._id}', ${task.completed})">
          ${task.completed ? 'Desmarcar' : 'Completar'}
        </button>
        <button onclick="deleteTask('${task._id}')">Eliminar</button>
      </div>
    `;
    taskList.appendChild(div);
  });
}

// Agregar tarea
addTaskBtn.addEventListener('click', async () => {
  const title = taskTitle.value.trim();
  if (!title) return;
  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  taskTitle.value = '';
  loadTasks();
});

// Eliminar tarea
async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  loadTasks();
}

// Marcar/Desmarcar tarea
async function toggleTask(id, completed) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed })
  });
  loadTasks();
}

// Inicial
loadTasks();
