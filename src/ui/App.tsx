import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#18191A',
      paper: '#242526',
    },
  },
});

const centralizedProviders = [
  { id: 'aws', name: 'AWS S3', icon: <CloudQueueIcon /> },
  { id: 'gcs', name: 'Google Cloud', icon: <CloudIcon /> },
  { id: 'b2', name: 'Backblaze B2', icon: <CloudIcon /> },
  { id: 'e2', name: 'IDrive E2', icon: <CloudIcon /> },
  { id: 's3-comp', name: 'S3-Compatible Buckets', icon: <CloudIcon /> },
];

const decentralizedProviders = [
  { id: 'ipfs', name: 'IPFS + Filebase', icon: <CloudIcon /> },
  { id: 'storj', name: 'Storj', icon: <CloudIcon /> },
];

const allProviders = [...centralizedProviders, ...decentralizedProviders];

declare global {
  interface Window {
    electronAPI: {
      uploadToS3: (filePath: string, credentials: any) => Promise<any>;
    };
  }
}

function App() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(centralizedProviders[0].id);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handlePickFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      setFilePath(file.path);
    };
    input.click();
  };

  const handleUpload = async () => {
    if (!filePath) return;
    setStatus('Uploading...');
    // Replace with real credentials
    const credentials = { accessKeyId: '...', secretAccessKey: '...' };
    const result = await window.electronAPI.uploadToS3(filePath, credentials);
    setStatus(result.message);
  };

  const getProviderById = (id: string | null) => allProviders.find((p) => p.id === id);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'background.default' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 220,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', bgcolor: 'background.paper' },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" noWrap>
              Obscure Backup
            </Typography>
          </Box>
          <List
            subheader={
              <Typography variant="subtitle2" sx={{ pl: 2, pt: 1 }}>
                Centralized
              </Typography>
            }
          >
            {centralizedProviders.map((provider) => (
              <ListItem key={provider.id} disablePadding>
                <ListItemButton
                  selected={selectedProvider === provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <ListItemIcon>{provider.icon}</ListItemIcon>
                  <ListItemText
                    primary={provider.name}
                    slotProps={{ primary: { sx: { fontSize: '0.9rem' } } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List
            subheader={
              <Typography variant="subtitle2" sx={{ pl: 2, pt: 1 }}>
                Decentralized
              </Typography>
            }
          >
            {decentralizedProviders.map((provider) => (
              <ListItem key={provider.id} disablePadding>
                <ListItemButton
                  selected={selectedProvider === provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <ListItemIcon>{provider.icon}</ListItemIcon>
                  <ListItemText
                    primary={provider.name}
                    slotProps={{ primary: { sx: { fontSize: '0.9rem' } } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: 'background.default' }}>
          {selectedProvider ? (
            <>
              <Typography variant="h5" gutterBottom>
                {getProviderById(selectedProvider)?.name} Backups
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  mb: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 200,
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <UploadFileIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                <Typography variant="body1" gutterBottom>
                  Select a file or drag and drop to upload
                </Typography>
                <Button variant="contained" onClick={handlePickFile} sx={{ mt: 2 }}>
                  Pick File
                </Button>
                {filePath && <Typography sx={{ mt: 2 }}>Selected: {filePath}</Typography>}
                <Button
                  variant="outlined"
                  onClick={handleUpload}
                  disabled={!filePath}
                  sx={{ mt: 2 }}
                >
                  Upload to {getProviderById(selectedProvider)?.name}
                </Button>
                <Typography sx={{ mt: 2 }}>{status}</Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1">Backups</Typography>
                <Typography variant="body2" color="text.secondary">
                  (Backup list will appear here)
                </Typography>
              </Paper>
            </>
          ) : (
            <Typography variant="h6">Select a cloud provider to get started.</Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
