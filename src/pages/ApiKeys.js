import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';
import axiosClient from '../api/axiosClient';
import { backendRoute } from '../api/routeList';

const ApiKeys = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [newlyGeneratedKey, setNewlyGeneratedKey] = useState('');

    console.log(apiKeys);

    const fetchApiKeys = async () => {
        try {
            const response = await axiosClient.get(backendRoute.LIST_API_KEYS);
            setApiKeys(response.data.data.apikeys);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to fetch API keys',
                severity: 'error',
            });
        }
    };

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const handleGenerateKey = async () => {
        try {
            const response = await axiosClient.post(backendRoute.GENERATE_API_KEY, {
                name: newKeyName,
            });
            setNewlyGeneratedKey(response.data.apiKey);
            setSnackbar({
                open: true,
                message: 'API key generated successfully',
                severity: 'success',
            });
            setOpenDialog(false);
            setNewKeyName('');
            fetchApiKeys();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to generate API key',
                severity: 'error',
            });
        }
    };

    const handleDeleteKey = async (apiKeyId) => {
        try {
            await axiosClient.post(`${backendRoute.DELETE_API_KEY}${apiKeyId}`);
            setSnackbar({
                open: true,
                message: 'API key deleted successfully',
                severity: 'success',
            });
            fetchApiKeys();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to delete API key',
                severity: 'error',
            });
        }
    };

    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        setSnackbar({
            open: true,
            message: 'API key copied to clipboard',
            severity: 'success',
        });
    };

    const maskApiKey = (key) => {
        if (!key) return '';
        const halfLength = Math.ceil(key.length / 2);
        return `${key.slice(0, halfLength)}${'*'.repeat(key.length - halfLength)}`;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            API Keys Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenDialog(true)}
                        >
                            Generate New Key
                        </Button>
                    </Box>

                    {apiKeys.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8,
                                px: 2,
                                textAlign: 'center',
                            }}
                        >
                            <KeyIcon
                                sx={{
                                    fontSize: 64,
                                    color: 'text.secondary',
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No API Keys Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                                Generate your first API key to start integrating with our services. API keys are used to authenticate your requests.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenDialog(true)}
                            >
                                Generate New Key
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell sx={{ width: '10%' }}>API Key</TableCell>
                                        <TableCell>Created At</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {apiKeys.map((key) => (
                                        <TableRow key={key.id}>
                                            <TableCell>{key.name}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontFamily: 'monospace' }}>
                                                        {maskApiKey(key.apiKey)}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleCopyKey(key.apiKey)}
                                                        title="Copy full API key"
                                                    >
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(key.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteKey(key._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Generate New API Key</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Key Name"
                        fullWidth
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleGenerateKey} variant="contained">
                        Generate
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!newlyGeneratedKey}
                onClose={() => setNewlyGeneratedKey('')}
            >
                <DialogTitle>New API Key Generated</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please copy your API key now. You won't be able to see it again!
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontFamily: 'monospace', flex: 1 }}>
                            {newlyGeneratedKey}
                        </Typography>
                        <IconButton onClick={() => handleCopyKey(newlyGeneratedKey)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewlyGeneratedKey('')}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ApiKeys; 