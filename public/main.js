// Backup action: calls the /api/backup endpoint when the button is clicked
document.getElementById('backupBtn').addEventListener('click', async () => {
  document.getElementById('backupStatus').textContent = 'Starting backup...';
  try {
    const response = await fetch('/api/backup');
    const text = await response.text();
    document.getElementById('backupStatus').textContent = text;
  } catch (error) {
    document.getElementById('backupStatus').textContent = 'Error: ' + error;
  }
});

// Recovery action for manual input
document.getElementById('recoverBtn').addEventListener('click', async () => {
  const fileName = document.getElementById('recoverFileName').value;
  if (!fileName) {
    document.getElementById('recoverStatus').textContent =
      'Please enter a file name.';
    return;
  }
  document.getElementById('recoverStatus').textContent = 'Starting recovery...';
  try {
    const response = await fetch(
      '/api/recover?file=' + encodeURIComponent(fileName)
    );
    const text = await response.text();
    document.getElementById('recoverStatus').textContent = text;
  } catch (error) {
    document.getElementById('recoverStatus').textContent = 'Error: ' + error;
  }
});

// List backed-up files and display them
document.getElementById('listBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/list');
    const files = await response.json();
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = ''; // Clear existing list

    files.forEach((file) => {
      const li = document.createElement('li');
      li.textContent = file;

      // Add a recover button for each file
      const recoverBtn = document.createElement('button');
      recoverBtn.textContent = 'Recover';
      recoverBtn.style.marginLeft = '10px';
      recoverBtn.addEventListener('click', async () => {
        try {
          const res = await fetch(
            '/api/recover?file=' + encodeURIComponent(file)
          );
          const text = await res.text();
          alert(text);
        } catch (err) {
          alert('Error: ' + err);
        }
      });

      li.appendChild(recoverBtn);
      filesList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching file list: ', error);
    alert('Error listing files.');
  }
});
