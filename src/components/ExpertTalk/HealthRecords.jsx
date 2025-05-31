// src/components/ExpertTalk/HealthRecords.jsx
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Delete,
  PictureAsPdf,
  Image,
  InsertDriveFile
} from '@mui/icons-material';

const HealthRecords = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).map(file => ({
      id: Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      status: 'uploaded'
    }));
    
    setUploading(true);
    setTimeout(() => {
      setFiles([...files, ...newFiles]);
      setUploading(false);
    }, 1500);
  };

  const handleDelete = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <PictureAsPdf color="error" />;
    if (type.includes('image')) return <Image color="primary" />;
    return <InsertDriveFile color="action" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Health Records
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
        >
          Upload Files
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <List>
        {files.map((file) => (
          <ListItem
            key={file.id}
            sx={{
              mb: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            <ListItemIcon>
              {getFileIcon(file.type)}
            </ListItemIcon>
            <ListItemText
              primary={file.name}
              secondary={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="caption">
                    {formatFileSize(file.size)}
                  </Typography>
                  •
                  <Typography variant="caption">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={file.status}
                    size="small"
                    color={file.status === 'uploaded' ? 'success' : 'default'}
                  />
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleDelete(file.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {files.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <Description sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography>
            No health records uploaded yet
          </Typography>
          <Typography variant="body2">
            Upload your medical records, prescriptions, and test reports
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default HealthRecords;
