import React, { useState } from 'react';
import { Box, Typography, styled, Divider } from '@mui/material';
import InspectorAssignment from './inspectorAssignment';
import InspectionReports from './inspectionReports';

const StepContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const Step = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '& .step-number': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
    color: active ? theme.palette.common.white : theme.palette.text.primary,
    marginRight: theme.spacing(1),
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  '& .step-title': {
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: active ? 'bold' : 'normal',
    marginRight: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  width: '280px',
  borderBottomWidth: 2,
  borderColor: theme.palette.divider,
  margin: '0 8px',
  alignSelf: 'center',
}));

export default function InspectionsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    { number: 1, title: 'Inspection Requests & Assignments', component: <InspectorAssignment /> },
    { number: 2, title: 'Inspection Reports', component: <InspectionReports /> },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Inspections Management
      </Typography>
      
      <StepContainer>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <Step 
              active={activeTab === index}
              onClick={() => setActiveTab(index)}
            >
              <span className="step-number">{step.number}</span>
              <Typography variant="subtitle1" className="step-title">
                {step.title}
              </Typography>
            </Step>
            {index < steps.length - 1 && <StyledDivider />}
          </React.Fragment>
        ))}
      </StepContainer>

      {steps[activeTab].component}
    </Box>
  );
}