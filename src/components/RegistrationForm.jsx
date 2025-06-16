import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Snackbar,
  Backdrop,
  CircularProgress,
  Typography,
  Alert,
  Stack,
  Dialog as ErrorDialog,
  DialogContent as ErrorDialogContent,
  DialogTitle as ErrorDialogTitle,
  DialogActions as ErrorDialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from '../config'; // Import API_URL

function RegistrationForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [userCreatedMessage, setUserCreatedMessage] = useState(false);
  const [registrationSubmittedMessage, setRegistrationSubmittedMessage] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const credentials = 'YWRtaW46NUFtNTM4MDgwNTNA';

  // Define a default password for new users
  const DEFAULT_PASSWORD = "selfRegistration@123$";

  const [formData, setFormData] = useState({
    BHPCRegistrationNumber: "",
    cellNumber: "",
    userName: "",
    dhisRegistrationCode: ""
  });

  // Function to generate a valid DHIS2 standard UID
  const generateDhis2Uid = () => {
    // DHIS2 UIDs are 11 characters
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uid = '';
    
    // First character should be a letter (DHIS2 convention)
    uid += alphabet[Math.floor(Math.random() * 52)]; // Only letters for first char
    
    // Generate the remaining 10 characters (can be letters or numbers)
    for (let i = 0; i < 10; i++) {
      uid += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    return uid;
  };

  const handleClickOpen = () => {
    // Generate a new DHIS2 UID when the form is opened
    setFormData(prev => ({
      ...prev,
      dhisRegistrationCode: generateDhis2Uid()
    }));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset all message states when closing the dialog
    setSuccessOpen(false);
    setUserCreatedMessage(false);
    setRegistrationSubmittedMessage(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle closing individual snackbars
  const handleUserCreatedClose = () => setUserCreatedMessage(false);
  const handleRegistrationSubmittedClose = () => setRegistrationSubmittedMessage(false);
  const handleSuccessClose = () => setSuccessOpen(false);

  const closeErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // 1. Create User Profile (switched to be first)
      const userPayload = {
        username: formData.userName,
        surname: "Place-Holder",
        firstName: "Place-Holder",
        password: "selfRegistration@123$",
        accountExpiry: null,
        userRoles: [{ id: "aOxLneGCVvO" }],
        organisationUnits: [{ id: "OVpBNoteQ2Y" }],
        twitter: formData.dhisRegistrationCode
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
        let errorData;
        
        try {
          // Try to parse the error response as JSON
          errorData = JSON.parse(errorText);
          
          // Check if it's a username already exists error
          if (errorData.httpStatusCode === 409 && 
              errorData.response && 
              errorData.response.errorReports && 
              errorData.response.errorReports.length > 0 &&
              errorData.response.errorReports[0].errorCode === "E4054" &&
              errorData.response.errorReports[0].errorProperty === "username") {
            
            // Extract the username from the error message
            const usernameMatch = errorData.response.errorReports[0].errorProperties && 
                                errorData.response.errorReports[0].errorProperties.length >= 2 ? 
                                errorData.response.errorReports[0].errorProperties[1] : 
                                formData.userName;
            
            setErrorMessage(`User with username "${usernameMatch}" already exists. Please choose a different username.`);
            setErrorDialogOpen(true);
            setLoading(false);
            return; // Stop the submission process
          }
          
          // For any other errors, throw the original error
          throw new Error(`Failed to create user profile: ${errorText}`);
        } catch (parseError) {
          // If JSON parsing fails, throw the original error text
          throw new Error(`Failed to create user profile: ${errorText}`);
        }
      }
      const userData = await userResponse.json();
      const userId = userData.response.uid;
      console.log("User profile created successfully! User ID:", userId);
      
      // Show user created success message
      setUserCreatedMessage(true);

      // 2. Submit Registration Data (Tracker Event) (now second)
      const trackerPayload = {
        events: [
          {
            event: formData.dhisRegistrationCode, // Use DHIS2 Registration Code as the eventID
            occurredAt: new Date().toISOString().split('T')[0],
            notes: [],
            program: "Y4W5qIKlOsh",
            programStage: "YzqtE5Uv8Qd",
            orgUnit: "OVpBNoteQ2Y", // Match the org unit used in user creation
            dataValues: [
              { dataElement: "SReqZgQk0RY", value: formData.cellNumber },
              { dataElement: "SVzSsDiZMN5", value: formData.BHPCRegistrationNumber },
              { dataElement: "g3J1CH26hSA", value: formData.userName },
              { dataElement: "EAi89g7IBjp", value: formData.dhisRegistrationCode }
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
      
      // Show registration submitted success message
      setRegistrationSubmittedMessage(true);

      // 3. Send Welcome Email (remains third)
      const emailPayload = {
        subject: "Welcome to the System",
        text: `Hello User,\n\nYour account has been created.\n\nUsername: ${formData.userName}\nPassword: ${DEFAULT_PASSWORD}\n\nPlease log in and change your password.`,
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

      // Show final success message and close dialog after delay
      setSuccessOpen(true);
      setTimeout(() => {
        handleClose();
      }, 4000);
    } catch (err) {
      console.error("Submission error:", err);
      // For errors not handled specifically above
      if (!errorDialogOpen) {
        alert(`There was an error submitting your request: ${err.message}`);
      }
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
          Application Form
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
              label="B.H.P.C License Number"
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
              label="DHIS2-Registration CODE"
              name="dhisRegistrationCode"
              value={formData.dhisRegistrationCode}
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

            {/* File upload section removed */}
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
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error dialog for user already exists */}
      <ErrorDialog 
        open={errorDialogOpen}
        onClose={closeErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <ErrorDialogTitle id="error-dialog-title">
          User Already Exists
        </ErrorDialogTitle>
        <ErrorDialogContent>
          <Typography variant="body1">
            {errorMessage}
          </Typography>
        </ErrorDialogContent>
        <ErrorDialogActions>
          <Button onClick={closeErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </ErrorDialogActions>
      </ErrorDialog>

      {/* Success messages */}
      <Snackbar
        open={userCreatedMessage}
        autoHideDuration={4000}
        onClose={handleUserCreatedClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
        >
          User profile created successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={registrationSubmittedMessage}
        autoHideDuration={4000}
        onClose={handleRegistrationSubmittedClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
        >
          Registration data submitted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={successOpen}
        autoHideDuration={8000}
        onClose={handleSuccessClose}
      >
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
        >
          Application successful. Please check your email for login details.
        </Alert>
      </Snackbar>

      <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default RegistrationForm; 