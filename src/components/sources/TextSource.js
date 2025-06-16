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
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { toast } from 'react-hot-toast';
import MenuBar from './MenuBar';
import axiosClient from '../../api/axiosClient';
import { Close as CloseIcon, TextFields as TextIcon } from '@mui/icons-material';

const TextSource = ({ botId }) => {
  const [textTitle, setTextTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTexts, setIsLoadingTexts] = useState(false);
  const [textSources, setTextSources] = useState([]);
  const [deletingTextId, setDeletingTextId] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  const fetchTextSources = useCallback(async () => {
    if (!botId) return;

    try {
      setIsLoading(true);
      const response = await axiosClient.get(`/vectors/getDocumentsList/${botId}?documentType=T`);
      setTextSources(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch text sources');
      console.error('Error fetching text sources:', error);
    } finally {
      setIsLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    if (botId) {
      fetchTextSources();
    }
  }, [botId, fetchTextSources]);

  const handleAddText = async () => {
    if (!textTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!editor?.getText().trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosClient.post('/vectors/upload', {
        botId,
        documentType: 'T',
        title: textTitle,
        content: editor.getHTML()
      });

      if (response.status === 200) {
        toast.success('Text snippet added successfully');
        setTextTitle('');
        editor.commands.setContent('');
        fetchTextSources(); // Refresh the list
      } else {
        throw new Error('Failed to add text snippet');
      }
    } catch (error) {
      console.error('Error adding text snippet:', error);
      toast.error('Failed to add text snippet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteText = async (textId) => {
    setDeletingTextId(textId);
    try {
      const response = await axiosClient.post('/vectors/removeVectors', {
        documentId: textId,
        botId
      });

      if (response.status === 200) {
        toast.success('Text snippet deleted successfully');
        await fetchTextSources(); // Refresh the list
      } else {
        throw new Error('Failed to delete text snippet');
      }
    } catch (error) {
      console.error('Error deleting text snippet:', error);
      toast.error('Failed to delete text snippet');
    } finally {
      setDeletingTextId(null);
    }
  };

  const renderTextItem = (text) => (
    <Box
      key={text._id}
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
      <TextIcon sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {text.filename}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(text.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
      {deletingTextId === text._id ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton
          size="small"
          onClick={() => handleDeleteText(text._id)}
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
          Text
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add and process plain text-based sources to train your AI Agent with precise information.{' '}
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

      {/* Title Input */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel
          htmlFor="text-title"
          sx={{
            fontSize: '0.875rem',
            color: 'text.primary',
            transform: 'none',
            position: 'relative',
            mb: 1
          }}
        >
          Title
        </InputLabel>
        <TextField
          id="text-title"
          value={textTitle}
          onChange={(e) => setTextTitle(e.target.value)}
          placeholder="Ex: Refund requests"
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            }
          }}
        />
      </FormControl>

      {/* Text Editor Section */}
      <Box sx={{ mb: 3 }}>
        <InputLabel
          sx={{
            fontSize: '0.875rem',
            color: 'text.primary',
            mb: 1
          }}
        >
          Text
        </InputLabel>

        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
            '.tiptap-editor': {
              minHeight: '300px',
              p: 2,
              '&:focus': {
                outline: 'none',
              },
              '& p': {
                my: 1,
              },
              '& ul, & ol': {
                my: 1,
                pl: 3,
              },
            },
          }}
        >
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {/* Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleAddText}
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
          {isLoading ? <CircularProgress size={24} /> : 'Add text snippet'}
        </Button>
      </Box>

      {/* Text Sources List */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
          Added Text Sources
        </Typography>

        {isLoadingTexts ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : textSources.length > 0 ? (
          textSources.map(renderTextItem)
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
              No text sources added yet
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TextSource; 