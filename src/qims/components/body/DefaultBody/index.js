import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import "bootstrap/dist/css/bootstrap.min.css";
import woman from "assets/images/homepage/woman.jpg";

import * as React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import { Backdrop, CircularProgress } from "@mui/material";

import RequestsTable from "./RequestsTable";
import RequestDetails from "./RequestDetails";
import EditRequestForm from "./EditRequestForm";
import ManageUsers from "./ManageUsers";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const cards = [
  {
    id: 1,
    title: "New Facility",
    description:
      "Applying for New Services in Health Facility. It is an additional services in the existing facility.",
  },
  {
    id: 2,
    title: "Upgrade",
    description:
      "Authorization for Upgrade from one category of Health Facility to Another. It is a service requested by Private Health Facilities after fullfulling the requirements to change the category.",
  },
  {
    id: 3,
    title: "Inspection Request",
    description:
      "Request for Inspection of New Health Facility. This service is for an entity holding provisional authorization for the registration of a health facility. Inspections shall be conducted twice a year",
  },
  {
    id: 4,
    title: "Request to amment Staff list",
    description: "Request to Add Staff. This is done when there is a changing in staffing.",
  },
];

function DefaultBody() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    navigate("/qims/login");
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    email: "",
    username: "selfRegistrationTest11",
    password: "selfRegistration@123$",
    firstName: "",
    surname: "",
    cellNumber: "",
    professionalType: "",
    registrationNumber: "",
    locationInBotswana: "",
  });

  const [activeTab, setActiveTab] = useState('home');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [requests, setRequests] = useState([
    {
      date: '2025-05-20',
      status: 'Active',
      facilityName: 'evolewur',
      firstName: 'ssk',
      physicalAddress: '1jj3j4o',
      correspondenceAddress: 'Correspondence Address (Town/Village)',
      phoneNumber: '0777108323',
      email: 'nomisrmugisa@gmail.com',
      bhpcNumber: '7836498',
      privatePracticeNumber: '8327498759',
      location: 'Central Serowe',
      surname: 'SSKUG'
    },
    { date: '2025-05-19', status: 'Active' },
    { date: '2025-05-01', status: 'Active' },
    // Add more requests as needed
  ]);

  const [successOpen, setSuccessOpen] = useState(false);
  const username = process.env.REACT_APP_API_USERNAME;
  const password = process.env.REACT_APP_API_PASSWORD;

  const credentials = btoa(`${username}:${password}`);

  // create user profile
  const createUserProfile = async () => {
    const profilePayload = {
      username: formData.username,
      disabled: true,
      password: "selfRegistration@123$",
      accountExpiry: "2025-04-25",
      userRoles: [{ id: "aOxLneGCVvO" }],
      catDimensionConstraints: [],
      cogsDimensionConstraints: [],
      email: formData.email,
      firstName: formData.firstName,
      surname: formData.surname,
      phoneNumber: formData.cellNumber,
      whatsApp: "+2670777108323",
      twitter: "bhcpNumbet",
      organisationUnits: [{ id: "OVpBNoteQ2Y" }],
      dataViewOrganisationUnits: [],
      teiSearchOrganisationUnits: [],
      dataViewMaxOrganisationUnitLevel: null,
      userGroups: [],
      attributeValues: [],
    };

    const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/40/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(profilePayload),
    });

    const result = await response.json();

    if (response.status === 201) {
      console.log("User profile created!");
      return result.response?.uid; // <-- return the created user UID
    }
    console.error("Failed to create user profile");
    return null;
  };

  const sendLoginEmail = async (userId) => {
    const messagePayload = {
      subject: "Welcome to the System",
      text: `Hello ${formData.firstName},\n\nYour account has been created.\n\nUsername: ${formData.username}\nPassword: ${formData.password}\n\nPlease log in and change your password.`,
      users: [{ id: userId }],
      email: true,
    };

    const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/messageConversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(messagePayload),
    });

    if (response.ok) {
      console.log("Email sent successfully");
      return true;
    }
    console.error("Failed to send email");
    return false;
  };

  const changePassword = async () => {
    const passwordPayload = {
      oldPassword: "selfRegistration@123$",
      newPassword: "Nomisr123$",
    };

    const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/40/me/changePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(passwordPayload),
    });

    if (response.status === 202) {
      console.log("Password changed successfully");
      alert("Your password was changed. You can now log in.");
    } else {
      console.error("Failed to change password");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // registration
  const handleSubmit = async () => {
    setLoading(true); // Show loader

    const payload = {
      events: [
        {
          occurredAt: "2025-05-01",
          notes: [],
          program: "Y4W5qIKlOsh",
          programStage: "YzqtE5Uv8Qd",
          orgUnit: "OVpBNoteQ2Y",
          dataValues: [
            { dataElement: "ykwhsQQPVH0", value: formData.surname },
            { dataElement: "HMk4LZ9ESOq", value: formData.firstName },
            { dataElement: "VJzk8OdFJKA", value: formData.locationInBotswana },
            { dataElement: "D707dj4Rpjz", value: "Facility Name" },
            { dataElement: "dRkX5jmHEIM", value: "Physical Address" },
            { dataElement: "p7y0vqpP0W2", value: "Address (Town/Village)" },
            { dataElement: "SReqZgQk0RY", value: formData.cellNumber },
            { dataElement: "NVlLoMZbXIW", value: formData.email },
            { dataElement: "SVzSsDiZMN5", value: formData.registrationNumber },
            { dataElement: "aMFg2iq9VIg", value: formData.professionalType },
          ],
        },
      ],
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/40/tracker?async=false`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit registration");

      const userId = await createUserProfile();
      if (userId) {
        const emailSent = await sendLoginEmail(userId);

        if (emailSent) {
          setSuccessOpen(true);
          handleClose();
        } else {
          alert("User created but failed to send email.");
        }
      } else {
        alert("Form saved but user profile creation failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("There was an error submitting your request.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const [selectedCard, setSelectedCard] = React.useState(0);
  const theme = useTheme();
  // Media queries to match CSS breakpoints
  const isSm = useMediaQuery(theme.breakpoints.up("sm")); // 576px
  const isMd = useMediaQuery(theme.breakpoints.up("md")); // 768px
  const isLg = useMediaQuery(theme.breakpoints.up("lg")); // 992px

  // Determine max-width dynamically
  let maxWidth = "85%";
  if (isLg) maxWidth = "960px";
  else if (isMd) maxWidth = "720px";
  else if (isSm) maxWidth = "540px";

  return (
    <>
      <Grid container justifyContent="center" sx={{ my: 8, px: 2 }}>
        <Grid
          item
          xs={12}
          sx={{
            maxWidth,
            width: "85%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              mt: -16,
              width: "85%",
              overflowX: "hidden",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.3)", // semi-transparent white
              boxShadow: "none", // remove any default shadow
            }}
          >
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="container text-center">
                <div className="row g-0">
                  <div
                    className="col-md-12 d-flex align-items-center justify-content-between"
                    style={{ margin: "32px 0", paddingLeft: "16px", paddingRight: "16px" }}
                  >
                    <h5
                      className="card-title text-capitalize"
                      style={{
                        fontWeight: 650,
                        display: "block",
                        color: "#0096FF",
                        textAlign: "left",
                        fontSize: "24px",
                        margin: 0
                      }}
                    >
                      ADMIN PANEL
                    </h5>
                    <Button
                      onClick={() => window.open("https://qimsdev.5am.co.bw/qims/dhis-web-dashboard/#/", "_blank")}
                      sx={{
                        color: "#0096FF",
                        textTransform: "none",
                        fontSize: "16px",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Navigate to Main Dashboard
                    </Button>
                  </div>
                </div>

                <div className="card mb-3" style={{ maxWidth: "1440px" }}>


                  <div className="row g-0">
                    {/* Tabs Section */}
                    <div className="col-12">
                      <div className="d-flex">
                        {/* <Button
                          onClick={() => {
                            setActiveTab('home');
                            setSelectedRequest(null);
                            setEditingRequest(null);
                          }}
                          sx={{
                            backgroundColor: activeTab === 'home' ? '#e0e0e0' : 'transparent',
                            color: "#000",
                            borderRadius: 0,
                            paddingX: 3,
                            paddingY: 1,
                            boxShadow: "none",
                            borderBottom: activeTab === 'home' ? '2px solid #000' : 'none',
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                              boxShadow: "none",
                            },
                          }}
                        >
                          Home
                        </Button> */}
                        <Button
                          onClick={() => {
                            setActiveTab('requests');
                            setSelectedRequest(null);
                            setEditingRequest(null);
                          }}
                          sx={{
                            backgroundColor: activeTab === 'requests' ? '#e0e0e0' : 'transparent',
                            color: "#000",
                            borderRadius: 0,
                            paddingX: 3,
                            paddingY: 1,
                            boxShadow: "none",
                            borderBottom: activeTab === 'requests' ? '2px solid #000' : 'none',
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                              boxShadow: "none",
                            },
                          }}
                        >
                          Requests
                        </Button>
                        <Button
                          onClick={() => {
                            setActiveTab('users');
                            setSelectedRequest(null);
                            setEditingRequest(null);
                          }}
                          sx={{
                            backgroundColor: activeTab === 'users' ? '#e0e0e0' : 'transparent',
                            color: "#000",
                            borderRadius: 0,
                            paddingX: 3,
                            paddingY: 1,
                            boxShadow: "none",
                            borderBottom: activeTab === 'users' ? '2px solid #000' : 'none',
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                              boxShadow: "none",
                            },
                          }}
                        >
                          Manage Users
                        </Button>
                      </div>
                    </div>

                    {/* Home Tab Content */}
                    {/* {activeTab === 'home' && (
                      <>
                        <div className="col-md-7 d-flex align-items-center">
                          <div className="card-body">
                            <p
                              className="card-text text-justify"
                              style={{
                                color: "#000000",
                                textAlign: "left",
                                fontSize: "18px",
                              }}
                            >
                              The Health Facility Licensing Platform is an innovative system that
                              revolutionizes the licensing process for health facilities. It offers a
                              user-friendly solution, enhancing accessibility, transparency, and
                              efficiency. This platform reduces processing time, minimizes required
                              documentation, and eliminates physical visits to regulatory offices. With
                              real-time application tracking and seamless integrations, it sets a new
                              standard for transparency and accountability, improving healthcare service
                              delivery and ensuring regulatory compliance.
                              <br />
                              <Button
                                onClick={handleClickOpen}
                                sx={{
                                  mr: 4,
                                  mt: 2,
                                  backgroundColor: "#e0e0e0",
                                  color: "#000",
                                  borderRadius: 2,
                                  paddingX: 3,
                                  paddingY: 1,
                                  boxShadow: "none",
                                  "&:hover": {
                                    backgroundColor: "#d5d5d5",
                                    boxShadow: "none",
                                  },
                                }}
                              >
                                Register
                              </Button>
                              <Button
                                onClick={handleLogin}
                                sx={{
                                  mt: 2,
                                  backgroundColor: "#e0e0e0",
                                  color: "#000",
                                  borderRadius: 2,
                                  paddingX: 3,
                                  paddingY: 1,
                                  boxShadow: "none",
                                  "&:hover": {
                                    backgroundColor: "#d5d5d5",
                                    boxShadow: "none",
                                  },
                                }}
                              >
                                Login
                              </Button>
                            </p>
                          </div>
                        </div>

                        <div className="col-md-5" style={{ overflow: "hidden" }}>
                          <img src={woman} alt="Apple Icon" className="img-fluid" />
                        </div>
                      </>
                    )} */}

                    {/* Requests Tab Content */}
                    {/* {activeTab === 'requests' && (
                      <div className="col-12">
                        {!selectedRequest && !editingRequest && (
                          <RequestsTable
                            onRowClick={setSelectedRequest}
                            onEditClick={setEditingRequest}
                          />
                        )}

                        {selectedRequest && !editingRequest && (
                          <RequestDetails
                            request={selectedRequest}
                            onBack={() => setSelectedRequest(null)}
                            onEdit={setEditingRequest}
                          />
                        )}

                        {editingRequest && (
                          <EditRequestForm
                            request={editingRequest}
                            onSave={(updatedData) => {
                              // Handle save logic
                              console.log('Saved:', updatedData);
                              setEditingRequest(null);
                              setSelectedRequest(null);
                            }}
                            onCancel={() => {
                              if (selectedRequest) {
                                setEditingRequest(null);
                              } else {
                                setEditingRequest(null);
                                setSelectedRequest(null);
                              }
                            }}
                          />
                        )}
                      </div>
                    )} */}
                    {activeTab === 'requests' && (
                      <div className="col-12">
                        <h5
                          className="card-title text-capitalize"
                          style={{
                            fontWeight: 650,
                            display: "block",
                            color: "#0096FF",
                            textAlign: "left",
                            fontSize: "24px",
                            margin: "32px 0",
                            paddingLeft: "16px"
                          }}
                        >
                          Review Requests For Registration
                        </h5>
                        {!editingRequest && (
                          <RequestsTable
                            onRowClick={setSelectedRequest}
                            onEditClick={setEditingRequest}
                          />
                        )}

                        {editingRequest && (
                          <EditRequestForm
                            request={editingRequest}
                            onSave={(updatedData) => {
                              console.log('Saved:', updatedData);
                              setEditingRequest(null);
                            }}
                            onCancel={() => {
                              setEditingRequest(null);
                            }}
                          />
                        )}
                      </div>
                    )}

                    {activeTab === 'users' && (
                      <div className="col-12">
                        <ManageUsers />
                      </div>
                    )}
                  </div>


                </div>
              </div>

              <Box
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
                  gap: 2,
                }}
              >
                {cards.map((card, index) => (
                  <Card>
                    <CardActionArea
                      onClick={() => setSelectedCard(index)}
                      data-active={selectedCard === index ? "" : undefined}
                      sx={{
                        height: "100%",
                        "&[data-active]": {
                          backgroundColor: "action.selected",
                          "&:hover": {
                            backgroundColor: "action.selectedHover",
                          },
                        },
                      }}
                    >
                      <CardContent sx={{ height: "100%" }}>
                        <Typography variant="h5" component="div">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Card>

            <br />
            <br />
            <br />
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="container text-center">
                <div className="row g-0">
                  <div
                    className="col-md-12 d-flex align-items-left"
                    style={{ margin: "32px 0", paddingLeft: "16px", paddingRight: "16px" }}
                  >
                    <h5
                      className="card-title text-capitalize"
                      style={{
                        fontWeight: 650,
                        display: "block",
                        color: "#0096FF",
                        textAlign: "left",
                        fontSize: "24px",
                      }}
                    >
                      GOVERNMENT / PUBLIC FACILITY SURVEYS & ASSESSMENT
                    </h5>
                  </div>
                </div>
                <div className="card mb-3" style={{ maxWidth: "1440px" }}>
                  <div className="row g-0">
                    {/* Text Section */}
                    <div className="col-md-7 d-flex align-items-center">
                      <div className="card-body">
                        <p
                          className="card-text text-justify"
                          style={{
                            color: "#000000",
                            textAlign: "left",
                            fontSize: "18px",
                          }}
                        >
                          Health Facilty survey and assessment platform is to facilitate the
                          planning, execution, and reporting of health-related surveys and
                          assessments. The module supports national health assessments,
                          facility-based surveys, and specialized research studies conducted by the
                          HI, DHS, and other relevant stakeholders. It ensures that data collection
                          follows a standardized methodology, allowing for consistent analysis and
                          evidence-based decision-making.
                        </p>
                      </div>
                    </div>

                    {/* Image Section */}
                    <div className="col-md-5" style={{ overflow: "hidden" }}>
                      <img src={woman} alt="Apple Icon" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-0">
                <div className="col-md-12 d-flex align-items-center" />
              </div>
            </Card>
          </Card>
        </Grid>
      </Grid>

      {/* <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}> */}
      {/*  <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> */}
      {/*    Registration Form */}
      {/*  </DialogTitle> */}
      {/*  <IconButton */}
      {/*    aria-label="close" */}
      {/*    onClick={handleClose} */}
      {/*    sx={{ */}
      {/*      position: "absolute", */}
      {/*      right: 8, */}
      {/*      top: 8, */}
      {/*      color: theme.palette.grey[500], */}
      {/*    }} */}
      {/*  > */}
      {/*    <CloseIcon /> */}
      {/*  </IconButton> */}
      {/*  <DialogContent dividers> */}
      {/*    <Typography gutterBottom> */}
      {/*      <TextField fullWidth label="email" id="email" /> */}
      {/*    </Typography> */}
      {/*    <Typography gutterBottom> */}
      {/*      <TextField id="outlined-basic" label="username" variant="outlined" /> */}
      {/*      <TextField id="outlined-basic" label="password" variant="outlined" /> */}
      {/*    </Typography> */}
      {/*    <br /> */}
      {/*    <Typography gutterBottom> */}
      {/*      <TextField id="outlined-basic" label="FirstName" variant="outlined" /> */}
      {/*      <TextField id="outlined-basic" label="Surname" variant="outlined" /> */}
      {/*    </Typography> */}
      {/*    <Typography gutterBottom> */}
      {/*      <TextField id="outlined-basic" label="Cellnumber" variant="outlined" /> */}
      {/*    </Typography> */}
      {/*    <Typography gutterBottom> */}
      {/*      <TextField id="outlined-basic" label="Type of professional" variant="outlined" /> */}
      {/*    </Typography> */}
      {/*    <Typography gutterBottom> */}
      {/*      <TextField id="outlined-basic" label="Registration number" variant="outlined" /> */}
      {/*    </Typography> */}
      {/*  </DialogContent> */}
      {/*  <DialogActions> */}
      {/*    <Button autoFocus onClick={handleClose}> */}
      {/*      Save */}
      {/*    </Button> */}
      {/*  </DialogActions> */}
      {/* </BootstrapDialog> */}
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle
          sx={{ m: 0, p: 2, fontWeight: "bold", textAlign: "left" }}
          id="customized-dialog-title"
        >
          Registration Form
        </DialogTitle>

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

        <DialogContent dividers sx={{ px: 4 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
          />
          {/*<TextField*/}
          {/*  fullWidth*/}
          {/*  label="Username"*/}
          {/*  name="username"*/}
          {/*  value={formData.username}*/}
          {/*  onChange={handleChange}*/}
          {/*  variant="outlined"*/}
          {/*  margin="dense"*/}
          {/*  sx={{ backgroundColor: "#fff9c4" }}*/}
          {/*/>*/}

          {/*<TextField*/}
          {/*  fullWidth*/}
          {/*  label="Password"*/}
          {/*  type="password"*/}
          {/*  name="password"*/}
          {/*  value={formData.password}*/}
          {/*  onChange={handleChange}*/}
          {/*  variant="outlined"*/}
          {/*  margin="dense"*/}
          {/*  sx={{ backgroundColor: "#fff9c4" }}*/}
          {/*/>*/}

          <Box display="flex" gap={2} mt={1}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
            />
            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
            />
          </Box>

          <TextField
            fullWidth
            label="Cell Number"
            name="cellNumber"
            value={formData.cellNumber}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
          />

          <TextField
            fullWidth
            label="Type of Professional"
            name="professionalType"
            value={formData.professionalType}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
          />

          <TextField
            fullWidth
            label="Registration Number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
          />

          <TextField
            fullWidth
            label="Location in Botswana"
            name="locationInBotswana"
            value={formData.locationInBotswana}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
          />
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
      </BootstrapDialog>
      <Snackbar
        open={successOpen}
        autoHideDuration={8000}
        onClose={() => setSuccessOpen(false)}
        message="Request has been saved successfully. We will get back to you as soon as your request is processed. An email has been sent with a reference code."
      />
      <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default DefaultBody;
