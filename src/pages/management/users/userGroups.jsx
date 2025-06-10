import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, CircularProgress, TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const UserGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalGroups, setTotalGroups] = useState(0);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const url = new URL(`http://localhost:5002/api/40/userGroups`);
      url.searchParams.append('fields', 'id,displayName,access,user[id,displayName],publicAccess,userGroupAccesses');
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

      if (!response.ok) throw new Error('Failed to fetch user groups');
      
      const data = await response.json();
      setGroups(data.userGroups || []);
      setTotalGroups(data.pager?.total || 0);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Members</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id} hover>
                    <TableCell>{group.displayName}</TableCell>
                    <TableCell>{group.users ? group.users.length : 0}</TableCell>
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
            count={totalGroups}
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

export default UserGroups;