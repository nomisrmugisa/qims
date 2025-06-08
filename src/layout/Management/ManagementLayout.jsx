import React from 'react';
import { Outlet } from 'react-router-dom';
import { Typography } from '@mui/material';

const ManagementLayout = () => {
  return (
    <div>
      <Typography variant="h4" style={{ margin: '20px' }}>
        Management Section
      </Typography>
      {/* This Outlet will render the child routes */}
      <Outlet />
    </div>
  );
};

export default ManagementLayout;
