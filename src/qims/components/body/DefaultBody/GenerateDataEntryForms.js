import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Typography,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';

const GenerateDataEntryForms = () => {
    const [loading, setLoading] = useState(false);
    const [dataElements, setDataElements] = useState([]);
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionDesc, setNewSectionDesc] = useState('');
    const [selectedDataElement, setSelectedDataElement] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formName, setFormName] = useState('');
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [newDataElement, setNewDataElement] = useState({
        name: '',
        valueType: 'TEXT',
        code: ''
    });
    const [previewMode, setPreviewMode] = useState(false);

    // Fetch data elements from DHIS2
    useEffect(() => {
        const fetchDataElements = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/dataElements`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data elements');
                }

                const data = await response.json();
                setDataElements(data.dataElements);
            } catch (error) {
                console.error('Error fetching data elements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataElements();
    }, []);

    // Load saved forms from localStorage (or API in production)
    useEffect(() => {
        const savedForms = localStorage.getItem('dataEntryForms');
        if (savedForms) {
            setForms(JSON.parse(savedForms));
        }
    }, []);

    const handleAddSection = () => {
        if (!newSectionName.trim()) return;

        const newSection = {
            id: Date.now().toString(),
            name: newSectionName,
            description: newSectionDesc,
            dataElements: []
        };

        setSections([...sections, newSection]);
        setNewSectionName('');
        setNewSectionDesc('');
    };

    const handleAddDataElement = () => {
        if (!selectedDataElement || !selectedSection) return;

        const sectionIndex = sections.findIndex(s => s.id === selectedSection);
        if (sectionIndex === -1) return;

        const element = dataElements.find(de => de.id === selectedDataElement);
        if (!element) return;

        const updatedSections = [...sections];
        updatedSections[sectionIndex].dataElements.push({
            id: element.id,
            name: element.displayName,
            valueType: element.valueType,
            code: element.code
        });

        setSections(updatedSections);
        setSelectedDataElement('');
    };

    const handleCreateNewDataElement = async () => {
        if (!newDataElement.name.trim() || !newDataElement.code.trim()) {
            setSuccessMessage('Please provide both name and code for the new data element');
            setOpenSnackbar(true);
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: newDataElement.name,
                shortName: newDataElement.name,
                code: newDataElement.code,
                valueType: newDataElement.valueType,
                domainType: 'AGGREGATE',
                aggregationType: 'SUM'
            };

            const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/dataElements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to create data element');
            }

            const result = await response.json();
            const createdElement = result.response;

            // Add to local state
            setDataElements([...dataElements, createdElement]);
            
            // If a section is selected, add to that section
            if (selectedSection) {
                const sectionIndex = sections.findIndex(s => s.id === selectedSection);
                if (sectionIndex !== -1) {
                    const updatedSections = [...sections];
                    updatedSections[sectionIndex].dataElements.push({
                        id: createdElement.uid,
                        name: createdElement.displayName,
                        valueType: createdElement.valueType,
                        code: createdElement.code
                    });
                    setSections(updatedSections);
                }
            }

            setNewDataElement({
                name: '',
                valueType: 'TEXT',
                code: ''
            });

            setSuccessMessage('Data element created and added successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error creating data element:', error);
            setSuccessMessage(`Error: ${error.message}`);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDataElement = (sectionId, elementId) => {
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1) return;

        const updatedSections = [...sections];
        updatedSections[sectionIndex].dataElements = updatedSections[sectionIndex].dataElements.filter(
            de => de.id !== elementId
        );

        setSections(updatedSections);
    };

    const handleRemoveSection = (sectionId) => {
        setSections(sections.filter(s => s.id !== sectionId));
    };

    const handleSaveForm = () => {
        if (!formName.trim() || sections.length === 0) {
            setSuccessMessage('Please provide a form name and at least one section');
            setOpenSnackbar(true);
            return;
        }

        const newForm = {
            id: Date.now().toString(),
            name: formName,
            sections: [...sections],
            createdAt: new Date().toISOString()
        };

        const updatedForms = [...forms, newForm];
        setForms(updatedForms);
        localStorage.setItem('dataEntryForms', JSON.stringify(updatedForms));

        setSuccessMessage('Form saved successfully!');
        setOpenSnackbar(true);
        setFormName('');
        setSections([]);
    };

    const handleLoadForm = (formId) => {
        const formToLoad = forms.find(f => f.id === formId);
        if (formToLoad) {
            setSelectedForm(formToLoad);
            setSections(formToLoad.sections);
            setFormName(formToLoad.name);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const renderInputField = (dataElement) => {
        switch (dataElement.valueType) {
            case 'TEXT':
            case 'LONG_TEXT':
                return (
                    <TextField
                        fullWidth
                        label={dataElement.name}
                        variant="outlined"
                        margin="normal"
                        multiline={dataElement.valueType === 'LONG_TEXT'}
                        rows={dataElement.valueType === 'LONG_TEXT' ? 4 : 1}
                    />
                );
            case 'NUMBER':
                return (
                    <TextField
                        fullWidth
                        label={dataElement.name}
                        variant="outlined"
                        margin="normal"
                        type="number"
                    />
                );
            case 'BOOLEAN':
                return (
                    <FormControlLabel
                        control={<Checkbox />}
                        label={dataElement.name}
                    />
                );
            case 'DATE':
                return (
                    <TextField
                        fullWidth
                        label={dataElement.name}
                        variant="outlined"
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                );
            default:
                return (
                    <TextField
                        fullWidth
                        label={dataElement.name}
                        variant="outlined"
                        margin="normal"
                    />
                );
        }
    };

    const togglePreviewMode = () => {
        setPreviewMode(!previewMode);
    };

    return (
        <div className="card">
            <div className="card-body">
                <Box mb={4}>
                    <Typography variant="h5" gutterBottom>
                        Generate Data Entry Forms
                    </Typography>

                    <Box display="flex" alignItems="center" mb={2}>
                        <TextField
                            label="Form Name"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{ mr: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveForm}
                            disabled={!formName } // || sections.length === 0
                            sx={{ mr: 2 }}
                        >
                            Save Form
                        </Button>
                        {sections.length > 0 && (
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<VisibilityIcon />}
                                onClick={togglePreviewMode}
                            >
                                {previewMode ? 'Edit Mode' : 'Preview Mode'}
                            </Button>
                        )}
                    </Box>

                    {forms.length > 0 && (
                        <Box mb={4}>
                            <Typography variant="subtitle1" gutterBottom>
                                Load Saved Form:
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel>Select a saved form</InputLabel>
                                <Select
                                    value={selectedForm?.id || ''}
                                    onChange={(e) => handleLoadForm(e.target.value)}
                                    label="Select a saved form"
                                >
                                    <MenuItem value="" disabled>
                                        Select a saved form
                                    </MenuItem>
                                    {forms.map(form => (
                                        <MenuItem key={form.id} value={form.id}>
                                            {form.name} - {new Date(form.createdAt).toLocaleDateString()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </Box>

                {!previewMode && (
                    <>
                        <Box mb={4}>
                            <Typography variant="h6" gutterBottom>
                                Add New Section
                            </Typography>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TextField
                                    label="Section Name"
                                    value={newSectionName}
                                    onChange={(e) => setNewSectionName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    sx={{ mr: 2 }}
                                />
                                <TextField
                                    label="Description (Optional)"
                                    value={newSectionDesc}
                                    onChange={(e) => setNewSectionDesc(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    sx={{ mr: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddSection}
                                    disabled={!newSectionName.trim()}
                                >
                                    Add Section
                                </Button>
                            </Box>
                        </Box>

                        <Box mb={4}>
                            <Typography variant="h6" gutterBottom>
                                Add Data Elements to Section
                            </Typography>
                            
                            {/* Existing Data Elements */}
                            <Box mb={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Select Existing Data Element:
                                </Typography>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <FormControl fullWidth sx={{ mr: 2 }}>
                                        <InputLabel >Select Data Element</InputLabel>
                                        <Select
                                            value={selectedDataElement}
                                            onChange={(e) => setSelectedDataElement(e.target.value)}
                                            label="Select Data Element"
                                        >
                                            <MenuItem value="" disabled>
                                                Select a data element
                                            </MenuItem>
                                            {dataElements.map(element => (
                                                <MenuItem key={element.id} value={element.id}>
                                                    {element.displayName} ({element.valueType})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth sx={{ mr: 2 }}>
                                        <InputLabel>Select Section</InputLabel>
                                        <Select
                                            value={selectedSection}
                                            onChange={(e) => setSelectedSection(e.target.value)}
                                            label="Select Section"
                                        >
                                            <MenuItem value="" disabled>
                                                Select a section
                                            </MenuItem>
                                            {sections.map(section => (
                                                <MenuItem key={section.id} value={section.id}>
                                                    {section.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddDataElement}
                                        disabled={!selectedDataElement || !selectedSection}
                                    >
                                        Add Element
                                    </Button>
                                </Box>
                            </Box>
                            
                            {/* Create New Data Element */}
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Create New Data Element:
                                </Typography>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <TextField
                                        label="Data Element Name"
                                        value={newDataElement.name}
                                        onChange={(e) => setNewDataElement({...newDataElement, name: e.target.value})}
                                        fullWidth
                                        margin="normal"
                                        sx={{ mr: 2 }}
                                    />
                                    <TextField
                                        label="Code"
                                        value={newDataElement.code}
                                        onChange={(e) => setNewDataElement({...newDataElement, code: e.target.value})}
                                        fullWidth
                                        margin="normal"
                                        sx={{ mr: 2 }}
                                    />
                                    <FormControl fullWidth sx={{ mr: 2 }}>
                                        <InputLabel>Value Type</InputLabel>
                                        <Select
                                            value={newDataElement.valueType}
                                            onChange={(e) => setNewDataElement({...newDataElement, valueType: e.target.value})}
                                            label="Value Type"
                                        >
                                            <MenuItem value="TEXT">Text</MenuItem>
                                            <MenuItem value="LONG_TEXT">Long Text</MenuItem>
                                            <MenuItem value="NUMBER">Number</MenuItem>
                                            <MenuItem value="BOOLEAN">Boolean</MenuItem>
                                            <MenuItem value="DATE">Date</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleCreateNewDataElement}
                                        disabled={!newDataElement.name.trim() || !newDataElement.code.trim()}
                                    >
                                        Create & Add
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}

                {sections.length > 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {previewMode ? 'Form Preview' : 'Form Builder'}
                        </Typography>
                        {sections.map(section => (
                            <Paper key={section.id} sx={{ mb: 4, p: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1">
                                        {section.name}
                                    </Typography>
                                    {!previewMode && (
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRemoveSection(section.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>
                                {section.description && (
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        {section.description}
                                    </Typography>
                                )}
                                <Divider sx={{ my: 2 }} />

                                {section.dataElements.length > 0 ? (
                                    <List>
                                        {section.dataElements.map(element => (
                                            <ListItem key={element.id}>
                                                {renderInputField(element)}
                                                {!previewMode && (
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() => handleRemoveDataElement(section.id, element.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                )}
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No data elements added to this section yet.
                                    </Typography>
                                )}
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* Loading Dialog */}
                <Dialog open={loading} onClose={() => { }}>
                    <DialogTitle>Processing</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <CircularProgress />
                            <Typography variant="body1" mt={2}>
                                Please wait...
                            </Typography>
                        </Box>
                    </DialogContent>
                </Dialog>

                {/* Success Snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

export default GenerateDataEntryForms;