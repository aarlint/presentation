import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface HeaderProps {
  title: string;
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onClose }) => {
  return (
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
        {title}
      </Typography>
      <IconButton onClick={onClose} size="large">
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default Header; 