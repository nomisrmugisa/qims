import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer,
  Checkbox, FormControlLabel, CircularProgress, TablePagination, Chip, Tooltip,
  Modal, Dialog, DialogTitle, DialogContent, DialogActions, Stack
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
  const [openModal, setOpenModal] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    firstName: '',
    surname: '',
    password: '',
    repeatPassword: '',
    facility: '',
    userRoles: [], // Changed to array for multiple selection
    userGroups: [],
    disabled: false
  });

  const [orgUnits, setOrgUnits] = useState([]);
  const [passwordError, setPasswordError] = useState('');

  // Fetch users
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

  // Fetch user roles for dropdown
  const fetchUserRoles = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/40/userRoles', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user roles');
      const data = await response.json();
      setUserRoles(data.userRoles || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  // Fetch user groups for dropdown
  const fetchUserGroups = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/40/userGroups?fields=id,displayName&paging=false', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user groups');
      const data = await response.json();
      setUserGroups(data.userGroups || []);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserRoles();
  }, [page, rowsPerPage, searchTerm, showSelfRegistrations, orgUnitFilter]);

  const fetchOrgUnits = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/40/organisationUnits?fields=id,displayName,path&paging=false', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });
      if (!response.ok) throw new Error('Failed to fetch org units');
      const data = await response.json();
      setOrgUnits(data.organisationUnits || []);
    } catch (error) {
      console.error('Error fetching org units:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserRoles();
    fetchUserGroups();
    fetchOrgUnits(); // Add this line
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate passwords match
    if (newUser.password !== newUser.repeatPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const payload = {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        firstName: newUser.firstName,
        surname: newUser.surname,
        userRoles: newUser.userRoles.map(roleId => ({ id: roleId })),
        userGroups: newUser.userGroups.map(groupId => ({ id: groupId })),
        organisationUnits: newUser.facility ? [{ id: newUser.facility }] : [],
        disabled: newUser.disabled
      };

      const response = await fetch('http://localhost:5002/api/40/users', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create user');

      handleCloseModal();
      fetchUsers();
      setNewUser({
        username: '',
        email: '',
        firstName: '',
        surname: '',
        password: '',
        repeatPassword: '',
        facility: '',
        userRoles: [],
        userGroups: [],
        disabled: false
      });
      setPasswordError('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* New User Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <Box display="flex" gap={2}>
              <TextField
                label="First Name"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="surname"
                value={newUser.surname}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!passwordError}
              />
              <TextField
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                value={newUser.repeatPassword}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!passwordError}
                helperText={passwordError}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Facility</InputLabel>
              <Select
                name="facility"
                value={newUser.facility}
                onChange={handleInputChange}
                label="Facility"
                required
              >
                {orgUnits.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Roles </InputLabel>
              <Select
                name="userRoles"
                multiple
                value={newUser.userRoles}
                onChange={(e) => setNewUser({ ...newUser, userRoles: e.target.value })}
                label="Roles "
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((roleId) => {
                      const role = userRoles.find(r => r.id === roleId);
                      return <Chip key={roleId} label={role?.displayName || roleId} />;
                    })}
                  </Box>
                )}
              >
                {userRoles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={newUser.userRoles.indexOf(role.id) > -1} />
                    {role.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Groups</InputLabel>
              <Select
                name="userGroups"
                multiple
                value={newUser.userGroups}
                onChange={(e) => setNewUser({ ...newUser, userGroups: e.target.value })}
                label="Groups"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((groupId) => {
                      const group = userGroups.find(g => g.id === groupId);
                      return <Chip key={groupId} label={group?.displayName || groupId} />;
                    })}
                  </Box>
                )}
              >
                {userGroups.map(group => (
                  <MenuItem key={group.id} value={group.id}>
                    <Checkbox checked={newUser.userGroups.indexOf(group.id) > -1} />
                    {group.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={newUser.disabled}
                  onChange={(e) => setNewUser({ ...newUser, disabled: e.target.checked })}
                />
              }
              label="Disabled"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search and Filter Section */}
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
          onClick={handleOpenModal}
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
                <TableRow sx={{
                  backgroundColor: (theme) => theme.palette.grey[300],
                  '& th': {
                    backgroundColor: (theme) => theme.palette.grey[300]
                  }
                }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Display name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Role</TableCell>
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