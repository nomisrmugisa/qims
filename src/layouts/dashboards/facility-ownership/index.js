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

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    eventDate: "",
    orgUnitName: "",
    firstName: "",
    surname: "",
    citizen: "",
    ownershipType: "",
    idType: "",
    id: "",
    copyOfIdPassport: null,
    professionalReference1: null,
    professionalReference2: null,
    qualificationCertificates: null,
    validRecentPermit: null,
    workPermitWaiver: null,
    companyRegistrationDocuments: null,
  });

  // For dev purposes, use this org unit ID
  const orgUnitId = "tpoMlXpihim";
  const url = `https://qimsdev.5am.co.bw/qims/api/trackedEntityInstances?ou=${orgUnitId}&ouMode=SELECTED&program=EE8yeLVo6cN&fields=*&paging=false`;

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
        // data.trackedEntityInstances is an array
        // Each instance may have enrollments, each with events
        let fetchedEvents = [];
        if (Array.isArray(data.trackedEntityInstances)) {
          data.trackedEntityInstances.forEach((instance) => {
            if (Array.isArray(instance.enrollments)) {
              instance.enrollments.forEach((enrollment) => {
                if (Array.isArray(enrollment.events)) {
                  fetchedEvents = fetchedEvents.concat(enrollment.events);
                }
              });
            }
          });
        }
        // Filter events to only those with the desired programStage
        const filteredEvents = fetchedEvents.filter(
          (event) => event.programStage === "MuJubgTzJrY"
        );
        setEvents(filteredEvents);
        setIsLoading(false);
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
      firstName: event.dataValues?.find((dv) => dv.dataElement === "HMk4LZ9ESOq")?.value || event.createdByUserInfo?.firstName || "",
      surname: event.dataValues?.find((dv) => dv.dataElement === "ykwhsQQPVH0")?.value || event.createdByUserInfo?.surname || "",
      citizen: event.dataValues?.find((dv) => dv.dataElement === "zVmmto7HwOc")?.value || event.citizen || "",
      ownershipType: event.dataValues?.find((dv) => dv.dataElement === "vAHHXaW0Pna")?.value || event.ownershipType || "",
      idType: event.dataValues?.find((dv) => dv.dataElement === "FLcrCfTNcQi")?.value || event.idType || "",
      id: event.dataValues?.find((dv) => dv.dataElement === "aUGSyyfbUVI")?.value || event.id || "",
      copyOfIdPassport: event.dataValues?.find((dv) => dv.dataElement === "KRj1TOR5cVM")?.value || null,
      professionalReference1: event.dataValues?.find((dv) => dv.dataElement === "yP49GKSQxPl")?.value || null,
      professionalReference2: event.dataValues?.find((dv) => dv.dataElement === "lC217zTgC6C")?.value || null,
      qualificationCertificates: event.dataValues?.find((dv) => dv.dataElement === "pelCBFPIFY1")?.value || null,
      validRecentPermit: event.dataValues?.find((dv) => dv.dataElement === "cUObXSGtCuD")?.value || null,
      workPermitWaiver: event.dataValues?.find((dv) => dv.dataElement === "g9jXH9LJyxU")?.value || null,
      companyRegistrationDocuments: event.dataValues?.find((dv) => dv.dataElement === "fSGzyNOvsn3")?.value || null,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleUpdate = async () => {
    if (!selectedEvent) return;

    try {
      // 1. Upload files and get fileResourceIds
      const uploadFileAndGetId = async (file) => {
        if (!file) return null;
        const fileData = new FormData();
        fileData.append("file", file);
        const fileRes = await fetch("https://qimsdev.5am.co.bw/qims/api/fileResources", {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
          },
          body: fileData,
        });
        const fileJson = await fileRes.json();
        return fileJson.response.fileResource.id;
      };

      // Upload all files in parallel
      const [
        copyOfIdPassportId,
        professionalReference1Id,
        professionalReference2Id,
        qualificationCertificatesId,
        validRecentPermitId,
        workPermitWaiverId,
        companyRegistrationDocumentsId
      ] = await Promise.all([
        uploadFileAndGetId(editFormData.copyOfIdPassport),
        uploadFileAndGetId(editFormData.professionalReference1),
        uploadFileAndGetId(editFormData.professionalReference2),
        uploadFileAndGetId(editFormData.qualificationCertificates),
        uploadFileAndGetId(editFormData.validRecentPermit),
        uploadFileAndGetId(editFormData.workPermitWaiver),
        uploadFileAndGetId(editFormData.companyRegistrationDocuments),
      ]);

      // 2. Build dataValues array with all fields and correct dataElement IDs
      const dataValues = [
        { dataElement: "HMk4LZ9ESOq", value: editFormData.firstName }, // First Name
        { dataElement: "ykwhsQQPVH0", value: editFormData.surname }, // Surname
        { dataElement: "zVmmto7HwOc", value: editFormData.citizen }, // Citizenship
        { dataElement: "aUGSyyfbUVI", value: editFormData.id }, // ID
        { dataElement: "FLcrCfTNcQi", value: editFormData.idType }, // ID Type
        { dataElement: "vAHHXaW0Pna", value: editFormData.ownershipType }, // Type of ownership
      ];
      if (copyOfIdPassportId) dataValues.push({ dataElement: "KRj1TOR5cVM", value: copyOfIdPassportId });
      if (professionalReference1Id) dataValues.push({ dataElement: "yP49GKSQxPl", value: professionalReference1Id });
      if (professionalReference2Id) dataValues.push({ dataElement: "lC217zTgC6C", value: professionalReference2Id });
      if (qualificationCertificatesId) dataValues.push({ dataElement: "pelCBFPIFY1", value: qualificationCertificatesId });
      if (validRecentPermitId) dataValues.push({ dataElement: "cUObXSGtCuD", value: validRecentPermitId });
      if (workPermitWaiverId) dataValues.push({ dataElement: "g9jXH9LJyxU", value: workPermitWaiverId });
      if (companyRegistrationDocumentsId) dataValues.push({ dataElement: "fSGzyNOvsn3", value: companyRegistrationDocumentsId });

      // 3. Build event update payload
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const eventUpdatePayload = {
        event: selectedEvent.event,
        eventDate: today,
        orgUnit: selectedEvent.orgUnit,
        program: "EE8yeLVo6cN",
        programStage: "MuJubgTzJrY",
        status: "ACTIVE",
        trackedEntityInstance: "ASfKU6xlu8F",
        dataValues,
      };

      // 4. Send event update as JSON
      const response = await fetch("https://qimsdev.5am.co.bw/qims/api/events?", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventUpdatePayload),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const fileInput = e.target;
    if (fileInput.files.length > 0) {
      const fileData = new FormData();
      fileData.append("file", fileInput.files[0]);
      const fileRes = await fetch("https://qimsdev.5am.co.bw/qims/api/fileResources", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        body: fileData,
      });
      const fileJson = await fileRes.json();
      const fileResourceId = fileJson.response.fileResource.id;

      // Now you can use fileResourceId to update your event
      // This is a placeholder and should be replaced with actual implementation
      console.log("File uploaded successfully. File Resource ID:", fileResourceId);
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
                  <TableRow>
                    <StyledTableCell>Report Date</StyledTableCell>
                    <StyledTableCell>Organization Unit</StyledTableCell>
                    <StyledTableCell>First Name</StyledTableCell>
                    <StyledTableCell>Surname</StyledTableCell>
                    <StyledTableCell>Citizenship</StyledTableCell>
                    <StyledTableCell>Program Stage ID</StyledTableCell>
                    <StyledTableCell>Event ID</StyledTableCell>
                    <StyledTableCell>Tracked Entity Instance ID</StyledTableCell>
                  </TableRow>
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
                          <TableCell>{event.dataValues?.find((dv) => dv.dataElement === "HMk4LZ9ESOq")?.value || ""}</TableCell>
                          <TableCell>{event.dataValues?.find((dv) => dv.dataElement === "ykwhsQQPVH0")?.value || ""}</TableCell>
                          <TableCell>{event.dataValues?.find((dv) => dv.dataElement === "zVmmto7HwOc")?.value || ""}</TableCell>
                          <TableCell>{event.programStage}</TableCell>
                          <TableCell>{event.event}</TableCell>
                          <TableCell>{event.trackedEntityInstance}</TableCell>
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
              select
              label="Type of ownership"
              name="ownershipType"
              value={editFormData.ownershipType}
              onChange={handleInputChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Type</option>
              <option value="Private Owned">Private Owned</option>
              <option value="Public Owned">Public Owned</option>
              <option value="Other">Other</option>
            </TextField>
            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={editFormData.surname}
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
              label="Citizenship"
              name="citizen"
              value={editFormData.citizen}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="ID Type"
              name="idType"
              value={editFormData.idType}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="ID"
              name="id"
              value={editFormData.id}
              onChange={handleInputChange}
            />
            <MDTypography variant="caption" color="text" sx={{ mb: 0.5 }}>
              Copy of ID / Passport
            </MDTypography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {editFormData.copyOfIdPassport ? editFormData.copyOfIdPassport.name : "Upload file"}
              <input
                type="file"
                name="copyOfIdPassport"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <MDTypography variant="caption" color="text" sx={{ mb: 0.5 }}>
              Professional Reference 1
            </MDTypography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {editFormData.professionalReference1 ? editFormData.professionalReference1.name : "Upload file"}
              <input
                type="file"
                name="professionalReference1"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <MDTypography variant="caption" color="text" sx={{ mb: 0.5 }}>
              Professional Reference 2
            </MDTypography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {editFormData.professionalReference2 ? editFormData.professionalReference2.name : "Upload file"}
              <input
                type="file"
                name="professionalReference2"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <MDTypography variant="caption" color="text" sx={{ mb: 0.5 }}>
              Qualification Certificates
            </MDTypography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {editFormData.qualificationCertificates ? editFormData.qualificationCertificates.name : "Upload file"}
              <input
                type="file"
                name="qualificationCertificates"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <MDTypography variant="caption" color="text" sx={{ mb: 0.5 }}>
              Copy of Valid Recent Permit
            </MDTypography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {editFormData.validRecentPermit ? editFormData.validRecentPermit.name : "Upload file"}
              <input
                type="file"
                name="validRecentPermit"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <MDTypography variant="caption" color="text" sx={{ mb: 0.5 }}>
              Work Permit / Waiver
            </MDTypography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {editFormData.workPermitWaiver ? editFormData.workPermitWaiver.name : "Upload file"}
              <input
                type="file"
                name="workPermitWaiver"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <MDTypography variant="caption" color="text" sx={{ mb: 0.5 }}>
              Company Registration Documents
            </MDTypography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {editFormData.companyRegistrationDocuments ? editFormData.companyRegistrationDocuments.name : "Upload file"}
              <input
                type="file"
                name="companyRegistrationDocuments"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
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
