const express = require('express');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Serve static files (web interface) from the public folder
app.use(express.static('public'));

// Replace with your actual Dropbox access token
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch: fetch });

// Folder containing files to back up
const localDirectory = path.join(__dirname, 'files');

// **Backup Endpoint:** Loops through each file in the local folder and uploads it to Dropbox.
app.get('/backup', async (req, res) => {
  try {
    const files = fs.readdirSync(localDirectory);
    for (const file of files) {
      const filePath = path.join(localDirectory, file);
      // Only process if it is a file
      if (fs.lstatSync(filePath).isFile()) {
        const contents = fs.readFileSync(filePath);
        const dropboxPath = `/backup/${file}`;
        await dbx.filesUpload({
          path: dropboxPath,
          contents: contents,
          mode: { '.tag': 'overwrite' },
        });
        console.log(`Uploaded ${file} to Dropbox`);
      }
    }
    res.send('Backup completed successfully.');
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).send('Error during backup');
  }
});

// **Recovery Endpoint:** Downloads a specified file from Dropbox based on a query parameter.
app.get('/recover', async (req, res) => {
  const fileName = req.query.file;
  if (!fileName) {
    return res
      .status(400)
      .send('Please provide a file name as a query parameter: ?file=filename');
  }
  try {
    const dropboxPath = `/backup/${fileName}`;
    const response = await dbx.filesDownload({ path: dropboxPath });

    // Ensure the recovered folder exists
    const recoveredDir = path.join(__dirname, 'recovered');
    if (!fs.existsSync(recoveredDir)) {
      fs.mkdirSync(recoveredDir);
    }

    const localPath = path.join(recoveredDir, fileName);
    fs.writeFileSync(localPath, response.result.fileBinary, 'binary');
    console.log(`Recovered ${fileName} to ${localPath}`);
    res.send(`File ${fileName} recovered successfully.`);
  } catch (error) {
    console.error('Recovery error:', error);
    res.status(500).send('Error during recovery');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
