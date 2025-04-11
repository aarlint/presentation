import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface NavigationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}) => {
  const theme = useTheme();

  return (
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
        onClick={onPrevious}
        disabled={currentSlide === 0}
        size="large"
      >
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="body1" sx={{ alignSelf: 'center' }}>
        {currentSlide + 1} / {totalSlides}
      </Typography>
      <IconButton
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        size="large"
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default NavigationControls; 