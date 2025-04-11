import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import type { PresentationPage, PresentationContent, PresentationComponent } from '../../services/presentationService';
import { renderComponent } from './ComponentRenderers';

interface SlideContentProps {
  page: PresentationPage;
  components: PresentationComponent[];
  currentSlide: number;
}

const SlideContent: React.FC<SlideContentProps> = ({ page, components, currentSlide }) => {
  const pageStyle = {
    background: page.background?.image ? `url(${page.background.image})` : 'inherit'
  };

  const renderContent = (content: PresentationContent) => {
    const style = content.style || {};

    if (content.type === 'component') {
      const component = components.find(c => c.id === content.content.componentId);
      if (!component) return null;

      const { position, ...componentStyle } = {
        ...component.style,
        ...style,
        position: content.content.position || 'center'
      };

      return (
        <Box 
          key={component.id}
          className="neoglass-card"
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: position === 'center' ? 'center' : 
                           position === 'left' ? 'flex-start' : 'flex-end',
            alignItems: 'center',
            ...componentStyle
          }}
        >
          {renderComponent(component)}
        </Box>
      );
    }

    // Create a temporary component for non-component content
    const tempComponent: PresentationComponent = {
      id: `temp-${Math.random()}`,
      type: content.type,
      content: content.content,
      style: content.style
    };

    return (
      <Box className="neoglass-card">
        {renderComponent(tempComponent)}
      </Box>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: '80vw',
        height: '80vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        ...pageStyle
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom
      >
        {page.title || `Slide ${currentSlide + 1}`}
      </Typography>
      {page.subtitle && (
        <Typography 
          variant="h6" 
          color="text.secondary" 
          gutterBottom
        >
          {page.subtitle}
        </Typography>
      )}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: page.layout === 'component-grid' ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
        gap: 2,
        mt: 2
      }}>
        {page.content.map((content, index) => (
          <Box key={index}>
            {renderContent(content)}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SlideContent; 