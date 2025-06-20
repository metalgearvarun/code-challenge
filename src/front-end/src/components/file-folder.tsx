import React, { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const FolderFileList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [folderError, setFolderError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const token = 'asd';

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setSelectedFolderId(null);
      setFiles([]);
      setFolderError(null);

      const endpoint = isLoggedIn ? 'private-folders' : 'public-folders';
      const url = `${API_BASE_URL}/${endpoint}`;
      const config: AxiosRequestConfig = {
        headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {}
      };

      try {
        const response = await axios.get<Folder[]>(url, config);
        setFolders(response.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch folders';
        setFolderError(message);
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
    setFileError(null);

    const prefix = isLoggedIn ? 'private-folders' : 'public-folders';
    const url = `${API_BASE_URL}/${prefix}/${folderId}/files`;
    const config: AxiosRequestConfig = {
      headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {}
    };

    try {
      const response = await axios.get<File[]>(url, config);
      setFiles(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch files';
      setFileError(message);
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  const fileTypes = ['all', 'document', 'image', 'video', 'audio'];
  const displayedFiles = filterType !== 'all'
    ? files.filter(file => file.type === filterType)
    : files;

  return (
    <Box p={2}>
      {/* Global controls */}
      <Box mb={2} display="flex" gap={1}>
        <Button variant="contained" onClick={() => setIsLoggedIn(prev => !prev)}>
          {isLoggedIn ? 'LogOut' : 'LogIn'}
        </Button>
        {/* Filter buttons always visible */}
        {fileTypes.map(type => (
          <Button
            key={type}
            size="small"
            variant={filterType === type ? 'contained' : 'outlined'}
            onClick={() => setFilterType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </Box>

      {loading ? (
        <Typography>Loading folders...</Typography>
      ) : folderError ? (
        <Typography color="error">{folderError}</Typography>
      ) : (
        <List>
          {folders.map(folder => (
            <React.Fragment key={folder.id}>
              <ListItem button onClick={() => handleFolderClick(folder.id)}>
                <ListItemText primary={folder.name} />
                <ListItemSecondaryAction>
                  <Typography variant="body2" color="textSecondary">
                    {/* optional date */}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>

              {selectedFolderId === folder.id && (
                <Box>
                  {fileError ? (
                    <Typography color="error" sx={{ pl: 4 }}>{fileError}</Typography>
                  ) : filesLoading ? (
                    <List component="div" disablePadding>
                      <ListItem>
                        <ListItemText primary="Loading files..." />
                      </ListItem>
                    </List>
                  ) : (
                    <List component="div" disablePadding>
                      {displayedFiles.map((file, idx) => (
                        <ListItem key={idx} sx={{ pl: 4 }}>
                          <ListItemText
                            primary={file.name}
                            secondary={file.type}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
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
