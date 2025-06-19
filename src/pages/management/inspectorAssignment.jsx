import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer,
  CircularProgress, TablePagination, Chip, Autocomplete, Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const InspectorAssignment = () => {
  const [inspectors, setInspectors] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [sections, setSections] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAssignments, setTotalAssignments] = useState(0);

  // Form state
  const [formState, setFormState] = useState({
    inspector: null,
    facility: null,
    section: null,
    form: null
  });

  // Fetch inspectors (users with MOH Inspector role)
  const fetchInspectors = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/40/users?filter=userCredentials.userRoles.id:eq:MOH_INSPECTOR_ROLE_ID', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });
      const data = await response.json();
      setInspectors(data.users || []);
    } catch (error) {
      console.error('Error fetching inspectors:', error);
    }
  };

  // Fetch facilities (using existing orgUnits endpoint)
  const fetchFacilities = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/40/organisationUnits?fields=id,displayName,path&paging=false', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });
      const data = await response.json();
      setFacilities(data.organisationUnits || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  // Fetch predefined sections (would need to be created in your backend)
  const fetchSections = async () => {
    try {
      // This would be a custom endpoint you'd need to create
      const response = await fetch('http://localhost:5002/api/40/sections', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });
      const data = await response.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      // Fallback to some default sections if endpoint doesn't exist yet
      setSections([
        { id: 'dentistry', displayName: 'Dentistry' },
        { id: 'gynecology', displayName: 'Gynecology' },
        { id: 'pharmacy', displayName: 'Pharmacy' },
        { id: 'laboratory', displayName: 'Laboratory' },
        { id: 'pediatrics', displayName: 'Pediatrics' },
      ]);
    }
  };

  // Fetch existing assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const url = new URL('http://localhost:5002/api/40/inspectionAssignments');
      url.searchParams.append('page', page + 1);
      url.searchParams.append('pageSize', rowsPerPage);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });
      
      const data = await response.json();
      setAssignments(data.assignments || []);
      setTotalAssignments(data.pager?.total || 0);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      // Mock data for demonstration
      setAssignments([
        {
          id: '1',
          inspector: { id: 'user1', displayName: 'Inspector One' },
          facility: { id: 'fac1', displayName: 'Main Hospital' },
          section: { id: 'dentistry', displayName: 'Dentistry' },
          assignedDate: '2023-06-15'
        }
      ]);
      setTotalAssignments(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectors();
    fetchFacilities();
    fetchSections();
    fetchAssignments();
  }, [page, rowsPerPage]);

  const handleFormChange = (name, value) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAssignment = async () => {
    try {
      // Validate form
      if (!formState.inspector || !formState.facility || !formState.section) {
        alert('Please select inspector, facility, and section');
        return;
      }

      const payload = {
        inspectorId: formState.inspector.id,
        facilityId: formState.facility.id,
        sectionId: formState.section.id,
        assignedDate: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5002/api/40/inspectionAssignments', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create assignment');

      // Refresh assignments
      fetchAssignments();
      // Reset form
      setFormState({
        inspector: null,
        facility: null,
        section: null,
        form: null
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
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
      {/* Assignment Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Assign Inspector to Facility Section
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <Autocomplete
              options={inspectors}
              getOptionLabel={(option) => option.displayName}
              value={formState.inspector}
              onChange={(e, newValue) => handleFormChange('inspector', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Inspector" />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <Autocomplete
              options={facilities}
              getOptionLabel={(option) => option.displayName}
              value={formState.facility}
              onChange={(e, newValue) => handleFormChange('facility', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Facility" />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <Autocomplete
              options={sections}
              getOptionLabel={(option) => option.displayName}
              value={formState.section}
              onChange={(e, newValue) => handleFormChange('section', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Section" />
              )}
            />
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmitAssignment}
          sx={{ mt: 1 }}
        >
          Save Assignment
        </Button>
      </Paper>

      {/* Assignments Table */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Current Assignments
      </Typography>
      
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Inspector</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Facility</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assigned Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id} hover>
                    <TableCell>{assignment.inspector?.displayName}</TableCell>
                    <TableCell>{assignment.facility?.displayName}</TableCell>
                    <TableCell>{assignment.section?.displayName}</TableCell>
                    <TableCell>
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small">
                        View Reports
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalAssignments}
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

export default InspectorAssignment;