import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Container,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const ChatPreview = () => {
  const { botId } = useParams();
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hi! What can I help you with?',
      timestamp: new Date().toLocaleString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isGenerating) return;

    const userMessage = {
      type: 'human',
      content: newMessage,
      timestamp: new Date().toLocaleString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsGenerating(true);

    try {
      // Format chat history for API
      const chatHistory = messages.map(msg => ({
        role: msg.type === 'human' ? 'human' : 'assistant',
        content: msg.content
      }));

      const response = await axiosClient.post('/qa/playground', {
        botId,
        chatHistory,
        question: userMessage.content
      });

      if (response.data && response.data.data) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: response.data.data,
          timestamp: new Date().toLocaleString()
        }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Failed to get response from the agent');
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date().toLocaleString()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const LoadingMessage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        mb: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        mb: 0.5
      }}>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ fontSize: '0.75rem' }}
        >
          Agent • {new Date().toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{
        maxWidth: '70%',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Generating response...
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ height: '100%' }}>
      <Box sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        overflow: 'hidden'
      }}>
        {/* Chat Header */}
        <Box sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">Agent Preview</Typography>
          <IconButton 
            onClick={() => {
              setMessages([{
                type: 'assistant',
                content: 'Hi! What can I help you with?',
                timestamp: new Date().toLocaleString()
              }]);
            }}
            sx={{ color: 'primary.main' }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Chat Messages */}
        <Box sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          bgcolor: '#F8F9FA'
        }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.type === 'human' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 0.5
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {message.type === 'human' ? 'You' : 'Agent'} • {message.timestamp}
                </Typography>
              </Box>
              <Box sx={{
                maxWidth: '70%',
                p: 2,
                bgcolor: message.type === 'human' ? 'primary.main' : 'background.paper',
                color: message.type === 'human' ? 'common.white' : 'text.primary',
                borderRadius: 2,
                boxShadow: 1
              }}>
                <Typography variant="body1">
                  {message.content}
                </Typography>
              </Box>
            </Box>
          ))}
          {isGenerating && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <form onSubmit={handleSendMessage}>
            <Box sx={{ 
              display: 'flex',
              gap: 1
            }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                size="small"
                disabled={isGenerating}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#F8F9FA'
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!newMessage.trim() || isGenerating}
                sx={{
                  minWidth: 'auto',
                  px: 3,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default ChatPreview; 