import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fs from 'fs';
import path from 'path';
import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// IMPORTANT: Define your API endpoints before serving static files
// Mount all API endpoints under the "/api" prefix

// Replace with your actual Dropbox access token (loaded from .env)
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch: fetch });

// Folder containing files to back up
const localDirectory = path.join(__dirname, 'files');

// **Backup Endpoint:** Loops through each file in the local folder and uploads it to Dropbox.
app.get('/api/backup', async (req, res) => {
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
app.get('/api/recover', async (req, res) => {
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

// **List Endpoint:** Lists files in the Dropbox /backup folder.
app.get('/api/list', async (req, res) => {
  try {
    const response = await dbx.filesListFolder({ path: '/backup' });
    const files = response.result.entries.map((entry) => entry.name);
    res.json(files);
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ error: 'Error listing files.' });
  }
});

app.get('/api/local', async (req, res) => {
  try {
    const localFiles = fs
      .readdirSync(localDirectory)
      .filter((file) => fs.lstatSync(path.join(localDirectory, file)).isFile());
    res.json(localFiles);
  } catch (error) {
    console.error('Local file list error:', error);
    res.status(500).json({ error: 'Error listing local files.' });
  }
});

app.get('/api/backup-file', async (req, res) => {
  const fileName = req.query.file;
  if (!fileName) {
    return res.status(400).send('Please provide a file name.');
  }
  try {
    const filePath = path.join(localDirectory, fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found.');
    }
    if (!fs.lstatSync(filePath).isFile()) {
      return res.status(400).send('Not a valid file.');
    }
    const contents = fs.readFileSync(filePath);
    const dropboxPath = `/backup/${fileName}`;
    await dbx.filesUpload({
      path: dropboxPath,
      contents: contents,
      mode: { '.tag': 'overwrite' },
    });
    res.send(`File ${fileName} backed up successfully.`);
  } catch (error) {
    console.error('Backup file error:', error);
    res.status(500).send('Error backing up file.');
  }
});

// Now serve static files (your web interface) from the "public" folder
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
