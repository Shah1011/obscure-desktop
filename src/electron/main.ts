import {app, BrowserWindow} from 'electron';
import { isDev } from './util.js';
import path from 'path';
import { ipcMain } from 'electron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type test = string;

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Adjust path as needed
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (isDev()){
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
});

ipcMain.handle('upload-to-s3', async (event, filePath, credentials) => {
  // Here you’ll use the AWS SDK to upload the file
  // For now, just log and return a mock result
  console.log('Uploading:', filePath, credentials);
  return { success: true, message: 'Mock upload complete!' };
});