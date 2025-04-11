import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Alert, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tabs, Tab, Snackbar, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { uploadYaml } from '../services/api';
import { generatePresentation } from '../services/presentationService';
import type { Presentation, PresentationPage, PresentationContent } from '../services/presentationService';
import PresentationView from '../components/PresentationView';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { presentationSchema } from '../schemas/presentationSchema';
import { defaultPresentation } from '../schemas/defaultPresentation';

const HomePage: React.FC = () => {
  const [editorContent, setEditorContent] = useState<string>(defaultPresentation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isFirstValidation, setIsFirstValidation] = useState<boolean>(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const parsePresentation = (content: string): Presentation | null => {
    try {
      const data = JSON.parse(content) as { presentation: Presentation };
      return data.presentation;
    } catch (error) {
      console.error('Failed to parse presentation:', error);
      return null;
    }
  };

  useEffect(() => {
    const presentation = parsePresentation(editorContent);
    setCurrentPresentation(presentation);
  }, [editorContent]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleCopySchema = () => {
    try {
      const schemaString = JSON.stringify(presentationSchema, null, 2);
      navigator.clipboard.writeText(schemaString);
      setSnackbarMessage('Schema copied to clipboard!');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Failed to copy schema. Please try again.');
      setSnackbarOpen(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorContent(value);
    }
  };

  const validateJson = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      // Basic validation against schema
      if (!parsed.presentation || !parsed.presentation.metadata || !parsed.presentation.pages) {
        throw new Error('Invalid presentation structure');
      }
      return true;
    } catch (error) {
      setError('Invalid JSON format or structure');
      setShowError(true);
      return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEditorContent(content);
      validateJson(content);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('active');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('active');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('active');
    
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEditorContent(content);
      validateJson(content);
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!validateJson(editorContent)) return;

    setLoading(true);
    setSnackbarMessage('Generating presentation...');
    setSnackbarOpen(true);
    
    try {
      // Wait for the presentation to be generated and download to start
      const blob = await generatePresentation(JSON.parse(editorContent));
      
      // Success message after download starts
      setSnackbarMessage('Presentation downloaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error generating presentation:', error);
      setError('Failed to generate presentation. Please check your JSON structure and try again.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorDialog = () => {
    setShowError(false);
  };

  const handleViewPresentation = () => {
    if (currentPresentation) {
      setShowPresentation(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Presentation Generator
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Create beautiful presentations using a simple JSON schema
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Paper className="neoglass-card" sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Presentation Schema
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Tooltip title="Copy schema to clipboard">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCopySchema}
                    sx={{ textTransform: 'none', mr: 1 }}
                  >
                    Copy Schema
                  </Button>
                </Tooltip>
              </Box>
              <Editor
                height="500px"
                defaultLanguage="json"
                value={editorContent}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading}
            className="neoglass-button"
            sx={{ px: 4, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Presentation'}
          </Button>
          <Button
            variant="contained"
            onClick={handleViewPresentation}
            disabled={!currentPresentation}
            className="neoglass-button"
            startIcon={<VisibilityIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            View Presentation
          </Button>
        </Box>
      </Box>

      {showPresentation && currentPresentation && (
        <PresentationView
          presentation={currentPresentation}
          onClose={() => setShowPresentation(false)}
        />
      )}

      <Dialog open={showError} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </motion.div>
  );
};

export default HomePage;