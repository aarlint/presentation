import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion, LazyMotion, domAnimation } from 'framer-motion';
import type { Presentation } from '../services/presentationService';
import Header from './presentation/Header';
import NavigationControls from './presentation/NavigationControls';
import SlideContent from './presentation/SlideContent';

interface PresentationViewProps {
  presentation: Presentation;
  onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ presentation, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const currentPage = presentation.pages[currentSlide];

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
      <Header title={presentation.metadata.title} onClose={onClose} />

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
        <LazyMotion features={domAnimation}>
          {/* @ts-ignore */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`slide-${currentSlide}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <SlideContent
                page={currentPage}
                components={presentation.components || []}
                currentSlide={currentSlide}
              />
            </motion.div>
          </AnimatePresence>
        </LazyMotion>

        <NavigationControls
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrevious={handlePreviousSlide}
          onNext={handleNextSlide}
        />
      </Box>
    </Box>
  );
};

export default PresentationView; 