import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, useTheme, List, ListItem, ListItemIcon, ListItemText, Divider, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnimatePresenceProps } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import type { Presentation, PresentationPage, PresentationContent } from '../services/presentationService';

interface PresentationViewProps {
  presentation: Presentation;
  onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ presentation, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const totalSlides = presentation.pages.length;

  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        handlePreviousSlide();
        break;
      case 'ArrowRight':
        handleNextSlide();
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  const handlePreviousSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const renderContent = (content: PresentationContent) => {
    const style = content.style || {};
    const textColor = style.color || 'inherit';

    switch (content.type) {
      case 'text':
        return (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              ...style,
              color: textColor
            }}
          >
            {content.content.text}
          </Typography>
        );

      case 'image':
        return (
          <Box sx={{ mb: 2 }}>
            <Box
              component="img"
              src={content.content.imageUrl}
              alt="Presentation image"
              sx={{
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                mb: 1,
              }}
            />
            {content.content.imageCaption && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center' }}
              >
                {content.content.imageCaption}
              </Typography>
            )}
          </Box>
        );

      case 'table':
        return (
          <Box sx={{ overflowX: 'auto', mb: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {content.content.tableData?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{
                          border: '1px solid',
                          padding: '8px',
                          textAlign: 'left',
                          color: textColor,
                          ...style
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );

      case 'chart':
        return (
          <Box sx={{ height: '300px', mb: 2 }}>
            {/* Chart implementation would go here */}
            <Typography variant="body2" color="text.secondary">
              Chart: {content.content.chartData?.type} with {content.content.chartData?.labels.length} data points
            </Typography>
          </Box>
        );

      case 'list':
        return (
          <List sx={{ mb: 2 }}>
            {content.content.listItems?.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {content.content.listType === 'check' ? (
                    <CheckCircleIcon color="primary" />
                  ) : content.content.listType === 'numbered' ? (
                    <RadioButtonCheckedIcon color="primary" />
                  ) : (
                    <FiberManualRecordIcon color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item}
                  sx={{ color: textColor, ...style }}
                />
              </ListItem>
            ))}
          </List>
        );

      case 'quote':
        return (
          <Box sx={{ mb: 2, pl: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontStyle: 'italic',
                color: textColor,
                ...style
              }}
            >
              "{content.content.quoteText}"
            </Typography>
            {content.content.quoteAuthor && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'right' }}
              >
                - {content.content.quoteAuthor}
              </Typography>
            )}
          </Box>
        );

      case 'code':
        return (
          <Box 
            sx={{ 
              mb: 2,
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              ...style
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {content.content.codeLanguage || 'code'}
            </Typography>
            <Typography 
              component="pre" 
              sx={{ 
                margin: 0,
                whiteSpace: 'pre-wrap',
                color: textColor
              }}
            >
              {content.content.code}
            </Typography>
          </Box>
        );

      case 'video':
        return (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <PlayCircleOutlineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1">
              {content.content.videoType?.toUpperCase()} Video
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {content.content.videoUrl}
            </Typography>
          </Box>
        );

      case 'shape':
        return (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            {content.content.shape === 'arrow' ? (
              <ArrowForwardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            ) : content.content.shape === 'star' ? (
              <StarIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            ) : (
              <Typography variant="body1">
                Shape: {content.content.shape}
              </Typography>
            )}
          </Box>
        );

      case 'icon':
        return (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="body1">
              Icon: {content.content.icon}
            </Typography>
          </Box>
        );

      case 'timeline':
        return (
          <Box sx={{ mb: 2 }}>
            <TimelineIcon sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Timeline</Typography>
            {content.content.timelineEvents?.map((event, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" color="primary">
                  {event.date}
                </Typography>
                <Typography variant="body1">
                  {event.event}
                </Typography>
              </Box>
            ))}
          </Box>
        );

      case 'process':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>Process Steps</Typography>
            {content.content.processSteps?.map((step, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Step {index + 1}: {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        );

      case 'comparison':
        return (
          <Box sx={{ mb: 2 }}>
            <CompareArrowsIcon sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
            <Grid container spacing={2}>
              {content.content.comparisonItems?.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <List>
                      {item.features.map((feature: string, featureIndex: number) => (
                        <ListItem key={featureIndex}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  const currentPage = presentation.pages[currentSlide];
  const pageStyle = {
    background: currentPage.background?.gradient || currentPage.background?.color || 'inherit',
    color: currentPage.background?.gradient || currentPage.background?.color ? '#FFFFFF' : 'inherit'
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">
          {presentation.metadata.title}
        </Typography>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative',
        }}
      >
        {/* @ts-ignore */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                maxWidth: '90vw',
                maxHeight: '80vh',
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                ...pageStyle
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ color: pageStyle.color }}
              >
                {currentPage.title || `Slide ${currentSlide + 1}`}
              </Typography>
              {currentPage.subtitle && (
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ color: pageStyle.color }}
                >
                  {currentPage.subtitle}
                </Typography>
              )}
              {currentPage.content.map((content, index) => (
                <Box key={index}>{renderContent(content)}</Box>
              ))}
            </Paper>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: theme.spacing(4),
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
          }}
        >
          <IconButton
            onClick={handlePreviousSlide}
            disabled={currentSlide === 0}
            size="large"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="body1" sx={{ alignSelf: 'center' }}>
            {currentSlide + 1} / {totalSlides}
          </Typography>
          <IconButton
            onClick={handleNextSlide}
            disabled={currentSlide === totalSlides - 1}
            size="large"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PresentationView; 