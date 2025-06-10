import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Users from './userMgt';
import UserRoles from './userRoles';
import UserGroups from './userGroups';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        User Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Users" />
          <Tab label="User Roles" />
          <Tab label="User Groups" />
        </Tabs>
      </Box>

      {activeTab === 0 && <Users />}
      {activeTab === 1 && <UserRoles />}
      {activeTab === 2 && <UserGroups />}
    </Box>
  );
};

export default UserManagement;