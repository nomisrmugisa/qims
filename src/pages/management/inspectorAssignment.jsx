import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer,
  CircularProgress, TablePagination, Chip, Autocomplete, Typography, Tooltip, IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const InspectorAssignment = () => {
  // State for facility requests list view
  const [facilityRequests, setFacilityRequests] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Existing state for assignment form
  const [inspectors, setInspectors] = useState([]);
  const [sections, setSections] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [inspectionDate, setInspectionDate] = useState('');

  // Form state
  const [formState, setFormState] = useState({
    inspector: null,
    facility: null,
    section: null,
    form: null
  });

  // Fetch facility inspection requests
  const fetchFacilityRequests = async () => {
    try {
      setLoadingRequests(true);
      // This would be a custom endpoint for inspection requests
      const response = await fetch('http://localhost:5002/api/40/inspectionRequests', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:district')
        }
      });

      const data = await response.json();
      setFacilityRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching facility requests:', error);
      // Mock data for demonstration
      setFacilityRequests([
        {
          id: '1',
          facilityId: 'fac1',
          facilityName: 'Main Hospital',
          contact: 'contact@hospital.com',
          requestDate: '2023-06-10',
          status: 'Pending'
        },
        {
          id: '2',
          facilityId: 'fac2',
          facilityName: 'Community Clinic',
          contact: 'admin@clinic.com',
          requestDate: '2023-06-12',
          status: 'Pending'
        },
        {
          id: '3',
          facilityId: 'fac3',
          facilityName: 'Maternal Clinic',
          contact: 'admin@clinic.com',
          requestDate: '2023-06-13',
          status: 'Pending'
        },
        {
          id: '4',
          facilityId: 'fac4',
          facilityName: 'Community Morturary',
          contact: 'admin@morg.com',
          requestDate: '2023-06-13',
          status: 'Pending'
        }
      ]);
    } finally {
      setLoadingRequests(false);
    }
  };

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
    if (!selectedFacility) {
      fetchFacilityRequests();
    } else {
      fetchInspectors();
      fetchSections();
      fetchAssignments();
    }
  }, [selectedFacility, page, rowsPerPage]);

  // Handle facility selection
  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setFormState(prev => ({
      ...prev,
      facility: { id: facility.facilityId, displayName: facility.facilityName }
    }));
  };

  // Handle back to requests list
  const handleBackToList = () => {
    setSelectedFacility(null);
    setFormState(prev => ({
      ...prev,
      facility: null,
      inspector: null,
      section: null
    }));
  };

  // Handle inspection scheduling
  const handleScheduleInspection = () => {
    if (!inspectionDate) {
      alert('Please select an inspection date');
      return;
    }
    // Here you would typically make an API call to schedule the inspection
    console.log('Scheduling inspection for:', inspectionDate);
    // Then proceed with the assignment
    handleSubmitAssignment();
  };

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
      {!selectedFacility ? (
        /* Facility Requests List View */
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Facility Inspection Requests
          </Typography>

          {/* Search Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TextField
              label="Search facilities"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => fetchFacilityRequests()}>
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />
          </Box>

          {loadingRequests ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Facility Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facilityRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        hover
                        onClick={() => handleFacilitySelect(request)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell>{request.facilityName}</TableCell>
                        <TableCell>{request.contact}</TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={request.status === 'Pending' ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small">
                            Assign Inspector
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
                count={facilityRequests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Box>
      ) : (
        /* Assignment Form View */
        <Box>
          <Button
            variant="outlined"
            onClick={handleBackToList}
            sx={{ mb: 2 }}
          >
            Back to Requests
          </Button>

          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Assign Inspector to {selectedFacility.facilityName}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <TextField
                  label="Facility"
                  value={selectedFacility.facilityName}
                  disabled
                  fullWidth
                  style={{ color: 'black'}}
                />
              </FormControl>

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

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <TextField
                label="Inspection Date"
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
              />

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleScheduleInspection}
              >
                Schedule Inspection
              </Button>
            </Box>
          </Paper>

          {/* Current Assignments Table */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Current Assignments for {selectedFacility.facilityName}
          </Typography>

          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Inspector</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Facility</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Assigned Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Inspection Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id} hover>
                      <TableCell>{assignment.inspector?.displayName || 'Not assigned'}</TableCell>
                      <TableCell>{selectedFacility.facilityName}</TableCell>
                      <TableCell>{assignment.section?.displayName || 'Not assigned'}</TableCell>
                      <TableCell>
                        {assignment.assignedDate ?
                          new Date(assignment.assignedDate).toLocaleDateString() :
                          new Date().toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {assignment.inspectionDate ?
                          new Date(assignment.inspectionDate).toLocaleDateString() :
                          'Not scheduled'}
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
              count={assignments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      )}
    </Box>
  );

};

export default InspectorAssignment;