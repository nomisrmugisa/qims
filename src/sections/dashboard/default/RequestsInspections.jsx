import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from 'components/MainCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// time period options
const timePeriods = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'week',
    label: 'This Week'
  },
  {
    value: 'month',
    label: 'This Month'
  }
];

// Sample data for the chart
const chartData = [
  { name: 'Jan', requests: 120, inspections: 80 },
  { name: 'Feb', requests: 190, inspections: 120 },
  { name: 'Mar', requests: 150, inspections: 90 },
  { name: 'Apr', requests: 180, inspections: 110 },
  { name: 'May', requests: 210, inspections: 140 },
  { name: 'Jun', requests: 240, inspections: 160 },
  { name: 'Jul', requests: 220, inspections: 150 },
  { name: 'Aug', requests: 200, inspections: 130 },
  { name: 'Sep', requests: 180, inspections: 110 },
  { name: 'Oct', requests: 160, inspections: 90 },
  { name: 'Nov', requests: 140, inspections: 70 },
  { name: 'Dec', requests: 120, inspections: 60 }
];

// ==============================|| REQUESTS VS INSPECTIONS CHART ||============================== //

export default function RequestsInspections() {
  const [timePeriod, setTimePeriod] = useState('month');

  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
          <Typography variant="h5">Requests vs Inspections</Typography>
        </Grid>
        <Grid item>
          <TextField
            select
            size="small"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
          >
            {timePeriods.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill="#8884d8" name="Requests" />
            <Bar dataKey="inspections" fill="#82ca9d" name="Inspections" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          <Box component="span" sx={{ color: '#8884d8', fontWeight: 'bold' }}>Requests: </Box>
          1,240 total
        </Typography>
        <Typography variant="subtitle1">
          <Box component="span" sx={{ color: '#82ca9d', fontWeight: 'bold' }}>Inspections: </Box>
          820 completed
        </Typography>
      </Stack>
    </MainCard>
  );
}