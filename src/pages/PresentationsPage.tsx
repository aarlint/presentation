import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { getPresentations, deletePresentation, downloadPresentation } from '../services/api';

interface Presentation {
  id: string;
  title: string;
  createdAt: string;
  downloadUrl: string;
}

const PresentationsPage: React.FC = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deleteInProgress, setDeleteInProgress] = useState<Record<string, boolean>>({});
  const [downloadInProgress, setDownloadInProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getPresentations();
      setPresentations(data);
    } catch (err) {
      setError(`Failed to load presentations: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteInProgress(prev => ({ ...prev, [id]: true }));
    
    try {
      await deletePresentation(id);
      setPresentations(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(`Failed to delete presentation: ${(err as Error).message}`);
    } finally {
      setDeleteInProgress(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDownload = async (id: string) => {
    setDownloadInProgress(prev => ({ ...prev, [id]: true }));
    
    try {
      await downloadPresentation(id);
    } catch (err) {
      setError(`Failed to download presentation: ${(err as Error).message}`);
    } finally {
      setDownloadInProgress(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Presentations
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : presentations.length === 0 ? (
        <Alert severity="info">
          You haven't created any presentations yet. Go to the home page to create one.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {presentations.map((presentation) => (
            <Grid item xs={12} sm={6} md={4} key={presentation.id}>
              <Card className="presentation-card">
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {presentation.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(presentation.createdAt)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleDownload(presentation.id)}
                    disabled={downloadInProgress[presentation.id]}
                  >
                    {downloadInProgress[presentation.id] ? 'Downloading...' : 'Download'}
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(presentation.id)}
                    disabled={deleteInProgress[presentation.id]}
                  >
                    {deleteInProgress[presentation.id] ? 'Deleting...' : 'Delete'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PresentationsPage;