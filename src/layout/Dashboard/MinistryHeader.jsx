import React from 'react';
import {
  Box, Typography, AppBar, Toolbar, Container, Button, IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// Import the ministry logo as a fallback if coat of arms is not available
import mohBotsLogo from 'assets/logo/moh-bots-log.jpg';

const MinistryHeader = () => {
  return (
    <Box sx={{ flexGrow: 1, position: 'fixed', width: '100%', top: 0, zIndex: 1300 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar variant="dense">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" sx={{ mr: 3 }}>health@gov.bw</Typography>
            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">+267 363 2500</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small" color="inherit">
            <TwitterIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <FacebookIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <InstagramIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <LinkedInIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Container sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, width: '300px' }}>
            <Box 
              component="img"
              src={mohBotsLogo}
              alt="Republic of Botswana Coat of Arms"
              sx={{ height: 80, width: 'auto', maxWidth: '100%', mr: 2, objectFit: 'contain' }}
            />
            <Box>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                REPUBLIC OF BOTSWANA
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Ministry of Health
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
            <Button sx={{ fontWeight: 'bold' }}>Complete Registration</Button>
            <Button sx={{ fontWeight: 'bold', borderBottom: '2px solid #1976d2' }}>Overview</Button>
            <Button sx={{ fontWeight: 'bold' }}>Report</Button>
            <Button sx={{ fontWeight: 'bold' }}>Tasks</Button>
            <Button endIcon={<KeyboardArrowDownIcon />} sx={{ fontWeight: 'bold' }}>
              Documents Repository
            </Button>
          </Box>
          
          <Box>
            <Button variant="contained" sx={{ mr: 1 }} color="primary">
              Login
            </Button>
            <Button variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
              Apply
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MinistryHeader; 