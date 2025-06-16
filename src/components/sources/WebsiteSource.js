import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import { Close as CloseIcon, Language as WebsiteIcon } from '@mui/icons-material';

const WebsiteSource = ({ botId }) => {
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(false);
  const [websiteSources, setWebsiteSources] = useState([]);
  const [deletingWebsiteId, setDeletingWebsiteId] = useState(null);

  const fetchWebsiteSources = useCallback(async () => {
    if (!botId) return;

    try {
      setIsLoading(true);
      const response = await axiosClient.get(`/vectors/getDocumentsList/${botId}?documentType=W`);
      setWebsiteSources(response.data.data || []);
    } catch (error) {
      console.error('Error fetching website sources:', error);
      toast.error('Failed to fetch website sources');
    } finally {
      setIsLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    if (botId) {
      fetchWebsiteSources();
    }
  }, [botId, fetchWebsiteSources]);

  const handleAddWebsite = async () => {
    if (!textTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!textContent.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    // Add URL validation
    try {
      new URL(textContent);
    } catch (e) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosClient.post('/vectors/upload', {
        botId,
        documentType: 'W',
        url: textContent
      });

      if (response.status === 200) {
        toast.success('Website added successfully');
        setTextTitle('');
        setTextContent('');
        fetchWebsiteSources(); // Refresh the list
      } else {
        throw new Error('Failed to add website');
      }
    } catch (error) {
      console.error('Error adding website:', error);
      toast.error('Failed to add website');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWebsite = async (websiteId) => {
    setDeletingWebsiteId(websiteId);
    try {
      const response = await axiosClient.post('/vectors/removeVectors', {
        documentId: websiteId,
        botId
      });

      if (response.status === 200) {
        toast.success('Website deleted successfully');
        await fetchWebsiteSources(); // Refresh the list
      } else {
        throw new Error('Failed to delete website');
      }
    } catch (error) {
      console.error('Error deleting website:', error);
      toast.error('Failed to delete website');
    } finally {
      setDeletingWebsiteId(null);
    }
  };

  const renderWebsiteItem = (website) => (
    <Box
      key={website._id}
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
      <WebsiteIcon sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {website.filename}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {website.website}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(website.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
      {deletingWebsiteId === website._id ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton
          size="small"
          onClick={() => handleDeleteWebsite(website._id)}
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
          Website
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Train your AI agent with website content.{' '}
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

      {/* URL Input Form */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel
            htmlFor="website-url"
            sx={{
              fontSize: '0.875rem',
              color: 'text.primary',
              transform: 'none',
              position: 'relative',
              mb: 1
            }}
          >
            Website URL
          </InputLabel>
          <TextField
            id="website-url"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="https://example.com"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              }
            }}
          />
        </FormControl>
      </Box>

      {/* Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleAddWebsite}
          disabled={isLoading}
          sx={{
            bgcolor: 'grey.800',
            color: 'common.white',
            '&:hover': {
              bgcolor: 'grey.900',
            },
            textTransform: 'none',
            px: 3,
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Add website'}
        </Button>
      </Box>

      {/* Websites List */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
          Added Websites
        </Typography>

        {isLoadingWebsites ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : websiteSources.length > 0 ? (
          websiteSources.map(renderWebsiteItem)
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No websites added yet
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WebsiteSource; 