# Backup & Recovery System

A simple web-based system to backup and recover files using Node.js, Express, and Dropbox API.

## Features

- **Backup Files** - Upload files to Dropbox.
- **Recover Files** - Restore files from Dropbox.
- **View Backups** - See a list of backed-up files.
- **View Local Files** - Check available local files before backup.

## Setup Instructions

### Prerequisites

- Install [Node.js](https://nodejs.org/)
- Get a **Dropbox Access Token** by creating a Dropbox app ([Guide](https://www.dropbox.com/developers/apps))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the project root and add:

   ```env
   ACCESS_TOKEN=your_dropbox_access_token_here
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Folder Structure

```
project-folder/
├── files/          # Local files to be backed up
├── recovered/      # Recovered files
├── public/
│   ├── index.html  # Main UI
│   ├── styles.css  # Styling
│   └── main.js     # Frontend logic
├── server.js       # Backend API
└── .env            # Environment variables
```

## Usage

1. **Backup Files** - Click "Backup All Files" or select specific files to backup.
2. **Recover Files** - Enter a file name and click "Recover File".
3. **Refresh Lists** - Update both the backup and local file lists using the refresh buttons.

## API Endpoints

- `GET /api/backup` - Backup all files to Dropbox.
- `GET /api/backup-file?file=<filename>` - Backup a specific file.
- `GET /api/recover?file=<filename>` - Recover a file from Dropbox.
- `GET /api/list` - List all backed-up files.
- `GET /api/local` - List all local files.

## Notes

- The **local folder** (`files/`) should contain the files you want to backup.
- Recovered files are stored in the **recovered/** folder.

## License

This project is free to use and modify.

---
