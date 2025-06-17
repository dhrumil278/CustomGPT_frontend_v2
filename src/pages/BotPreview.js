import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Source as SourceIcon,
  Preview as PreviewIcon,
  Description as FileIcon,
  TextFields as TextIcon,
  Language as WebsiteIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import DashboardLayout from '../layouts/DashboardLayout';
import { styled } from '@mui/material/styles';
import ChatPreview from '../components/ChatPreview';
import FilesSource from '../components/sources/FilesSource';
import TextSource from '../components/sources/TextSource';
import WebsiteSource from '../components/sources/WebsiteSource';

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 56,
  padding: '12px 24px',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '16px',
  color: theme.palette.text.secondary,
  '& .MuiTab-iconWrapper': {
    marginRight: 0,
    marginBottom: 0,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: 24,
    color: theme.palette.text.secondary,
  },
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  transition: 'all 0.2s ease-in-out',
}));

const CodeBlock = ({ children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'grey.100',
      borderRadius: 1,
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      whiteSpace: 'pre-wrap',
      mb: 2,
    }}
  >
    {children}
  </Paper>
);

const BotPreview = () => {
  const theme = useTheme();
  const { botId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [activeSource, setActiveSource] = useState(0);

  const renderSourceContent = () => {
    switch (activeSource) {
      case 0:
        return <FilesSource botId={botId} />;
      case 1:
        return <TextSource botId={botId} />;
      case 2:
        return <WebsiteSource botId={botId} />;
      default:
        return null;
    }
  };

  const renderDocumentation = () => (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Integration Guide
      </Typography>

      <Typography variant="body1" paragraph>
        Integrate your AI bot seamlessly into your website or application using
        our simple REST API. This guide will walk you through the process of
        setting up and using the API.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Key Features
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Secure API Key Authentication"
              secondary="Each bot has a unique API key for secure access"
            />
          </ListItem>
          {/* <ListItem>
            <ListItemIcon>
              <SpeedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Real-time Responses"
              secondary="Get instant, context-aware responses to user queries"
            />
          </ListItem> */}
          <ListItem>
            <ListItemIcon>
              <StorageIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Context Management"
              secondary="Maintain conversation history for more natural interactions"
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Integration Steps
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="1. Get Your API Key"
              secondary="Find your unique API key in the bot settings"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="2. Set Up API Endpoint"
              secondary={`Use the endpoint: ${
                process.env.REACT_APP_API_BASE_URL
                  ? process.env.REACT_APP_API_BASE_URL
                  : 'http://localhost:8080'
              }/qa/askquestion`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="3. Make API Calls"
              secondary="Send POST requests with the required parameters"
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          API Request Format
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Endpoint
        </Typography>
        <CodeBlock>
          {`POST ${
            process.env.REACT_APP_API_BASE_URL
              ? process.env.REACT_APP_API_BASE_URL
              : 'http://localhost:8080'
          }/qa/askquestion`}
        </CodeBlock>

        <Typography variant="subtitle2" gutterBottom>
          Headers
        </Typography>
        <CodeBlock>
          {`Content-Type: application/json
apiKey: your_api_key_here`}
        </CodeBlock>

        <Typography variant="subtitle2" gutterBottom>
          Request Body
        </Typography>
        <CodeBlock>
          {`{
              "botId": "your_bot_id",
              "chatHistory": [
                {
                  "role": "user",
                  "content": "Previous user message"
                },
                {
                  "role": "assistant",
                  "content": "Previous bot response"
                }
              ],
              "question": "User's current question"
            }`}
        </CodeBlock>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Example Implementation
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          JavaScript/TypeScript
        </Typography>
        <CodeBlock>
          {`async function askBot(question, chatHistory = []) {
  const response = await fetch('${
    process.env.REACT_APP_API_BASE_URL
      ? process.env.REACT_APP_API_BASE_URL
      : 'http://localhost:8080'
  }/qa/askquestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': 'your_api_key_here'
    },
    body: JSON.stringify({
      botId: 'your_bot_id',
      chatHistory,
      question
    })
  });
  
  return await response.json();
}`}
        </CodeBlock>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Best Practices
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Keep API Key Secure"
              secondary="Never expose your API key in client-side code. Use environment variables or backend proxy."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Manage Chat History"
              secondary="Maintain a reasonable chat history length to optimize performance"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Error Handling"
              secondary="Implement proper error handling for API failures and rate limits"
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Benefits of Direct Integration
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Full Control"
              secondary="Complete control over the UI/UX of your chat interface"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Customization"
              secondary="Ability to customize the chat experience to match your brand"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Scalability"
              secondary="Easily scale the integration as your needs grow"
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              px: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 48,
                px: 2,
              },
            }}
          >
            <Tab icon={<SourceIcon />} label="Sources" iconPosition="start" />
            <Tab icon={<PreviewIcon />} label="Preview" iconPosition="start" />
            <Tab
              icon={<CodeIcon />}
              label="Documentation"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box
          sx={{
            flex: 1,
            mt: 2,
            display: 'flex',
          }}
        >
          {activeTab === 0 && (
            <>
              <Box
                sx={{
                  width: 280,
                  borderRight: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  '& .MuiTabs-indicator': {
                    left: 0,
                    width: 3,
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              >
                <Tabs
                  orientation="vertical"
                  value={activeSource}
                  onChange={(e, newValue) => setActiveSource(newValue)}
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: '2px',
                    },
                    '& .MuiTabs-indicator': {
                      left: 0,
                      width: 3,
                    },
                  }}
                >
                  <StyledTab
                    icon={<FileIcon />}
                    label="Files"
                    iconPosition="start"
                  />
                  <StyledTab
                    icon={<TextIcon />}
                    label="Text"
                    iconPosition="start"
                  />
                  <StyledTab
                    icon={<WebsiteIcon />}
                    label="Website"
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: 'background.paper',
                  overflow: 'auto',
                  p: 4,
                }}
              >
                {renderSourceContent()}
              </Box>
            </>
          )}

          {activeTab === 1 && (
            <Box
              sx={{
                p: 3,
                width: '100%',
                height: '100%',
                bgcolor: '#F8F9FA',
              }}
            >
              <ChatPreview />
            </Box>
          )}

          {activeTab === 2 && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'background.paper',
                overflow: 'auto',
              }}
            >
              {renderDocumentation()}
            </Box>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default BotPreview;
