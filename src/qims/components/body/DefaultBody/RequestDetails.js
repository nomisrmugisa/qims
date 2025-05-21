import React from 'react';
import { Button, Box, Typography, Divider, List, ListItem, ListItemText, Checkbox } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const RequestDetails = ({ request, onBack, onEdit }) => {
  const getDataValue = (dataElementId) => {
    return request.dataValues?.find(dv => dv.dataElement === dataElementId)?.value || 'N/A';
  };

  const getChecklistValue = (dataElementId) => {
    const value = request.dataValues?.find(dv => dv.dataElement === dataElementId)?.value;
    return value === 'true';
  };

  const isAccepted = getChecklistValue('jV5Y8XOfkgb');
  const isComplete = getChecklistValue('gMh3ZYRnTlb');
  const qualifiesForLetter = getChecklistValue('kP7rQwnufiY');
  const comments = getDataValue('p5kq4anYRdT');

  return (
    <div className="card">
      <div className="card-body">
        <Typography variant="h5" component="h2" gutterBottom>
          Event details
        </Typography>
        
        <Box mb={3}>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Basic info
          </Typography>
          <Typography variant="body1">
            <strong>Date of Request for Registration:</strong> {request.occurredAt.split('T')[0]}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="body1">
              <strong>Status:</strong> {request.status}
            </Typography>
            <Box ml={2} display="flex" alignItems="center">
              <Typography variant="body1">
                <strong>Accepted:</strong> 
              </Typography>
              {isAccepted ? (
                <CheckIcon color="success" sx={{ ml: 1 }} />
              ) : (
                <CloseIcon color="error" sx={{ ml: 1 }} />
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          User Request
        </Typography>
        
        <Box display="flex" flexWrap="wrap">
          <Box width={{ xs: '100%', sm: '50%' }} pr={2} mb={2}>
            <Typography variant="body1">
              <strong>Facility Name:</strong> {getDataValue('D707dj4Rpjz')}
            </Typography>
            <Typography variant="body1">
              <strong>First Name:</strong> {getDataValue('HMk4LZ9ESOq')}
            </Typography>
            <Typography variant="body1">
              <strong>Surname:</strong> {getDataValue('ykwhsQQPVH0')}
            </Typography>
            <Typography variant="body1">
              <strong>Physical Address:</strong> {getDataValue('dRkX5jmHEIM')}
            </Typography>
            <Typography variant="body1">
              <strong>Correspondence Address:</strong> {getDataValue('p7y0vqpP0W2')}
            </Typography>
          </Box>
          
          <Box width={{ xs: '100%', sm: '50%' }} pr={2} mb={2}>
            <Typography variant="body1">
              <strong>Phone Number:</strong> {getDataValue('SReqZgQk0RY')}
            </Typography>
            <Typography variant="body1">
              <strong>Email address:</strong> {getDataValue('NVlLoMZbXIW')}
            </Typography>
            <Typography variant="body1">
              <strong>B H PC Registration Number:</strong> {getDataValue('SVzSsDiZMN5')}
            </Typography>
            <Typography variant="body1">
              <strong>Private Practice Number:</strong> {getDataValue('aMFg2iq9VIg')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Checklist
        </Typography>
        
        <List dense sx={{ mb: 2 }}>
          <ListItem>
            <Checkbox
              edge="start"
              checked={getChecklistValue('Bz0oYRvSypS')}
              tabIndex={-1}
              disabled
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Application Letter valid" />
          </ListItem>
          <ListItem>
            <Checkbox
              edge="start"
              checked={getChecklistValue('fD7DQkmT1im')}
              tabIndex={-1}
              disabled
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Post Basic Qualification" />
          </ListItem>
          <ListItem>
            <Checkbox
              edge="start"
              checked={getChecklistValue('XcWt8b12E85')}
              tabIndex={-1}
              disabled
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Practice Valid" />
          </ListItem>
          <ListItem>
            <Checkbox
              edge="start"
              checked={getChecklistValue('lOpMngOe2yY')}
              tabIndex={-1}
              disabled
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Primary Qualification valid" />
          </ListItem>
          <ListItem>
            <Checkbox
              edge="start"
              checked={getChecklistValue('b8gm7x8JcLO')}
              tabIndex={-1}
              disabled
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Registration Valid" />
          </ListItem>
          <ListItem>
            <Checkbox
              edge="start"
              checked={qualifiesForLetter}
              tabIndex={-1}
              disabled
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Qualifies for letter of good standing" />
          </ListItem>
          <ListItem>
            <Checkbox
              edge="start"
              checked={isComplete}
              tabIndex={-1}
              disabled
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Complete event" />
          </ListItem>
        </List>

        {comments && (
          <>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Comments
            </Typography>
            <Box
              p={2}
              mb={2}
              border={1}
              borderColor="divider"
              borderRadius={1}
              bgcolor="background.paper"
            >
              <Typography variant="body1">{comments}</Typography>
            </Box>
          </>
        )}

        <Box mt={4}>
          <Button
            onClick={() => onEdit(request)}
            variant="contained"
            sx={{ mr: 2 }}
          >
            Edit Request
          </Button>
          <Button
            onClick={onBack}
            variant="outlined"
          >
            Back to List
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default RequestDetails;