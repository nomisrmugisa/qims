import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TabsNavBar from "components/TabsNavBar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 14,
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#e3f2fd",
    cursor: "pointer",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function FacilityOwnership() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const username = process.env.REACT_APP_API_USERNAME;
  const password = process.env.REACT_APP_API_PASSWORD;
  const credentials = btoa(`${username}:${password}`);

  const trackedEntityInstanceId = "ASfKU6xlu8F";
  const programId = "EE8yeLVo6cN";
  const url = `https://qimsdev.5am.co.bw/qims/api/trackedEntityInstances/${trackedEntityInstanceId}.json?program=${programId}&fields=*`;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    eventDate: "",
    orgUnitName: "",
    firstName: "",
    surname: "",
    citizen: "",
  });

  useEffect(() => {
    fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        const fetchedEvents = data.enrollments?.[0]?.events || [];
        setEvents(fetchedEvents);
        setIsLoading(false);
        console.log("data", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [url, credentials]);

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setEditFormData({
      eventDate: event.eventDate || "",
      orgUnitName: event.orgUnitName || "",
      firstName: event.createdByUserInfo?.firstName || "",
      surname: event.createdByUserInfo?.surname || "",
      citizen: event.citizen || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`${url}/${selectedEvent.event}`, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...selectedEvent,
          eventDate: editFormData.eventDate,
          orgUnitName: editFormData.orgUnitName,
          createdByUserInfo: {
            ...selectedEvent.createdByUserInfo,
            firstName: editFormData.firstName,
            surname: editFormData.surname,
          },
          citizen: editFormData.citizen,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      // Update the events list with the edited data
      setEvents(
        events.map((event) =>
          event.event === selectedEvent.event ? { ...event, ...editFormData } : event
        )
      );

      handleCloseDialog();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TabsNavBar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox mb={3}>
              <MDTypography variant="h4" fontWeight="medium">
                Facility Ownership
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox
              sx={{
                backgroundColor: "white",
                borderRadius: "15px",
                p: 3,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table sx={{ minWidth: 650 }}>
                  {/* <TableHead> */}
                  <TableRow>
                    <StyledTableCell>Report Date</StyledTableCell>
                    <StyledTableCell>Organization Unit</StyledTableCell>
                    <StyledTableCell>First Name</StyledTableCell>
                    <StyledTableCell>Surname</StyledTableCell>
                    <StyledTableCell>Citizenship</StyledTableCell>
                  </TableRow>
                  {/* </TableHead> */}
                  <TableBody>
                    {events.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <MDTypography variant="body1" color="text">
                            {isLoading ? "Loading events..." : "No events found"}
                          </MDTypography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <StyledTableRow key={event.event} onClick={() => handleRowClick(event)}>
                          <TableCell>{event.eventDate}</TableCell>
                          <TableCell>{event.orgUnitName}</TableCell>
                          <TableCell>{event.createdByUserInfo?.firstName}</TableCell>
                          <TableCell>{event.createdByUserInfo?.surname}</TableCell>
                          <TableCell>
                            <MDTypography variant="body2" color="primary">
                              {event.citizen}
                            </MDTypography>
                          </TableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Event
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <MDBox display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Report Date"
              name="eventDate"
              value={editFormData.eventDate}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Organization Unit"
              name="orgUnitName"
              value={editFormData.orgUnitName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={editFormData.firstName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={editFormData.surname}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Citizenship"
              name="citizen"
              value={editFormData.citizen}
              onChange={handleInputChange}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default FacilityOwnership;
