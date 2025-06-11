import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Grid,
  Box,
  Snackbar,
  Backdrop,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from '../config'; // Import API_URL

// Debounce utility function
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

function RegistrationForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const credentials = 'YWRtaW46NUFtNTM4MDgwNTNA';
  const [organisationalUnits, setOrganisationalUnits] = useState([]);
  const [isLoadingOrgUnits, setIsLoadingOrgUnits] = useState(true);
  const [filteredOrgUnits, setFilteredOrgUnits] = useState([]);

  // Define a default password for new users
  const DEFAULT_PASSWORD = "selfRegistration@123$";

  useEffect(() => {
    // Credentials are now hardcoded as requested, no need to retrieve from localStorage
    // const storedCredentials = localStorage.getItem('userCredentials');
    // if (storedCredentials) {
    //   setCredentials(storedCredentials);
    // }

    const fetchOrganisationalUnits = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/organisationUnits.json?filter=level:eq:4&fields=id,displayName&paging=false`,
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

    fetchOrganisationalUnits();
  }, [credentials]);

  const [formData, setFormData] = useState({
    facility: "",
    physicalAddress: "",
    correspondenceAddress: "",
    BHPCRegistrationNumber: "",
    privatePracticeNumber: "",
    attachments: null,
    email: "",
    firstName: "",
    surname: "",
    cellNumber: "",
    locationInBotswana: "",
    userName: ""
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "attachments" ? files[0] : value
    }));
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      const filtered = organisationalUnits.filter((unit) =>
        unit.displayName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOrgUnits(filtered);
    }, 300),
    [organisationalUnits]
  );

  const handleSearchChange = (event, value) => {
    debouncedSearch(value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // 1. Submit Registration Data (Tracker Event)
      const trackerPayload = {
        events: [
          {
            occurredAt: new Date().toISOString().split('T')[0],
            notes: [],
            program: "Y4W5qIKlOsh",
            programStage: "YzqtE5Uv8Qd",
            orgUnit: formData.locationInBotswana, // Use selected org unit
            dataValues: [
              { dataElement: "ykwhsQQPVH0", value: formData.surname },
              { dataElement: "p7y0vqpP0W2", value: formData.correspondenceAddress },
              { dataElement: "HMk4LZ9ESOq", value: formData.firstName },
              { dataElement: "VJzk8OdFJKA", value: formData.locationInBotswana },
              { dataElement: "D707dj4Rpjz", value: formData.facility },
              { dataElement: "dRkX5jmHEIM", value: formData.physicalAddress },
              { dataElement: "SReqZgQk0RY", value: formData.cellNumber },
              { dataElement: "NVlLoMZbXIW", value: formData.email },
              { dataElement: "SVzSsDiZMN5", value: formData.BHPCRegistrationNumber },
              { dataElement: "aMFg2iq9VIg", value: formData.privatePracticeNumber },
              { dataElement: "g3J1CH26hSA", value: formData.userName }
            ]
          }
        ]
      };

      const trackerResponse = await fetch(
        `${API_URL}/api/40/tracker?async=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify(trackerPayload),
        },
      );

      if (!trackerResponse.ok) {
        const errorText = await trackerResponse.text();
        throw new Error(`Failed to submit registration: ${errorText}`);
      }
      console.log("Tracker event submitted successfully!");

      // 2. Create User Profile
      const accountExpiryDate = new Date();
      accountExpiryDate.setFullYear(accountExpiryDate.getFullYear() + 1);

      const userPayload = {
        username: formData.userName,
        disabled: false,
        password: DEFAULT_PASSWORD,
        accountExpiry: accountExpiryDate.toISOString().split('T')[0],
        userRoles: [{ id: "aOxLneGCVvO" }], // Your DHIS2 user role ID
        organisationUnits: [{ id: formData.locationInBotswana }], // Use selected org unit
        email: formData.email,
        firstName: formData.firstName,
        surname: formData.surname,
        phoneNumber: formData.cellNumber,
        // Other optional fields as per your spec, if needed:
        // whatsApp: "", 
        // twitter: "",
        // catDimensionConstraints: [],
        // cogsDimensionConstraints: [],
        // dataViewOrganisationUnits: [],
        // teiSearchOrganisationUnits: [],
        // dataViewMaxOrganisationUnitLevel: null,
        // userGroups: [],
        // attributeValues: []
      };

      const userResponse = await fetch(`${API_URL}/api/40/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(userPayload),
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(`Failed to create user profile: ${errorText}`);
      }
      const userData = await userResponse.json();
      const userId = userData.response.uid;
      console.log("User profile created successfully! User ID:", userId);

      // 3. Send Welcome Email
      const emailPayload = {
        subject: "Welcome to the System",
        text: `Hello ${formData.firstName},\n\nYour account has been created.\n\nUsername: ${formData.userName}\nPassword: ${DEFAULT_PASSWORD}\n\nPlease log in and change your password.`,
        users: [{ id: userId }],
        email: true
      };

      const emailResponse = await fetch(`${API_URL}/api/messageConversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(emailPayload),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        throw new Error(`Failed to send welcome email: ${errorText}`);
      }
      console.log("Welcome email sent successfully!");

      setSuccessOpen(true);
      setTimeout(() => {
        handleClose();
      }, 4000);
    } catch (err) {
      console.error("Submission error:", err);
      alert(`There was an error submitting your request: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Register
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: "bold", textAlign: "left" }}>
          Registration Form
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 4 }}>
          {/* Facility Profile Section */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Facility Profile
          </Typography>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Facility Name"
              name="facility"
              value={formData.facility}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />

            <Autocomplete
              fullWidth
              options={filteredOrgUnits}
              getOptionLabel={(option) => option.displayName}
              value={organisationalUnits.find((ou) => ou.id === formData.locationInBotswana) || null}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  locationInBotswana: newValue ? newValue.id : ""
                }));
              }}
              onInputChange={handleSearchChange}
              loading={isLoadingOrgUnits}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location in Botswana (Ward)"
                  variant="outlined"
                  margin="dense"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingOrgUnits ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  required
                  InputLabelProps={{
                    sx: {
                      "& .MuiFormLabel-asterisk": {
                        color: "red",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* User Profile Section */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            User Profile
          </Typography>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Preferred User Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  margin="dense"
                  required
                  InputLabelProps={{
                    sx: {
                      "& .MuiFormLabel-asterisk": {
                        color: "red",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  variant="outlined"
                  margin="dense"
                  required
                  InputLabelProps={{
                    sx: {
                      "& .MuiFormLabel-asterisk": {
                        color: "red",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Physical Address"
              name="physicalAddress"
              value={formData.physicalAddress}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Correspondence Address (Town/Village)"
              name="correspondenceAddress"
              value={formData.correspondenceAddress}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="cellNumber"
              value={formData.cellNumber}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="B H.P.C Registration Number"
              name="BHPCRegistrationNumber"
              value={formData.BHPCRegistrationNumber}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Private Practice Number"
              name="privatePracticeNumber"
              value={formData.privatePracticeNumber}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
              required
              InputLabelProps={{
                sx: {
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              }}
            />

            {/* Attachments Field */}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                htmlFor="attachments-upload"
              >
                Choose File
                <input
                  id="attachments-upload"
                  type="file"
                  name="attachments"
                  hidden
                  onChange={handleChange}
                />
              </Button>
              <Typography variant="body2" color="textSecondary">
                {formData.attachments ? formData.attachments.name : 'No file chosen'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              borderRadius: 2,
              px: 4,
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={8000}
        onClose={() => setSuccessOpen(false)}
        message="Registration successful. Please check your email for login details."
      />

      <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default RegistrationForm; 