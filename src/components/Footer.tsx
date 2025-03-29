import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {'© '}
        <Link color="inherit" href="#">
          PowerPoint Generator
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;