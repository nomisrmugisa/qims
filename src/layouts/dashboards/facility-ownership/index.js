/**
=========================================================
* Otis Admin PRO - v2.0.2
=========================================================

* Product Page: https://material-ui.com/store/items/otis-admin-pro-material-dashboard-react/
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

// Otis Admin PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Otis Admin PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function FacilityOwnership() {
  const [events, setEvents] = useState([]);
  const [dataValues, setDataValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const username = process.env.REACT_APP_API_USERNAME;
  const password = process.env.REACT_APP_API_PASSWORD;
  const credentials = btoa(`${username}:${password}`);

  const trackedEntityInstanceId = "ASfKU6xlu8F";
  const programId = "EE8yeLVo6cN";
  const url = `https://qimsdev.5am.co.bw/qims/api/trackedEntityInstances/${trackedEntityInstanceId}.json?program=${programId}&fields=*`;

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
        const allDataValues = fetchedEvents.flatMap((event) => event.dataValues || []);
        setDataValues(allDataValues);
        setIsLoading(false);
        console.log("data", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [url, credentials]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDTypography variant="h4" gutterBottom>
              Facility Ownership
            </MDTypography>
          </Grid>

          {/* Events Table */}
          <Grid item xs={12}>
            <MDTypography variant="h5" gutterBottom>
              Events
            </MDTypography>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Event ID</TableCell>
                    <TableCell align="center">Program</TableCell>
                    <TableCell align="center">Org Unit</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Report Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        {isLoading ? "Loading..." : "No events found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow key={event.event}>
                        <TableCell align="center">{event.event}</TableCell>
                        <TableCell align="center">{event.program}</TableCell>
                        <TableCell align="center">{event.orgUnitName}</TableCell>
                        <TableCell align="center">{event.status}</TableCell>
                        <TableCell align="center">{event.dueDate}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* DataValues Table */}
          <Grid item xs={12}>
            <MDTypography variant="h5" gutterBottom>
              Data Values
            </MDTypography>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Data Element</TableCell>
                    <TableCell align="center">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataValues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        {isLoading ? "Loading..." : "No data values found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataValues.map((dataValue) => (
                      <TableRow key={`${dataValue.dataElement}-${dataValue.value}`}>
                        <TableCell align="center">{dataValue.dataElement}</TableCell>
                        <TableCell align="center">{dataValue.value}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FacilityOwnership;
