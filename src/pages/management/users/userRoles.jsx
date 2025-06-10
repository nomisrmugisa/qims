import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, CircularProgress, TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const UserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalRoles, setTotalRoles] = useState(0);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const url = new URL(`http://localhost:5002/api/40/userRoles`);
      url.searchParams.append('fields', 'id,displayName,access,user[id,displayName],publicAccess,userGroupAccesses,description');
      url.searchParams.append('order', 'name:asc');
      url.searchParams.append('page', page + 1);
      url.searchParams.append('pageSize', rowsPerPage);
      if (searchTerm) {
        url.searchParams.append('query', searchTerm);
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user roles');
      
      const data = await response.json();
      setRoles(data.userRoles || []);
      setTotalRoles(data.pager?.total || 0);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage, searchTerm]);

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
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Display name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.displayName}</TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small">
                        Edit
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
            count={totalRoles}
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

export default UserRoles;