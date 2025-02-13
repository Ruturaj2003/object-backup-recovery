// Backup All Files: calls the /api/backup endpoint to backup every file
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

// Recover File: uses the file name entered to recover a file from Dropbox
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

// List Backed-Up Files (from Dropbox)
document.getElementById('listBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/list');
    const files = await response.json();
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = ''; // Clear existing list

    files.forEach((file) => {
      const li = document.createElement('li');
      li.textContent = file;

      // Add a recover button for each file in the Dropbox backup list
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
    console.error('Error fetching backup list: ', error);
    alert('Error listing backed-up files.');
  }
});

// List Local Files (from the local "files" folder)
document.getElementById('localListBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/local');
    const localFiles = await response.json();
    const localFilesList = document.getElementById('localFilesList');
    localFilesList.innerHTML = ''; // Clear existing list

    localFiles.forEach((file) => {
      const li = document.createElement('li');
      li.textContent = file;

      // Add a backup button for each local file
      const backupFileBtn = document.createElement('button');
      backupFileBtn.textContent = 'Backup';
      backupFileBtn.style.marginLeft = '10px';
      backupFileBtn.addEventListener('click', async () => {
        try {
          const res = await fetch(
            '/api/backup-file?file=' + encodeURIComponent(file)
          );
          const text = await res.text();
          alert(text);
        } catch (err) {
          alert('Error: ' + err);
        }
      });

      li.appendChild(backupFileBtn);
      localFilesList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching local files: ', error);
    alert('Error listing local files.');
  }
});
