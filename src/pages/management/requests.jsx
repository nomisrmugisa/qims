import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import RequestsTable from './requestsTable';
import RequestsEdit from './requestsEdit';

export default function RequestsPage() {
  const [editingRequest, setEditingRequest] = useState(null);

  return (
    <Box>
      {/* <Typography variant="h4" sx={{ mb: 3 }}>Requests Management</Typography> */}
      
      {!editingRequest ? (
        <RequestsTable onEditClick={setEditingRequest} />
      ) : (
        <RequestsEdit
          request={editingRequest}
          onSave={(updatedData) => {
            console.log('Saved:', updatedData);
            setEditingRequest(null);
          }}
          onCancel={() => setEditingRequest(null)}
        />
      )}
    </Box>
  );
}