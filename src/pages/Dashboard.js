import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  IconButton,
  Modal,
  Box,
  TextField,
  CircularProgress,
  Container,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import DashboardLayout from '../layouts/DashboardLayout';
import backendRoute from '../api/routeList';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Dashboard = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [botName, setBotName] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchBots = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(backendRoute.CHATBOT_LIST);
      // const botNames = [{name: 'ChatBot 1'}, {name: 'ChatBot 2'}, {name: 'ChatBot 3'}]
      // console.log(response);
      console.log(response.data.data);
      
      setBots(response.data.data);
      // setBots(botNames);
    } catch (error) {
      toast.error('Failed to fetch bots');
    } finally {
      setLoading(false);
      // const botNames = [{name: 'ChatBot 1'}, {name: 'ChatBot 2'}, {name: 'ChatBot 3'}]
      // setBots(response.data);
      // setBots(botNames);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleCreateBot = async () => {
    try {
      setLoading(true);
      await axiosClient.post(backendRoute.CREATE_CHATBOT, { name: botName });
      toast.success('Bot created successfully');
      fetchBots();
      setModalOpen(false);
      setBotName('');
    } catch (error) {
      toast.error('Failed to create bot');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBot = async () => {
    try {
      setLoading(true);
      await axiosClient.post(backendRoute.UPDATE_CHATBOT, {
        id: selectedBot._id,
        name: botName,
      });
      toast.success('Bot updated successfully');
      fetchBots();
      setEditModalOpen(false);
      setSelectedBot(null);
      setBotName('');
    } catch (error) {
      toast.error('Failed to update bot');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBot = async (id) => {
    setBotToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBot = async () => {
    try {
      setLoading(true);
      await axiosClient.post(backendRoute.DELETE_CHATBOT + botToDelete);
      toast.success('Bot deleted successfully');
      fetchBots();
    } catch (error) {
      toast.error('Failed to delete bot');
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setBotToDelete(null);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(backendRoute.GET_CHATBOT_BY_ID + id);
      setSelectedBot(response.data.data);
      setDetailsModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch bot details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        {/* Create Bot Button */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'flex-end'
        }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              borderWidth: 2.5,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: (theme) => theme.shadows[4],
                borderWidth: 2.5,
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            New Bot
          </Button>
        </Box>

        {/* Bot List */}
        <Box>
          {
          bots?.map((bot) => (
            <Card
              key={bot._id}
              sx={{
                mb: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4],
                  cursor: 'pointer',
                },
              }}
              onClick={(e) => {
                if (e.target.closest('button')) {
                  return;
                }
                navigate(`/dashboard/${bot._id}/preview`);
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BotIcon 
                    sx={{ 
                      fontSize: 40, 
                      mr: 2,
                      color: (theme) => theme.palette.primary.main 
                    }} 
                  />
                  <Box>
                    <Typography variant="h6" component="div">
                      {bot.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      Created: {moment(bot.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit Bot">
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBot(bot);
                        setBotName(bot.name);
                        setEditModalOpen(true);
                      }}
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: (theme) => theme.palette.primary.lighter,
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBot(bot._id);
                    }}
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.primary.lighter,
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}

          {bots.length === 0 && !loading && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                backgroundColor: (theme) => theme.palette.grey[50],
                borderRadius: 2
              }}
            >
              <BotIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No bots created yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the "Create New Bot" button to get started
              </Typography>
            </Box>
          )}
        </Box>

        {/* Create Bot Modal */}
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setBotName('');
          }}
        >
          <Box sx={modalStyle}>
            <Typography variant="h5" gutterBottom color="primary">
              Create New Bot
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TextField
              fullWidth
              label="Bot Name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
              autoFocus
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                onClick={() => {
                  setModalOpen(false);
                  setBotName('');
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCreateBot}
                disabled={!botName.trim() || loading}
              >
                Create Bot
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Edit Bot Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedBot(null);
            setBotName('');
          }}
        >
          <Box sx={modalStyle}>
            <Typography variant="h5" gutterBottom color="primary">
              Edit Bot
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TextField
              fullWidth
              label="Bot Name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
              autoFocus
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedBot(null);
                  setBotName('');
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleUpdateBot}
                disabled={!botName.trim() || loading}
              >
                Update Bot
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* View Details Modal */}
        <Modal
          open={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedBot(null);
          }}
        >
          <Box sx={modalStyle}>
            <Typography variant="h5" gutterBottom color="primary">
              Bot Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {selectedBot && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bot Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedBot.name}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {moment(selectedBot.createdAt).fromNow()}
                  </Typography>
                </Box>
                {/* Add more bot details here */}
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained"
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedBot(null);
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setBotToDelete(null);
          }}
        >
          <Box sx={modalStyle}>
            <Typography variant="h5" gutterBottom color="error">
              Delete Bot
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" sx={{ mb: 3 }}>
              Are you sure you want to delete this bot? This action cannot be undone.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBotToDelete(null);
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={confirmDeleteBot}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Delete Bot'}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard; 