// Handle button click to close the extension
document.getElementById('closeBtn').addEventListener('click', () => {
  window.close(); // Closes the popup when clicked
});


const addTask = () => {
  const page_input = document.getElementById('page_input').value;
  const task_input = document.getElementById('task_input').value;
  const addTaskBtn = document.getElementById('addTaskBtn');

  if (task_input !== '' && page_input !== '') {
    // Disable the button and show the spinner
    addTaskBtn.disabled = true;
    addTaskBtn.innerHTML = '<div class="spinner"></div>';  // Insert the spinner inside the button
    document.getElementById('announcementText').textContent = '';


    fetch('http://localhost:3000/run-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_input: page_input, task_input: task_input})
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('announcementText').textContent = 'Task added successfully!';
        document.getElementById('page_input').value = '';
        document.getElementById('task_input').value = '';
        return response.json(); // Convert response to JSON if successful
      } else {
        throw new Error('Failed to add task.');
      }
    })
    .then(data => {
      // Open the URL if it's provided in the response
      // console.log('Extension data received::', data);
      json_data = JSON.parse(data);
      document.getElementById('announcementText').textContent = 'Extension data received::'+ json_data.url; ;
      if (json_data.url) {
        chrome.tabs.create({ url: json_data.url });
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
    document.getElementById('announcementText').textContent = 'Please complete the fields.';
    document.getElementById('announcementText').style.color = 'orange';
  }
};

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
const checkInputComplete = (event) => {
  if (event.key === 'Enter' && (document.getElementById('page_input').value === '' || document.getElementById('task_input').value === '')) {
      // warning popup to complete the task too
    document.getElementById('announcementText').textContent = 'Please complete the fields.';
    document.getElementById('announcementText').style.color = 'orange';
  }
  else if (event.key === 'Enter') {
    document.getElementById('addTaskBtn').click();
  }
}
document.getElementById('page_input').addEventListener('keypress', (event) => checkInputComplete(event));
document.getElementById('task_input').addEventListener('keypress', (event) => checkInputComplete(event));

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

