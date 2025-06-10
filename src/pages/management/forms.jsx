import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import FormManager from './formsManager';

export default function FormsPage() {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <Box>
      {/* <Typography variant="h4" sx={{ mb: 3 }}>Forms Management</Typography> */}
      
      <FormManager 
        form={activeForm}
        onSave={(updatedData) => {
          console.log('Saved:', updatedData);
          setActiveForm(null);
        }}
        onCancel={() => setActiveForm(null)}
      />
    </Box>
  );
}