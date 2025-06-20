import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

// Define TypeScript interface for Folder returned by API
interface Folder {
  id: string;
  name: string;
  created: string;
  updated: string;
}

interface File {
  name: string;
  created: string;
  updated: string;
  type: string;
}

const FolderFileList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const token = "asd"

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setSelectedFolderId(null);
      setFiles([]);

      // Build headers
      const headers: HeadersInit = {};
      if (isLoggedIn) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      try {
        const endpoint = isLoggedIn ? 'private-folders' : 'public-folders';
        const res = await fetch(
          `http://localhost:8000/${endpoint}`,
          { headers }
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = (await res.json()) as Folder[];
        setFolders(data);
      } catch (err) {
        console.error('Failed to fetch folders', err);
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [isLoggedIn]);

  const handleFolderClick = async (folderId: string) => {
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
      setFiles([]);
      return;
    }

    setSelectedFolderId(folderId);
    setFilesLoading(true);

    // Build headers
    const headers: HeadersInit = {};
    if (isLoggedIn) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    try {
      const prefix = isLoggedIn ? 'private-folders' : 'public-folders';
      const res = await fetch(
        `http://localhost:8000/${prefix}/${folderId}/files`,
        { headers }
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = (await res.json()) as File[];
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch files', err);
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Box mb={2}>
        <Button
          variant="contained"
          onClick={() => setIsLoggedIn((prev) => !prev)}
        >
          {isLoggedIn ? 'LogOut' : 'LogIn'}
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading folders...</Typography>
      ) : (
        <List>
          {folders.map((folder) => (
            <React.Fragment key={folder.id}>
              <ListItem button onClick={() => handleFolderClick(folder.id)}>
                <ListItemText
                  primary={folder.name}
                />
                <ListItemSecondaryAction>
                  <Typography variant="body2" color="textSecondary">
                    {/* optional date */}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>

              {selectedFolderId === folder.id && (
                <List component="div" disablePadding>
                  {filesLoading ? (
                    <ListItem>
                      <ListItemText primary="Loading files..." />
                    </ListItem>
                  ) : (
                    files.map((file, idx) => (
                      <ListItem key={idx} sx={{ pl: 4 }}>
                        <ListItemText
                          primary={file.name}
                          secondary={file.type}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FolderFileList;
