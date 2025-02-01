document.getElementById('addTaskBtn').addEventListener('click', () => {
    const task = document.getElementById('taskInput').value;
    if (task) {
      fetch('http://localhost:3000/run-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: task })
      })
      .then(response => {
        if (response.ok) {
          alert('Task added successfully!');
          document.getElementById('taskInput').value = ''; 
        } else {
          alert('Failed to add task.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred.');
      });
    }
  });