import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, TextField, Box, Collapse } from '@mui/material';

const EditRequestForm = ({ request, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        dateOfRequestforReg: new Date().toISOString().split('T')[0],
        facilityName: request.dataValues.find(dv => dv.dataElement === 'D707dj4Rpjz')?.value || '',
        firstName: request.dataValues.find(dv => dv.dataElement === 'HMk4LZ9ESOq')?.value || '',
        surname: request.dataValues.find(dv => dv.dataElement === 'ykwhsQQPVH0')?.value || '',
        email: request.dataValues.find(dv => dv.dataElement === 'NVlLoMZbXIW')?.value || '',
        phoneNumber: request.dataValues.find(dv => dv.dataElement === 'SReqZgQk0RY')?.value || '',
        physicalAddress: request.dataValues.find(dv => dv.dataElement === 'dRkX5jmHEIM')?.value || '',
        correspondenceAddress: request.dataValues.find(dv => dv.dataElement === 'p7y0vqpP0W2')?.value || '',
        bhpcNumber: request.dataValues.find(dv => dv.dataElement === 'SVzSsDiZMN5')?.value || '',
        privatePracticeNumber: request.dataValues.find(dv => dv.dataElement === 'aMFg2iq9VIg')?.value || '',
        location: request.dataValues.find(dv => dv.dataElement === 'VJzk8OdFJKA')?.value || '',
        tei: request.dataValues.find(dv => dv.dataElement === 'PdtizqOqE6Q')?.value || '',

    });

    const [checklist, setChecklist] = useState({
        accepted: request.dataValues.find(dv => dv.dataElement === 'jV5Y8XOfkgb') !== undefined,
        applicationLetterValid: request.dataValues.find(dv => dv.dataElement === 'Bz0oYRvSypS')?.value === 'true' || false,
        postBasicQualification: request.dataValues.find(dv => dv.dataElement === 'fD7DQkmT1im')?.value === 'true' || false,
        practiceValid: request.dataValues.find(dv => dv.dataElement === 'XcWt8b12E85')?.value === 'true' || false,
        primaryQualificationValid: request.dataValues.find(dv => dv.dataElement === 'lOpMngOe2yY')?.value === 'true' || false,
        registrationValid: request.dataValues.find(dv => dv.dataElement === 'b8gm7x8JcLO')?.value === 'true' || false,
        qualifiesForLetter: request.dataValues.find(dv => dv.dataElement === 'kP7rQwnufiY')?.value === 'true' || false,
        complete: request.dataValues.find(dv => dv.dataElement === 'gMh3ZYRnTlb')?.value === 'true' || false,
    });

    const [comments, setComments] = useState(
        request.dataValues.find(dv => dv.dataElement === 'p5kq4anYRdT')?.value || ''
    );

    const [allCheckboxesChecked, setAllCheckboxesChecked] = useState(false);
    const [showChecklist, setShowChecklist] = useState(checklist.accepted);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setShowChecklist(checklist.accepted);
    }, [checklist.accepted]);

    useEffect(() => {
        // Check if all checkboxes (except 'complete') are checked
        const {
            applicationLetterValid,
            postBasicQualification,
            practiceValid,
            primaryQualificationValid,
            registrationValid,
            qualifiesForLetter,
            accepted
        } = checklist;

        const allChecked = applicationLetterValid &&
            practiceValid &&
            registrationValid &&
            qualifiesForLetter;

        setAllCheckboxesChecked(allChecked);
    }, [checklist]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (name) => (e) => {
        setChecklist({ ...checklist, [name]: e.target.checked });
    };

    const handleCommentsChange = (e) => {
        setComments(e.target.value);
    };

    const generateTEIID = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 11; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const createOrgUnit = async (orgUnitId) => {
        try {
            const shortName = formData.facilityName.length > 40
                ? formData.facilityName.substring(0, 40)
                : formData.facilityName;

            const orgUnitPayload = {
                name: formData.facilityName,
                id: orgUnitId,
                shortName: shortName,
                openingDate: new Date().toISOString(),
                parent: {
                    id: formData.location
                }
            };

            // First API call to create schema
            const schemaResponse = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/29/schemas/organisationUnit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                },
                body: JSON.stringify(orgUnitPayload)
            });

            if (!schemaResponse.ok) {
                throw new Error('Failed to create organization unit schema');
            }

            // Second API call to create org unit
            const orgUnitResponse = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/29/organisationUnits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                },
                body: JSON.stringify(orgUnitPayload)
            });

            if (!orgUnitResponse.ok) {
                throw new Error('Failed to create organization unit');
            }

            return orgUnitId;
        } catch (error) {
            console.error('Error creating org unit:', error);
            throw error;
        }
    };

    const addOrgUnitToProgram = async (orgUnitId) => {
        try {
            const programs = [
                'EE8yeLVo6cN', 'Xje2ga2tJcA', 'QSQWCmnsQtG',
                'adbaKjLFtYH', 'fWc9nCmUjez', 'Y4W5qIKlOsh',
                'wlWC4vYeTzt', 'cghjivP9xA2'
            ];
    
            // Process all programs in parallel
            const results = await Promise.all(programs.map(async (programId) => {
                const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/programs/${programId}/organisationUnits`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    },
                    body: JSON.stringify({
                        additions: [{ id: orgUnitId }]
                    })
                });
    
                if (!response.ok) {
                    console.error(`Failed to add org unit to program ${programId}`);
                    return false;
                }
                return true;
            }));
    
            // Check if all operations were successful
            const allSuccess = results.every(result => result === true);
            if (!allSuccess) {
                throw new Error('Failed to add org unit to one or more programs');
            }
    
            return true;
        } catch (error) {
            console.error('Error adding org unit to programs:', error);
            throw error;
        }
    };

    // Add this new function to handle TEI creation/update
    const createOrUpdateTEI = async (orgUnitId) => {
        try {
            const teiPayload = {
                trackedEntityType: "uTTDt3fuXZK",
                orgUnit: orgUnitId,
                attributes: [
                    { attribute: "Ue8XNxxVKZs", value: formData.physicalAddress },
                    { attribute: "YRTNX6YvPlu", value: formData.email },
                    { attribute: "YiCio8ZTWNj", value: formData.facilityName },
                    { attribute: "ixWjABeTjHn", value: formData.phoneNumber },
                    { attribute: "vRUtkpMwzDW", value: orgUnitId }
                ]
            };

            let response;
            let newTei = formData.tei;

            if (!formData.tei) {
                // Create new TEI if it doesn't exist
                response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/trackedEntityInstances`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    },
                    body: JSON.stringify(teiPayload)
                });

                if (!response.ok) {
                    throw new Error('Failed to create tracked entity instance');
                }

                const result = await response.json();
                newTei = result.response.importSummaries[0].reference;

                // Update formData with the new TEI
                setFormData(prev => ({ ...prev, tei: newTei }));
            } else {
                // Update existing TEI
                response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/trackedEntityInstances/${formData.tei}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    },
                    body: JSON.stringify(teiPayload)
                });

                if (!response.ok) {
                    throw new Error('Failed to update tracked entity instance');
                }
            }

            return newTei;
        } catch (error) {
            console.error('Error in createOrUpdateTEI:', error);
            throw error;
        }
    };

    const createEnrollment = async (orgUnitId, programId, teiCalled) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/enrollments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                },
                body: JSON.stringify({
                    trackedEntityInstance: teiCalled,
                    program: programId,
                    status: "ACTIVE",
                    orgUnit: orgUnitId,
                    enrollmentDate: today,
                    incidentDate: today
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create enrollment for program ${programId}`);
            }

            return true;
        } catch (error) {
            console.error('Error creating enrollment:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            // Generate a new ID for org unit if complete is checked
            const orgUnitId = checklist.complete ? generateTEIID() : null;

            // Prepare the payload
            const payload = {
                events: [{
                    event: request.event, // Make sure this matches the event ID
                    status: checklist.complete ? "COMPLETED" : "ACTIVE",
                    program: request.program,
                    programStage: request.programStage,
                    enrollment: request.enrollment,
                    orgUnit: request.orgUnit,
                    orgUnitName: request.orgUnitName,
                    occurredAt: request.occurredAt,
                    followup: false,
                    deleted: false,
                    createdAt: request.createdAt,
                    updatedAt: new Date().toISOString(),
                    attributeCategoryOptions: request.attributeCategoryOptions,
                    createdBy: request.createdBy || {
                        uid: "M5zQapPyTZI",
                        username: "admin",
                        firstName: "admin",
                        surname: "admin"
                    },
                    updatedBy: {
                        uid: "M5zQapPyTZI",
                        username: "admin",
                        firstName: "admin",
                        surname: "admin"
                    },
                    notes: [],
                    scheduledAt: null,
                    geometry: null,
                    dataValues: [
                        { dataElement: 'D707dj4Rpjz', value: formData.facilityName },
                        { dataElement: 'HMk4LZ9ESOq', value: formData.firstName },
                        { dataElement: 'ykwhsQQPVH0', value: formData.surname },
                        { dataElement: 'NVlLoMZbXIW', value: formData.email },
                        { dataElement: 'SReqZgQk0RY', value: formData.phoneNumber },
                        { dataElement: 'dRkX5jmHEIM', value: formData.physicalAddress },
                        { dataElement: 'p7y0vqpP0W2', value: formData.correspondenceAddress },
                        { dataElement: 'SVzSsDiZMN5', value: formData.bhpcNumber },
                        { dataElement: 'aMFg2iq9VIg', value: formData.privatePracticeNumber },
                        { dataElement: 'VJzk8OdFJKA', value: formData.location },
                        { dataElement: "PdtizqOqE6Q", value: formData.tei },
                        { dataElement: "jV5Y8XOfkgb", value: checklist.accepted ? "true" : null },
                        // (checklist.accepted ? [{ dataElement: 'jV5Y8XOfkgb', value: "true" }] : []),
                        { dataElement: 'Bz0oYRvSypS', value: checklist.applicationLetterValid ? "true" : null },
                        { dataElement: 'fD7DQkmT1im', value: checklist.postBasicQualification ? "true" : null },
                        { dataElement: 'XcWt8b12E85', value: checklist.practiceValid ? "true" : null },
                        { dataElement: 'lOpMngOe2yY', value: checklist.primaryQualificationValid ? "true" : null },
                        { dataElement: 'b8gm7x8JcLO', value: checklist.registrationValid ? "true" : null },
                        { dataElement: 'kP7rQwnufiY', value: checklist.qualifiesForLetter ? "true" : null },
                        // { dataElement: 'gMh3ZYRnTlb', value: checklist.complete ? "true" : null }, - attachments
                        { dataElement: 'p5kq4anYRdT', value: comments || null }
                    ].filter(dv => dv.value !== null && dv.value !== undefined)
                }]
            };

            console.log('DHIS2 URL:', process.env.REACT_APP_DHIS2_URL);
            console.log('API URL:', `${process.env.REACT_APP_DHIS2_URL}/api/40/tracker?async=false&importStrategy=UPDATE`)

            // If complete is checked, perform the additional steps
            if (checklist.complete && orgUnitId) {
                // Step 2a: Create org unit
                await createOrgUnit(orgUnitId);

                // Step 2b: Add org unit to program
                await addOrgUnitToProgram(orgUnitId);

                // New Step: Create or Update TEI
                const updatedTei = await createOrUpdateTEI(orgUnitId);

                // Update the payload with the new TEI if it was created
                if (!formData.tei && updatedTei) {
                    payload.events[0].dataValues = payload.events[0].dataValues.map(dv =>
                        dv.dataElement === "PdtizqOqE6Q" ? { ...dv, value: updatedTei } : dv
                    );
                }

                // Step 2c: Create enrollments for all programs
                const programs = [
                    'EE8yeLVo6cN', 'Xje2ga2tJcA', 'QSQWCmnsQtG',
                    'adbaKjLFtYH', 'fWc9nCmUjez', 'Y4W5qIKlOsh',
                    'wlWC4vYeTzt', 'cghjivP9xA2'
                ];

                for (const programId of programs) {
                    await createEnrollment(orgUnitId, programId , updatedTei);
                }
            }

            // Send the request
            const API_URL = `${process.env.REACT_APP_DHIS2_URL}/40/tracker?async=false&importStrategy=UPDATE`;
            const USERNAME = 'admin';
            const PASSWORD = '5Am53808053@';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`)
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to update request');
            }

            const result = await response.json();
            console.log('Update successful:', result);

            // Call the onSave callback with the updated data
            onSave({
                ...formData,
                checklist,
                comments
            });

        } catch (error) {
            console.error('Error updating request:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="mb-4">Edit Request</h4>

                <div className="row">
                    <div className="col-md-6">
                        <TextField
                            label="Date of Request for Registration"
                            name="dateOfRequestforReg"
                            value={formData.dateOfRequestforReg}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Facility Name"
                            name="facilityName"
                            value={formData.facilityName}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Physical Address"
                            name="physicalAddress"
                            value={formData.physicalAddress}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Tracked Entity Instance"
                            name="tei"
                            value={formData.tei}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            label="Surname"
                            name="surname"
                            value={formData.surname}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="B H PC Registration Number"
                            name="bhpcNumber"
                            value={formData.bhpcNumber}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Private Practice Number"
                            name="privatePracticeNumber"
                            value={formData.privatePracticeNumber}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>
                </div>
                {/* Accepted Checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checklist.accepted}
                            onChange={handleCheckboxChange('accepted')}
                        />
                    }
                    label="Accepted"
                />

                <Collapse in={showChecklist}>

                    <h5 className="mt-4">Checklist</h5>
                    <Box display="flex" flexWrap="wrap">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checklist.applicationLetterValid}
                                    onChange={handleCheckboxChange('applicationLetterValid')}
                                />
                            }
                            label="Application Letter valid"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checklist.postBasicQualification}
                                    onChange={handleCheckboxChange('postBasicQualification')}
                                />
                            }
                            label="Post Basic Qualification"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checklist.practiceValid}
                                    onChange={handleCheckboxChange('practiceValid')}
                                />
                            }
                            label="Practice Valid"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checklist.primaryQualificationValid}
                                    onChange={handleCheckboxChange('primaryQualificationValid')}
                                />
                            }
                            label="Primary Qualification valid"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checklist.registrationValid}
                                    onChange={handleCheckboxChange('registrationValid')}
                                />
                            }
                            label="Registration Valid"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checklist.qualifiesForLetter}
                                    onChange={handleCheckboxChange('qualifiesForLetter')}
                                />
                            }
                            label="Qualifies for letter of good standing"
                        />
                    </Box>

                    <TextField
                        label="Comments"
                        name="comments"
                        value={comments}
                        onChange={handleCommentsChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checklist.complete}
                                onChange={handleCheckboxChange('complete')}
                                disabled={!allCheckboxesChecked}
                            />
                        }
                        label="Complete event"
                    />

                    <Box mt={4}>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            sx={{ mr: 2 }}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={onCancel}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                    </Box>
                </Collapse>
            </div>
        </div>
    );
};

export default EditRequestForm;