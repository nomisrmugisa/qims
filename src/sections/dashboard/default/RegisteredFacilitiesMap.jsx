import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

// assets
import HospitalIcon from '@mui/icons-material/LocalHospital';
import ClinicIcon from '@mui/icons-material/MedicalServices';
import MorgueIcon from '@mui/icons-material/Coronavirus';
import HealthCenterIcon from '@mui/icons-material/Healing';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import NavigationIcon from '@mui/icons-material/Navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// Facilities data with coordinates
const facilitiesData = [
  { 
    name: 'Gaborone Hospital', 
    checked: false, 
    type: 'hospital',
    lat: -24.6282,
    lng: 25.9231,
    region: 'South-East'
  },
  { 
    name: 'Francistown Clinic', 
    checked: true, 
    type: 'clinic',
    lat: -21.1671,
    lng: 27.5094,
    region: 'North-East'
  },
  { 
    name: 'Maun Health Center', 
    checked: true, 
    type: 'health-center',
    lat: -19.9835,
    lng: 23.4164,
    region: 'North-West'
  },
  { 
    name: 'Serowe Morgue', 
    checked: true, 
    type: 'morgue',
    lat: -22.3833,
    lng: 26.7167,
    region: 'Central'
  }
];

const GoogleMapComponent = ({ facilities }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Initialize map centered on Botswana
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: -22.0, lng: 24.0 }, // Center of Botswana
        mapTypeId: 'roadmap',
      });

      mapInstanceRef.current = map;
      addMarkers(map, facilities);
    };

    const addMarkers = (map, facilities) => {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      facilities.forEach(facility => {
        if (!facility.checked) return; // Only show checked facilities

        const marker = new window.google.maps.Marker({
          position: { lat: facility.lat, lng: facility.lng },
          map: map,
          title: facility.name,
          icon: getMarkerIcon(facility.type)
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h4>${facility.name}</h4>
              <p>Type: ${facility.type.replace('-', ' ')}</p>
              <p>Region: ${facility.region}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    };

    const getMarkerIcon = (type) => {
      const colors = {
        hospital: '#f44336', // red
        clinic: '#2196f3',   // blue
        'health-center': '#4caf50', // green
        morgue: '#9c27b0'    // purple
      };
      
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${colors[type] || '#666'}" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(30, 30),
        anchor: new window.google.maps.Point(15, 30)
      };
    };

    loadGoogleMaps();

    return () => {
      // Cleanup markers on unmount
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Update markers when facilities change
  useEffect(() => {
    if (mapInstanceRef.current) {
      addMarkers(mapInstanceRef.current, facilities);
    }
  }, [facilities]);

  return (
    <Box 
      ref={mapRef}
      sx={{ 
        width: '100%', 
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: 1
      }}
    />
  );
};

export default function RegisteredFacilitiesMap() {
  const [facilities, setFacilities] = React.useState(facilitiesData);

  const handleFacilityToggle = (index) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index].checked = !updatedFacilities[index].checked;
    setFacilities(updatedFacilities);
  };

  return (
    <Box>
      {/* Facility Type Chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
        <Chip icon={<HospitalIcon />} label="Hospitals" variant="outlined" />
        <Chip icon={<ClinicIcon />} label="Clinics" variant="outlined" />
        <Chip icon={<HealthCenterIcon />} label="Health Centers" variant="outlined" />
        <Chip icon={<MorgueIcon />} label="Morgues" variant="outlined" />
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Interactive Google Map */}
      <GoogleMapComponent facilities={facilities} />
      
      <Divider sx={{ my: 2 }} />
      
      {/* Results Section */}
      <Typography variant="h6" gutterBottom>
        Results
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MonitorHeartIcon color="primary" />
            <Typography>Monitoring of Health</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <NavigationIcon color="primary" />
            <Typography>Navigation</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DashboardIcon color="primary" />
            <Typography>Dashboard</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ManageAccountsIcon color="primary" />
            <Typography>Management</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AssignmentIcon color="primary" />
            <Typography>Results</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PeopleIcon color="primary" />
            <Typography>Users</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FactCheckIcon color="primary" />
            <Typography>Inspections</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AssignmentIcon color="primary" />
            <Typography>Forms</Typography>
          </Stack>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Facilities List */}
      <Typography variant="h6" gutterBottom>
        Facilities by Region
      </Typography>
      <List dense>
        {facilities.map((facility, index) => (
          <ListItem key={index} disablePadding>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={facility.checked}
                onChange={() => handleFacilityToggle(index)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={facility.name} secondary={facility.region} />
            <Chip 
              icon={facility.type === 'hospital' ? <HospitalIcon /> : 
                    facility.type === 'clinic' ? <ClinicIcon /> : 
                    facility.type === 'health-center' ? <HealthCenterIcon /> : <MorgueIcon />}
              size="small"
              variant="outlined"
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Regions */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        <Chip label="South-East" variant="outlined" />
        <Chip label="North-East" variant="outlined" />
        <Chip label="Central" variant="outlined" />
        <Chip label="North-West" variant="outlined" />
      </Stack>
    </Box>
  );
}

RegisteredFacilitiesMap.propTypes = {
  // Add any prop types if needed
};