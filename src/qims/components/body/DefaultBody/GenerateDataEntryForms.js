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
    FormControlLabel,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    CardHeader,
    CardActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GenerateDataEntryForms = () => {
    const [loading, setLoading] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState(0);
    const [programs, setPrograms] = useState([]);
    const [programStages, setProgramStages] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedProgramStage, setSelectedProgramStage] = useState('');
    const [dataElements, setDataElements] = useState([]);
    const [selectedDataElements, setSelectedDataElements] = useState([]);
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionDesc, setNewSectionDesc] = useState('');
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

    // Fetch programs from DHIS2
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/programs`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch programs');
                }

                const data = await response.json();
                setPrograms(data.programs);
            } catch (error) {
                console.error('Error fetching programs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    // Fetch program stages when program is selected
    useEffect(() => {
        const fetchProgramStages = async () => {
            if (!selectedProgram) return;

            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/programStages`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch program stages');
                }

                const data = await response.json();
                setProgramStages(data.programStages);
            } catch (error) {
                console.error('Error fetching program stages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramStages();
    }, [selectedProgram]);

    // Fetch data elements when program stage is selected
    useEffect(() => {
        const fetchDataElements = async () => {
            if (!selectedProgramStage) return;

            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.REACT_APP_DHIS2_URL}/api/programStages/${selectedProgramStage}?fields=programStageDataElements[dataElement[id,name,code,valueType]]`,
                    {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data elements');
                }

                const data = await response.json();
                // Extract the data elements from programStageDataElements
                const elements = data.programStageDataElements.map(pde => ({
                    id: pde.dataElement.id,
                    displayName: pde.dataElement.name,
                    name: pde.dataElement.name,
                    code: pde.dataElement.code,
                    valueType: pde.dataElement.valueType
                }));

                setDataElements(elements);
            } catch (error) {
                console.error('Error fetching data elements:', error);
                setSuccessMessage(`Error fetching data elements: ${error.message}`);
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDataElements();
    }, [selectedProgramStage]);

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

    const handleAddDataElement = (element) => {
        setSelectedDataElements([...selectedDataElements, element]);
    };

    const handleRemoveDataElement = (element) => {
        setSelectedDataElements(selectedDataElements.filter(de => de.id !== element.id));
    };

    const handleAddAllDataElements = () => {
        setSelectedDataElements([...selectedDataElements, ...dataElements]);
    };

    const handleRemoveAllDataElements = () => {
        setSelectedDataElements([]);
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
            setSelectedDataElements([...selectedDataElements, createdElement]);

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
            programId: selectedProgram,
            programStageId: selectedProgramStage,
            sections: [...sections],
            dataElements: selectedDataElements,
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
            setSelectedProgram(formToLoad.programId);
            setSelectedProgramStage(formToLoad.programStageId);
            setSelectedDataElements(formToLoad.dataElements);
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

    const handleSubTabChange = (event, newValue) => {
        setActiveSubTab(newValue);
    };

    return (
        <div className="card">
            <div className="card-body">
                <Box mb={4}>
                    <Typography variant="h5" gutterBottom>
                        Generate Data Entry Forms
                    </Typography>

                    <Tabs value={activeSubTab} onChange={handleSubTabChange} sx={{ mb: 3 }}>
                        <Tab label="1. Select Program" />
                        <Tab label="2. Assign Data Elements" disabled={!selectedProgram} />
                        <Tab label="3. Create Form" disabled={!selectedProgramStage} />
                        <Tab label="4. Access" disabled={!selectedProgramStage} />
                    </Tabs>

                    {activeSubTab === 0 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Select Program and Program Stage
                            </Typography>
                            <Box display="flex" alignItems="center" mb={4}>
                                <FormControl fullWidth sx={{ mr: 2 }}>
                                    <InputLabel>Select Program</InputLabel>
                                    <Select
                                        value={selectedProgram}
                                        onChange={(e) => setSelectedProgram(e.target.value)}
                                        label="Select Program"
                                        style={{ height: '40px' }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select a program
                                        </MenuItem>
                                        {programs.map(program => (
                                            <MenuItem key={program.id} value={program.id}>
                                                {program.displayName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Select Program Stage</InputLabel>
                                    <Select
                                        value={selectedProgramStage}
                                        onChange={(e) => setSelectedProgramStage(e.target.value)}
                                        label="Select Program Stage"
                                        style={{ height: '40px' }}
                                        disabled={!selectedProgram}
                                    >
                                        <MenuItem value="" disabled>
                                            Select a program stage
                                        </MenuItem>
                                        {programStages.map(stage => (
                                            <MenuItem key={stage.id} value={stage.id}>
                                                {stage.displayName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setActiveSubTab(1)}
                                disabled={!selectedProgramStage}
                            >
                                Next: Assign Data Elements
                            </Button>
                        </Box>
                    )}

                    {activeSubTab === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Assign Data Elements
                            </Typography>

                            {/* Create New Data Element */}
                            <Box mb={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Create New Data Element:
                                </Typography>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <TextField
                                        label="Data Element Name"
                                        value={newDataElement.name}
                                        onChange={(e) => setNewDataElement({ ...newDataElement, name: e.target.value })}
                                        fullWidth
                                        margin="normal"
                                        sx={{ mr: 2 }}
                                    />
                                    <TextField
                                        label="Code"
                                        value={newDataElement.code}
                                        onChange={(e) => setNewDataElement({ ...newDataElement, code: e.target.value })}
                                        fullWidth
                                        margin="normal"
                                        sx={{ mr: 2 }}
                                    />
                                    <FormControl fullWidth sx={{ mr: 2 }}>
                                        <InputLabel>Value Type</InputLabel>
                                        <Select
                                            value={newDataElement.valueType}
                                            onChange={(e) => setNewDataElement({ ...newDataElement, valueType: e.target.value })}
                                            label="Value Type"
                                            style={{ height: '40px' }}
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

                            {/* Data Elements Selection */}
                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    <Card>
                                        <CardHeader
                                            title="Available Data Elements"
                                            action={
                                                <Button
                                                    size="small"
                                                    onClick={handleAddAllDataElements}
                                                    disabled={dataElements.length === 0}
                                                >
                                                    Add All
                                                </Button>
                                            }
                                        />
                                        <CardContent style={{ maxHeight: '400px', overflow: 'auto' }}>
                                            <List dense>
                                                {dataElements.map(element => (
                                                    <ListItem
                                                        key={element.id}
                                                        button
                                                        onClick={() => handleAddDataElement(element)}
                                                        selected={selectedDataElements.some(de => de.id === element.id)}
                                                    >
                                                        <ListItemText
                                                            primary={element.displayName}
                                                            secondary={`(${element.valueType})`}
                                                        />
                                                        <ArrowForwardIcon color="action" />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box display="flex" flexDirection="column">
                                        <Button
                                            variant="outlined"
                                            onClick={handleAddAllDataElements}
                                            disabled={dataElements.length === 0}
                                            sx={{ mb: 1 }}
                                        >
                                            All →
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={handleRemoveAllDataElements}
                                            disabled={selectedDataElements.length === 0}
                                        >
                                            ← All
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Card>
                                        <CardHeader
                                            title="Selected Data Elements"
                                            action={
                                                <Button
                                                    size="small"
                                                    onClick={handleRemoveAllDataElements}
                                                    disabled={selectedDataElements.length === 0}
                                                >
                                                    Remove All
                                                </Button>
                                            }
                                        />
                                        <CardContent style={{ maxHeight: '400px', overflow: 'auto' }}>
                                            <List dense>
                                                {selectedDataElements.map(element => (
                                                    <ListItem
                                                        key={element.id}
                                                        button
                                                        onClick={() => handleRemoveDataElement(element)}
                                                    >
                                                        <ArrowBackIcon color="action" />
                                                        <ListItemText
                                                            primary={element.displayName}
                                                            secondary={`(${element.valueType})`}
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Box mt={4} display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    onClick={() => setActiveSubTab(0)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setActiveSubTab(2)}
                                    disabled={selectedDataElements.length === 0}
                                >
                                    Next: Create Form
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {activeSubTab === 2 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Create Data Entry Form
                            </Typography>

                            <Box mb={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Form Details:
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
                                        disabled={!formName}
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

                            {!previewMode && (
                                <Box mb={4}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Add New Section:
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

                                            {selectedDataElements.length > 0 ? (
                                                <List>
                                                    {selectedDataElements.map(element => (
                                                        <ListItem key={element.id}>
                                                            {renderInputField(element)}
                                                            {!previewMode && (
                                                                <ListItemSecondaryAction>
                                                                    <IconButton
                                                                        edge="end"
                                                                        aria-label="delete"
                                                                        onClick={() => handleRemoveDataElement(element)}
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
                                                    No data elements added to this form yet.
                                                </Typography>
                                            )}
                                        </Paper>
                                    ))}
                                </Box>
                            )}

                            <Box mt={4} display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    onClick={() => setActiveSubTab(1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setActiveSubTab(3)}
                                    disabled={!formName || sections.length === 0}
                                >
                                    Next: Access
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {activeSubTab === 3 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Form Access Control
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Your form "{formName}" has been successfully created. You can now assign access permissions to user groups.
                            </Typography>
                            {/* Add access control components here */}
                            <Box mt={4} display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    onClick={() => setActiveSubTab(2)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setActiveSubTab(0)}
                                >
                                    Create Another Form
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>

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