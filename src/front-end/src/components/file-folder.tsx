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

// Load server URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const FolderFileList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortKey, setSortKey] = useState<keyof File | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [folderError, setFolderError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const token = 'asd';

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setSelectedFolderId(null);
      setFiles([]);
      setFolderError(null);

      // Set the endpoint and use axios to make the request, if accessing a private folder, pass the bearer token
      const endpoint = isLoggedIn ? 'private-folders' : 'public-folders';
      const url = `${API_BASE_URL}/${endpoint}`;
      const config: AxiosRequestConfig = {
        headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {}
      };

      try {
        const response = await axios.get<Folder[]>(url, config);
        setFolders(response.data);
      } catch (err: any) {
        const message = err.message || 'Failed to fetch folders';
        setFolderError(message);
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [isLoggedIn]);

  // Get the files when a folder is selected
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
    } catch (err: any) {
      const message = err.message || 'Failed to fetch files';
      setFileError(message);
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  const fileTypes = ['all', 'document', 'image', 'video', 'audio'];
  const fileProps: (keyof File)[] = ['name', 'created', 'updated', 'type'];

  // Apply filter
  let displayed =
    filterType !== 'all' ? files.filter(f => f.type === filterType) : [...files];
  // Apply sort
  if (sortKey) {
    displayed.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <Box p={2}>
      {/* Global controls */}
      <Box mb={2} display="flex" gap={1} alignItems="center" flexWrap="wrap">
        <Button variant="contained" onClick={() => setIsLoggedIn(prev => !prev)}>
          {isLoggedIn ? 'LogOut' : 'LogIn'}
        </Button>
        {/* Filter option for files*/}
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
        {/* Sort options for files */}
        {fileProps.map(prop => (
          <Button
            key={prop}
            size="small"
            variant={sortKey === prop ? 'contained' : 'outlined'}
            onClick={() => setSortKey(prev => (prev === prop ? null : prop))}
          >
            Sort by {prop.charAt(0).toUpperCase() + prop.slice(1)}
          </Button>
        ))}
        {/* Order toggle */}
        <Button size="small" variant="outlined" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </Button>
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
                      {displayed.map((file, idx) => (
                        <ListItem key={idx} sx={{ pl: 4 }}>
                          <Box>
                            <Typography variant="subtitle1">{file.name}</Typography>
                            <Typography variant="body2">Type: {file.type}</Typography>
                            <Typography variant="body2">Created: {file.created}</Typography>
                            <Typography variant="body2">Updated: {file.updated}</Typography>
                          </Box>
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
