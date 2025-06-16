import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';

const FilesSource = ({ botId }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deletingDocId, setDeletingDocId] = useState(null);

  const fetchUploadedFiles = useCallback(async () => {
    if (!botId) return;

    try {
      setIsLoading(true);
      const response = await axiosClient.get(`/vectors/getDocumentsList/${botId}?documentType=D`);
      setFiles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    if (botId) {
      fetchUploadedFiles();
    }
  }, [botId, fetchUploadedFiles]);

  const handleFileUpload = useCallback(async (acceptedFiles) => {
    if (!botId) return;

    const supportedFiles = acceptedFiles.filter(file => {
      const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      return validTypes.includes(fileExtension);
    });

    if (supportedFiles.length !== acceptedFiles.length) {
      toast.error('Some files were not supported and were removed');
    }

    for (const file of supportedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('botId', botId);
      formData.append('documentType', 'D');

      try {
        await axiosClient.post('/vectors/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success(`Successfully uploaded ${file.name}`);
        fetchUploadedFiles();
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, [botId, fetchUploadedFiles]);

  const handleDeleteFile = useCallback(async (fileName) => {
    if (!botId) return;

    try {
      await axiosClient.post('/vectors/removeVectors', {
        fileName,
        botId
      });
      toast.success('File deleted successfully');
      fetchUploadedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  }, [botId, fetchUploadedFiles]);

  const onDrop = useCallback((acceptedFiles) => {
    handleFileUpload(acceptedFiles);
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const renderFileItem = (file) => (
    <Box
      key={file._id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <FileIcon sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {file.filename}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(file.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
      {deletingDocId === file._id ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton
          size="small"
          onClick={() => {
            setSelectedDocument(file);
            setDeleteDialogOpen(true);
          }}
          sx={{
            ml: 1,
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main',
              bgcolor: 'error.lighter',
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Files
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload and manage documents to train your AI agent.{' '}
          <Typography
            component="span"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Learn more
          </Typography>
        </Typography>
      </Box>

      {/* Upload Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 3,
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Supported formats: PDF, DOC, DOCX, TXT
        </Typography>
      </Box>

      {/* Files List */}
      <List>
        {isLoading ? (
          <ListItem>
            <ListItemText
              primary={<CircularProgress size={24} />}
              primaryTypographyProps={{
                sx: { textAlign: 'center' }
              }}
            />
          </ListItem>
        ) : files.length > 0 ? (
          files.map(renderFileItem)
        ) : (
          <ListItem>
            <ListItemText
              primary="No files uploaded yet"
              primaryTypographyProps={{
                sx: { textAlign: 'center' }
              }}
            />
          </ListItem>
        )}
      </List>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          mt: 2,
          fontStyle: 'italic'
        }}
      >
        Note: For PDFs, ensure text selection/highlighting is possible.
      </Typography>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedDocument(null);
        }}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: 400 },
            p: 3,
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ p: 0, mb: 2 }}>
          <Typography variant="h5" color="error">
            Delete Document
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0, my: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 0, gap: 2 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedDocument(null);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteFile(selectedDocument.filename)}
            disabled={!!deletingDocId}
          >
            {deletingDocId ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilesSource; 