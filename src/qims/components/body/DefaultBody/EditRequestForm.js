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
        location: request.dataValues.find(dv => dv.dataElement === 'VJzk8OdFJKA')?.value || ''
    });

    const [checklist, setChecklist] = useState({
        accepted: request.dataValues.find(dv => dv.dataElement === 'jV5Y8XOfkgb')!== undefined,
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

    const handleSubmit = async () => {
        try {
            // Prepare the payload
            const payload = {
                events: [{
                    trackedEntityInstance: "Kljh56Desq1",
                    event: request.event, // Make sure this matches the event ID
                    status: "ACTIVE",
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
                        { dataElement: "jV5Y8XOfkgb", value: checklist.accepted?  "true" : null },
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
            // Send the request
            const API_URL = 'https://qimsdev.5am.co.bw/qims/api/40/tracker?async=false&importStrategy=UPDATE';
            const USERNAME = 'admin';
            const PASSWORD = '5Am53808053@';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`)
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
                            label="Correspondence Address"
                            name="correspondenceAddress"
                            value={formData.correspondenceAddress}
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