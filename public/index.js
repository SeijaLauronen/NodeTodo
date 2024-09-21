document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('add-task-form');
    const userForm = document.getElementById('add-user-form');
    const todoList = document.getElementById('todo-list');
    const userList = document.getElementById('user-list');
    const assignedUserSelect = document.getElementById('assignedUser');
  
    // Hae kaikki tehtävät ja käyttäjät alussa
    fetchTasks();
    fetchUsers();
  
    // Lisää tehtävä
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const task = document.getElementById('task').value;
      const dueDate = document.getElementById('dueDate').value;
      const assignedUser = document.getElementById('assignedUser').value;
  
      const res = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, dueDate, assignedUser }),
      });
  
      if (res.ok) {
        fetchTasks();
        taskForm.reset();
      }
    });
  
    // Lisää käyttäjä
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
  
      const res = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });
  
      if (res.ok) {
        fetchUsers();
        userForm.reset();
      }
    });
  
    // Hae tehtävät
    async function fetchTasks() {
      const res = await fetch('/tasks');
      const tasks = await res.json();
      todoList.innerHTML = tasks.map(
        (task) =>
          `<li>${task.task} - Tekijä: ${task.userName} - Määräaika: ${task.dueDate}</li>`
      ).join('');
    }
  
    // Hae käyttäjät
    async function fetchUsers() {
      const res = await fetch('/users');
      const users = await res.json();
      userList.innerHTML = users.map(
        (user) => `<li>${user.firstName} ${user.lastName}</li>`
      ).join('');
      assignedUserSelect.innerHTML = users.map(
        (user) => `<option value="${user.id}">${user.firstName} ${user.lastName}</option>`
      ).join('');
    }
  });
  