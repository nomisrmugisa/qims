import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer,
  Checkbox, FormControlLabel, CircularProgress, TablePagination, Chip, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orgUnitFilter, setOrgUnitFilter] = useState('');
  const [timeInactiveFilter, setTimeInactiveFilter] = useState('');
  const [invitationFilter, setInvitationFilter] = useState('');
  const [showSelfRegistrations, setShowSelfRegistrations] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = new URL(`http://localhost:5002/api/40/users`);
      url.searchParams.append('fields', 'id,displayName,access,email,twoFactorEnabled,userCredentials[username,disabled,lastLogin,userRoles[id,name,displayName]],teiSearchOrganisationUnits[id,path,displayName],organisationUnits[id,displayName,path],lastUpdated,created');
      url.searchParams.append('order', 'firstName:asc,surname:asc');
      url.searchParams.append('userOrgUnits', 'true');
      url.searchParams.append('includeChildren', 'true');
      url.searchParams.append('page', page + 1);
      url.searchParams.append('pageSize', rowsPerPage);
      url.searchParams.append('selfRegistered', showSelfRegistrations);
      
      if (searchTerm) {
        url.searchParams.append('query', searchTerm);
      }
      if (orgUnitFilter) {
        url.searchParams.append('ou', orgUnitFilter);
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users || []);
      setTotalUsers(data.pager?.total || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm, showSelfRegistrations, orgUnitFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Facility</InputLabel>
          <Select
            value={orgUnitFilter}
            onChange={(e) => setOrgUnitFilter(e.target.value)}
            label="Facility"
            style={{ width: '140px' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="unit1">Unit 1</MenuItem>
            <MenuItem value="unit2">Unit 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time inactive</InputLabel>
          <Select
            value={timeInactiveFilter}
            onChange={(e) => setTimeInactiveFilter(e.target.value)}
            label="Time inactive"
            style={{ width: '160px' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1month">1 month</MenuItem>
            <MenuItem value="3months">3 months</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Invitation</InputLabel>
          <Select
            value={invitationFilter}
            onChange={(e) => setInvitationFilter(e.target.value)}
            label="Invitation"
            // style={{ height: '40px' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={showSelfRegistrations}
              onChange={(e) => setShowSelfRegistrations(e.target.checked)}
            />
          }
          label="Show self-registrations"
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ ml: 'auto' }}
        >
          New
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[300], 
                        '& th': {
                            backgroundColor: (theme) => theme.palette.grey[300]
                        } }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Display name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Roles</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Facility</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Last login</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Last Modified</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.userCredentials?.username}</TableCell>
                    <TableCell>
                      {user.userCredentials?.userRoles && user.userCredentials?.userRoles.length > 0
                        ? user.userCredentials.userRoles[0].displayName
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {user.userCredentials?.userRoles?.map(role => (
                          <Tooltip key={role.id} title={role.displayName}>
                            <Chip
                              label={role.displayName}
                              size="small"
                              sx={{ maxWidth: 120 }}
                            />
                          </Tooltip>
                        )) || '-'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user.organisationUnits?.map(ou => 
                        ou.displayName === 'Botswana' ? 'Application Not Complete' : ou.displayName
                      ).join(', ') || '-'}
                    </TableCell>
                    <TableCell>
                      {user.userCredentials?.lastLogin ? 
                        new Date(user.userCredentials.lastLogin).toLocaleString() : 
                        '-'}
                    </TableCell>
                    <TableCell>
                      {user.lastUpdated ? 
                        new Date(user.lastUpdated).toLocaleString() : 
                        '-'}
                    </TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{ 
                          color: user.userCredentials?.disabled ? 'error.main' : 'success.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {user.userCredentials?.disabled ? 'Disabled' : 'Active'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ 
                          color: user.userCredentials?.disabled ? 'success.main' : 'error.main', 
                          borderColor: user.userCredentials?.disabled ? 'success.main' : 'error.main',
                          '&:hover': {
                            borderColor: user.userCredentials?.disabled ? 'success.dark' : 'error.dark'
                          }
                        }}
                      >
                        {user.userCredentials?.disabled ? 'Enable' : 'Disable'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default Users;