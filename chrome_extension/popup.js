const addTask = () => {
  const page_input = document.getElementById('page_input').value;
  const task_input = document.getElementById('task_input').value;
  const addTaskBtn = document.getElementById('addTaskBtn');
  const toggle_task = document.getElementById('toggle_task').checked;

  if (task_input !== '' && page_input !== '' && toggle_task === true || page_input !== '' && toggle_task === false) {
    // Disable the button and show the spinner
    addTaskBtn.disabled = true;
    addTaskBtn.innerHTML = '<div class="spinner"></div>';  // Insert the spinner inside the button
    document.getElementById('announcementText').textContent = '';


    fetch('http://localhost:3000/run-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_input: page_input, task_input: task_input, toggle_task: toggle_task})
    })
    .then(response => {
      if (response.ok) {
        return response.json(); // Convert response to JSON if successful
      } else {
        throw new Error('Failed to add task.');
      }
    })
    .then(data => {
      document.getElementById('announcementText').textContent = 'Task added successfully!';
      document.getElementById('page_input').value = '';
      document.getElementById('task_input').value = '';

      // Open the URL if it's provided in the response
      console.log('Extension data received::', data);
      if (data.url) {
        chrome.tabs.create({ url: data.url });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('announcementText').textContent = 'An error occurred. Try again!';
      document.getElementById('announcementText').style.color = 'red';
    })
    .finally(() => {
      // Reset the button once the task is complete
      addTaskBtn.disabled = false;
      addTaskBtn.innerHTML = 'AI Run';  // Reset button text to default
    });
  } else {
    alert('Please complete both fields!');
  }
};

// Random GPT Stuff

// Check browser's default mode on load and set the theme accordingly
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set the initial theme based on browser's preference
if (prefersDarkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('modeIcon').textContent = '🌙';  // Moon emoji for dark mode
} else {
    document.body.classList.add('light-mode');
    document.getElementById('modeIcon').textContent = '🌞';  // Sun emoji for light mode
}

// Handle Enter key press (submit when Enter is pressed)
document.getElementById('page_input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && document.getElementById('toggle_task').checked) {
        // warning popup to complete the task too
        alert('Please fill both fields!');
    }
    else if (event.key === 'Enter' && !document.getElementById('toggle_task').checked) {
      document.getElementById('addTaskBtn').click();
    }
});

document.getElementById('task_input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      document.getElementById('addTaskBtn').click();
    }
});

// Handle button click to add task
document.getElementById('addTaskBtn').addEventListener('click', addTask);

// Handle dark mode toggle
document.getElementById('darkModeBtn').addEventListener('click', () => {
    const body = document.body;
    const modeIcon = document.getElementById('modeIcon');

    // Toggle dark mode class and change the emoji based on the mode
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        modeIcon.textContent = '🌙';  // Switch to moon emoji for dark mode
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        modeIcon.textContent = '🌞';  // Switch to sun emoji for light mode
    }
});

document.getElementById('toggle_task').addEventListener('change', function() {
  const taskInput = document.getElementById('task_input');
  if (this.checked) {
      taskInput.style.display = 'block';
  } else {
      taskInput.style.display = 'none';
  }
});

// Handle task addition (works both by clicking the button or pressing Enter)
// document.getElementById('addTaskBtn').addEventListener('click', () => {
//   const page_input = document.getElementById('page_input').value;
//   const task_input = document.getElementById('task_input').value;
//   const addTaskBtn = document.getElementById('addTaskBtn');

//   if (task_input !== '' && page_input !== '') {
//       // Disable the button and show loading spinner
//       addTaskBtn.disabled = true;
//       addTaskBtn.innerHTML = '<div class="spinner"></div>';  // Adding spinner inside button
      
//       fetch('http://localhost:3000/run-task', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ page_input: page_input, task_input: task_input })
//       })
//       .then(response => {
//           if (response.ok) {
//               return response.json();  // Convert response to JSON if successful
//           } else {
//               throw new Error('Failed to add task.');
//           }
//       })
//       .then(data => {
//           document.getElementById('announcementText').textContent = 'Task added successfully!';
//           document.getElementById('page_input').value = '';
//           document.getElementById('task_input').value = '';

//           // Open the URL if it's provided in the response
//           console.log('Extension data received::', data);
//           if (data.url) {
//               chrome.tabs.create({ url: data.url });
//           }
//       })
//       .catch(error => {
//           console.error('Error:', error);
//           alert('An error occurred.');
//       })
//       .finally(() => {
//           // Re-enable the button and revert to original text
//           addTaskBtn.disabled = false;
//           addTaskBtn.innerHTML = 'AI Run';  // Reset button text
//       });
//   } else {
//       alert('Please enter a task and page URL.');
//   }
// });

