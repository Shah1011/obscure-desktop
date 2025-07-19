import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  uploadToS3: (filePath: string, credentials: any) =>
    ipcRenderer.invoke('upload-to-s3', filePath, credentials),
});