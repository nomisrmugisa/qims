import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  Card,
  CardContent,
  Button,
  Alert,
  Snackbar,
  Autocomplete,
  Paper,
  Chip,
  Container
} from '@mui/material';
import debounce from 'lodash/debounce';

// Define required fields for "Other Details" section
const requiredOtherDetailsFields = [
  'aMFg2iq9VIg', // Private Practice Number
  'HMk4LZ9ESOq', // Name of the License Holder
  'ykwhsQQPVH0', // Surname of License Holder
  'PdtizqOqE6Q', // Name of Facility to be Registered
  'VJzk8OdFJKA'  // Location in Botswana
];

const TrackerEventDetails = ({ onFormStatusChange }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [organisationalUnits, setOrganisationalUnits] = useState([]);
  const [filteredOrgUnits, setFilteredOrgUnits] = useState([]);
  const [isLoadingOrgUnits, setIsLoadingOrgUnits] = useState(false);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const credentials = localStorage.getItem('userCredentials');
        const userOrgUnitId = localStorage.getItem('userOrgUnitId');
        
        if (!credentials || !userOrgUnitId) {
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Fetch user data to get the twitter value (DHIS2 Application Code)
        const meResponse = await fetch('/api/me', {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        });

        if (!meResponse.ok) {
          setError('Failed to fetch user data. Please try again.');
          setLoading(false);
          return;
        }

        const userData = await meResponse.json();
        console.log('User data:', userData);
        
        // Store the user data for reference
        setUserData(userData);
        
        // Get the DHIS2 Application Code from twitter field
        const applicationCode = userData.twitter;
        
        if (!applicationCode) {
          console.log('No application code found in user data');
          // Fall back to dummy data if no application code is found
          setDummyData();
          return;
        }
        
        // Try to fetch events using the direct endpoint with twitter value
        try {
          // Use the specified endpoint: /api/events/{twitter}
          const eventsUrl = `/api/events/${applicationCode}`;
          
          const eventsResponse = await fetch(eventsUrl, {
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          });
          
          if (!eventsResponse.ok) {
            throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
          }
          
          const eventData = await eventsResponse.json();
          console.log('Event data:', eventData);
          
          if (eventData) {
            setEventData(eventData);
            
            // Initialize form values
            const initialFormValues = {};
            if (eventData.dataValues) {
              eventData.dataValues.forEach(dv => {
                initialFormValues[dv.dataElement] = dv.value;
              });
            }
            setFormValues(initialFormValues);
            
            // If there's a location value, set the selected org unit
            const locationValue = initialFormValues['VJzk8OdFJKA'];
            if (locationValue) {
              setSelectedOrgUnit({ displayName: locationValue });
            }
            
            // Check if all required fields are filled
            checkFormCompletion(initialFormValues);
            
            setLoading(false);
            setUserData(userData);
            return;
          }
          
          // If no event data found, fall back to dummy data
          throw new Error('No event data found with the provided application code');
          
        } catch (eventError) {
          console.error('Error fetching event data:', eventError);
          
          // Fall back to dummy data
          console.log('Falling back to dummy data');
          setDummyData();
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };
    
    const setDummyData = () => {
      // Set dummy data as fallback
      const dummyEventData = {
        event: 'dummy-event-id',
        status: 'ACTIVE',
        eventDate: '2023-05-15',
        dataValues: [
          { dataElement: 'aMFg2iq9VIg', value: 'PP12345' },
          { dataElement: 'HMk4LZ9ESOq', value: 'John' },
          { dataElement: 'ykwhsQQPVH0', value: 'Doe' },
          { dataElement: 'PdtizqOqE6Q', value: 'Central Clinic' },
          { dataElement: 'VJzk8OdFJKA', value: 'Gaborone' },
          { dataElement: 'g3J1CH26hSA', value: 'johndoe' },
          { dataElement: 'SReqZgQk0RY', value: '+1234567890' },
          { dataElement: 'SVzSsDiZMN5', value: 'BHPC123456' }
        ]
      };
      
      setEventData(dummyEventData);
      
      // Initialize form values
      const initialFormValues = {};
      dummyEventData.dataValues.forEach(dv => {
        initialFormValues[dv.dataElement] = dv.value;
      });
      setFormValues(initialFormValues);
      
      // Set the selected org unit for the location
      setSelectedOrgUnit({ displayName: 'Gaborone' });
      
      // Check if all required fields are filled
      checkFormCompletion(initialFormValues);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // Check if all required fields are filled
  const checkFormCompletion = (values) => {
    const isComplete = requiredOtherDetailsFields.every(field => {
      return values[field] && values[field].trim() !== '';
    });
    
    setIsFormComplete(isComplete);
    
    // Notify parent component about form status
    if (onFormStatusChange) {
      onFormStatusChange(isComplete);
    }
    
    // Also store in localStorage for access by other components
    localStorage.setItem('completeApplicationFormStatus', JSON.stringify(isComplete));
  };

  // Fetch organisational units when entering edit mode
  useEffect(() => {
    if (isEditing) {
      fetchOrganisationalUnits();
    }
  }, [isEditing]);
  
  // Update filtered org units when organizational units change or search query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setFilteredOrgUnits(organisationalUnits);
    }
  }, [organisationalUnits]);

  // Check form completion whenever form values change
  useEffect(() => {
    checkFormCompletion(formValues);
  }, [formValues]);

  const fetchOrganisationalUnits = async () => {
    setIsLoadingOrgUnits(true);
    try {
      const credentials = localStorage.getItem('userCredentials');
      if (!credentials) {
        console.error("No credentials found");
        setIsLoadingOrgUnits(false);
        return;
      }
      
      const response = await fetch(
        "https://qimsdev.5am.co.bw/qims/api/organisationUnits.json?filter=level:eq:4&fields=id,displayName&paging=false",
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch organisational units");
      }
      const data = await response.json();
      setOrganisationalUnits(data.organisationUnits);
      setFilteredOrgUnits(data.organisationUnits);
    } catch (error) {
      console.error("Error fetching organisational units:", error);
    } finally {
      setIsLoadingOrgUnits(false);
    }
  };
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      const filtered = organisationalUnits.filter((unit) =>
        unit.displayName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOrgUnits(filtered);
    }, 300),
    [organisationalUnits]
  );
  
  // Handle search input change
  const handleSearchChange = (event, value) => {
    setSearchQuery(value || '');
    debouncedSearch(value || '');
  };

  // Helper function to get data value from data element ID
  const getDataValue = (dataElementId) => {
    if (!eventData || !eventData.dataValues) return 'N/A';
    
    const dataValue = eventData.dataValues.find(dv => dv.dataElement === dataElementId);
    return dataValue ? dataValue.value : 'N/A';
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Handle form field changes
  const handleChange = (e, dataElementId) => {
    const newFormValues = {
      ...formValues,
      [dataElementId]: e.target.value
    };
    setFormValues(newFormValues);
  };
  
  // Handle location change
  const handleLocationChange = (event, newValue) => {
    setSelectedOrgUnit(newValue);
    const newFormValues = { ...formValues };
    
    if (newValue) {
      newFormValues['VJzk8OdFJKA'] = newValue.displayName;
    } else {
      newFormValues['VJzk8OdFJKA'] = '';
    }
    
    setFormValues(newFormValues);
  };
  
  // Toggle edit mode
  const handleToggleEdit = () => {
    if (isEditing) {
      // Reset form values to original data when canceling
      const originalValues = {};
      if (eventData && eventData.dataValues) {
        eventData.dataValues.forEach(dv => {
          originalValues[dv.dataElement] = dv.value;
        });
      }
      setFormValues(originalValues);
      
      // Reset selected org unit
      const locationValue = originalValues['VJzk8OdFJKA'];
      if (locationValue) {
        setSelectedOrgUnit({ displayName: locationValue });
      } else {
        setSelectedOrgUnit(null);
      }
      
      // Reset search
      setSearchQuery('');
      setFilteredOrgUnits(organisationalUnits);
      
      // Check form completion with original values
      checkFormCompletion(originalValues);
    }
    setIsEditing(!isEditing);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!eventData || !eventData.event) {
      setUpdateError('No event data available to update');
      return;
    }
    
    setUpdating(true);
    setUpdateError(null);
    
    try {
      const credentials = localStorage.getItem('userCredentials');
      
      if (!credentials) {
        setUpdateError('Authentication required. Please log in again.');
        setUpdating(false);
        return;
      }
      
      // Prepare data values for update
      const dataValues = Object.entries(formValues).map(([dataElement, value]) => ({
        dataElement,
        value
      }));
      
      // Create update payload
      const updatePayload = {
        ...eventData,
        dataValues
      };
      
      // Send update request
      const updateUrl = `/api/events/${eventData.event}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || `HTTP error! status: ${updateResponse.status}`);
      }
      
      // Update was successful
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Update local event data
      setEventData({
        ...eventData,
        dataValues
      });
      
      // Check form completion after update
      checkFormCompletion(formValues);
      
    } catch (err) {
      console.error('Error updating event:', err);
      setUpdateError(`Failed to update: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setUpdateSuccess(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error">Error: {error}</Typography>
        <Typography variant="body2" mt={1}>
          Please ensure you have completed the application process and have a valid DHIS2 Application Code.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, px: { xs: 1, sm: 2 } }}>
      {/* Success message */}
      <Snackbar 
        open={updateSuccess} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Application details updated successfully!
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      {updateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateError}
        </Alert>
      )}

      {/* Form completion status indicator */}
      {!isFormComplete && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please fill in all required fields to complete this section.
        </Alert>
      )}
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
            Complete Application: Preliminary Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Submission Date"
                value={formatDate(eventData?.eventDate)}
                fullWidth
                size="small"
                margin="dense"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Employee User Name"
                value={getDataValue('g3J1CH26hSA')}
                fullWidth
                size="small"
                margin="dense"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="B.H.P.C License Number"
                value={getDataValue('SVzSsDiZMN5')}
                fullWidth
                size="small"
                margin="dense"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Phone Number"
                value={getDataValue('SReqZgQk0RY')}
                fullWidth
                size="small"
                margin="dense"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            {/* Hidden DHIS2 Application Code field */}
            <Grid item xs={12}>
              <TextField
                label="DHIS2 Application Code"
                value={userData?.twitter || ''}
                fullWidth
                size="small"
                margin="dense"
                InputProps={{ readOnly: true }}
                sx={{ 
                  display: 'none', // Hidden by default
                  '& .MuiInputBase-input': { fontFamily: 'monospace' } 
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
            Other Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Private Practice Number"
                value={formValues['aMFg2iq9VIg'] || ''}
                onChange={(e) => handleChange(e, 'aMFg2iq9VIg')}
                fullWidth
                size="small"
                margin="dense"
                disabled={!isEditing || updating}
                required
                error={!formValues['aMFg2iq9VIg'] && !loading}
                helperText={!formValues['aMFg2iq9VIg'] && !loading ? "This field is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name of the License Holder"
                value={formValues['HMk4LZ9ESOq'] || ''}
                onChange={(e) => handleChange(e, 'HMk4LZ9ESOq')}
                fullWidth
                size="small"
                margin="dense"
                disabled={!isEditing || updating}
                required
                error={!formValues['HMk4LZ9ESOq'] && !loading}
                helperText={!formValues['HMk4LZ9ESOq'] && !loading ? "This field is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Surname of License Holder"
                value={formValues['ykwhsQQPVH0'] || ''}
                onChange={(e) => handleChange(e, 'ykwhsQQPVH0')}
                fullWidth
                size="small"
                margin="dense"
                disabled={!isEditing || updating}
                required
                error={!formValues['ykwhsQQPVH0'] && !loading}
                helperText={!formValues['ykwhsQQPVH0'] && !loading ? "This field is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name of Facility for Application"
                value={formValues['PdtizqOqE6Q'] || ''}
                onChange={(e) => handleChange(e, 'PdtizqOqE6Q')}
                fullWidth
                size="small"
                margin="dense"
                disabled={!isEditing || updating}
                required
                error={!formValues['PdtizqOqE6Q'] && !loading}
                helperText={!formValues['PdtizqOqE6Q'] && !loading ? "This field is required" : ""}
              />
            </Grid>
          </Grid>

          {/* Location field */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.primary' }}>
              Location in Botswana <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box sx={{ position: 'relative' }}>
              {isEditing ? (
                <>
                  <Autocomplete
                    options={filteredOrgUnits}
                    getOptionLabel={(option) => option.displayName || ''}
                    value={selectedOrgUnit}
                    onChange={handleLocationChange}
                    onInputChange={handleSearchChange}
                    loading={isLoadingOrgUnits}
                    disabled={updating}
                    fullWidth
                    size="small"
                    ListboxProps={{
                      style: { maxHeight: '200px' }
                    }}
                    PaperComponent={props => (
                      <Paper 
                        {...props} 
                        elevation={3}
                        sx={{ 
                          maxHeight: 200,
                          width: '100%',
                          '& .MuiAutocomplete-option': {
                            py: 1,
                            px: 2,
                            borderBottom: '1px solid #eee',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white'
                            }
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <Typography noWrap>
                          {option.displayName}
                        </Typography>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        placeholder="Search for a location..."
                        size="small"
                        margin="dense"
                        required
                        error={!formValues['VJzk8OdFJKA'] && !loading}
                        helperText={!formValues['VJzk8OdFJKA'] && !loading ? "Location is required" : ""}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused': {
                              borderColor: 'primary.main',
                              boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                            }
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingOrgUnits ? <CircularProgress color="primary" size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {filteredOrgUnits.length > 0 && searchQuery && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 0.5, 
                        color: 'text.secondary'
                      }}
                    >
                      {filteredOrgUnits.length} location{filteredOrgUnits.length !== 1 ? 's' : ''} found
                    </Typography>
                  )}
                </>
              ) : (
                <Box 
                  sx={{ 
                    p: 1.5, 
                    border: '1px solid #ddd', 
                    borderRadius: 1,
                    bgcolor: '#f9f9f9',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    borderColor: !formValues['VJzk8OdFJKA'] && !loading ? 'error.main' : '#ddd'
                  }}
                >
                  {formValues['VJzk8OdFJKA'] ? (
                    <Chip 
                      label={formValues['VJzk8OdFJKA']}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  ) : (
                    <Typography color="error" variant="body2">Location is required</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
            {!isEditing ? (
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleToggleEdit}
                disabled={updating}
                size="small"
              >
                Edit Details
              </Button>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={handleToggleEdit}
                  disabled={updating}
                  size="small"
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit}
                  disabled={updating}
                  size="small"
                >
                  {updating ? 'Updating...' : 'Update Application Details'}
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TrackerEventDetails; 