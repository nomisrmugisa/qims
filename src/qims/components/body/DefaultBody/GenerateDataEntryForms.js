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
    const [formName, setFormName] = useState(''); // form key
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [newDataElement, setNewDataElement] = useState({
        name: '',
        valueType: 'TEXT',
        code: ''
    });
    const [previewMode, setPreviewMode] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [showNewDataElementForm, setShowNewDataElementForm] = useState(false);
    const [programStageSectionsList, setProgramStageSectionsList] = useState([]);

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
                const response = await fetch(
                    `${process.env.REACT_APP_DHIS2_URL}/api/programStages?fields=id,name,program[id,name]&paging=false`,
                    {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch program stages');
                }

                const data = await response.json();
                // Filter stages by selected program
                const filteredStages = data.programStages.filter(
                    stage => stage.program.id === selectedProgram
                );
                setProgramStages(filteredStages);
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
                // Extract the data elements from programStageDataElements and remove duplicates
                const elementsMap = new Map();
                data.programStageDataElements.forEach(pde => {
                    if (!elementsMap.has(pde.dataElement.id)) {
                        elementsMap.set(pde.dataElement.id, {
                            id: pde.dataElement.id,
                            displayName: pde.dataElement.name,
                            name: pde.dataElement.name,
                            code: pde.dataElement.code,
                            valueType: pde.dataElement.valueType,
                            added: false
                        });
                    }
                });

                const elements = Array.from(elementsMap.values());

                // Load previously selected elements from localStorage if available
                const savedForms = localStorage.getItem('dataEntryForms');
                let previouslySelected = [];
                if (savedForms) {
                    const parsedForms = JSON.parse(savedForms);
                    const formForThisStage = parsedForms.find(
                        form => form.programStageId === selectedProgramStage
                    );
                    if (formForThisStage) {
                        previouslySelected = formForThisStage.dataElements;
                    }
                }

                // Separate into available and selected based on previous state
                const selectedIds = new Set(previouslySelected.map(de => de.id));
                const availableElements = [];
                const selectedElements = [];

                elements.forEach(element => {
                    if (selectedIds.has(element.id)) {
                        selectedElements.push({ ...element, added: false });
                    } else {
                        availableElements.push(element);
                    }
                });

                setDataElements(availableElements);
                setSelectedDataElements(selectedElements);

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

    // Fetch program stage sections
    useEffect(() => {
        const fetchProgramStageSections = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_DHIS2_URL}/api/programStageSections.json?fields=id,name,programStage[id,name]&paging=false`,
                    {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch program stage sections');
                }

                const data = await response.json();
                setProgramStageSectionsList(data.programStageSections || []);
            } catch (error) {
                console.error('Error fetching program stage sections:', error);
            }
        };

        fetchProgramStageSections();
    }, []);

    // Load saved forms from localStorage (or API in production)
    // useEffect(() => {
    //     const savedForms = localStorage.getItem('dataEntryForms');
    //     if (savedForms) {
    //         const parsedForms = JSON.parse(savedForms);
    //         setForms(parsedForms);

    //         // Update selectedDataElements with 'added' status when loading a form
    //         if (selectedForm) {
    //             const updatedDEs = selectedDataElements.map(de => ({
    //                 ...de,
    //                 added: parsedForms.some(form =>
    //                     form.sections.some(section =>
    //                         section.dataElements.some(sde => sde.id === de.id)
    //                     )
    //                 )
    //             }));
    //             setSelectedDataElements(updatedDEs);
    //         }
    //     }
    // }, [selectedForm]);

    // useEffect(() => {
    //     const loadForms = async () => {
    //         try {
    //             setLoading(true);
    //             const loadedForms = await getAllFormsFromDataStore();
    //             setForms(loadedForms);
    //         } catch (error) {
    //             console.error('Error loading forms:', error);
    //             // Fallback to localStorage if needed
    //             // const savedForms = localStorage.getItem('dataEntryForms');
    //             // if (savedForms) {
    //             //     setForms(JSON.parse(savedForms));
    //             // }
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadForms();
    // }, []);

    // Replace the current useEffect for loading forms with this:
    useEffect(() => {
        const loadInitialForms = async () => {
            try {
                setLoading(true);
                // Load all forms from dataStore
                const response = await fetch(
                    `${process.env.REACT_APP_DHIS2_URL}/api/dataStore/standard`,
                    {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch form keys from dataStore');
                }

                const formKeys = await response.json();
                const loadedForms = await Promise.all(
                    formKeys.map(async (key) => {
                        const formResponse = await fetch(
                            `${process.env.REACT_APP_DHIS2_URL}/api/dataStore/standard/${key}`,
                            {
                                headers: {
                                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                                }
                            }
                        );
                        return formResponse.json();
                    })
                );

                setForms(loadedForms);
            } catch (error) {
                console.error('Error loading forms from dataStore:', error);
                // Fallback to localStorage (commented out but available if needed)
                // const savedForms = localStorage.getItem('dataEntryForms');
                // if (savedForms) {
                //     setForms(JSON.parse(savedForms));
                // }
            } finally {
                setLoading(false);
            }
        };

        loadInitialForms();
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
        setActiveSection(newSection.id);
    };

    const handleAddDataElementToSection = (element) => {
        if (!activeSection || element.added) return;

        setSections(sections.map(section => {
            if (section.id === activeSection) {
                return {
                    ...section,
                    dataElements: [...section.dataElements, element]
                };
            }
            return section;
        }));

        // Mark the DE as added
        setSelectedDataElements(selectedDataElements.map(de =>
            de.id === element.id ? { ...de, added: true } : de
        ));
    };

    const handleAddDataElement = (element) => {
        // Remove from available and add to selected
        setDataElements(dataElements.filter(de => de.id !== element.id));
        setSelectedDataElements([...selectedDataElements, element]);
    };

    const handleRemoveDataElement = (element) => {
        // Remove from selected and add back to available
        setSelectedDataElements(selectedDataElements.filter(de => de.id !== element.id));
        setDataElements([...dataElements, element]);
    };

    const handleAddAllDataElements = () => {
        // Move all from available to selected
        setSelectedDataElements([...selectedDataElements, ...dataElements]);
        setDataElements([]);
    };

    const handleRemoveAllDataElements = () => {
        // Move all from selected back to available
        setDataElements([...dataElements, ...selectedDataElements]);
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
            const currentDate = new Date().toISOString();

            // 1. Create the data element
            const dataElementPayload = {
                name: newDataElement.name,
                shortName: newDataElement.name,
                code: newDataElement.code,
                valueType: newDataElement.valueType,
                domainType: 'TRACKER',
                aggregationType: 'NONE',
                created: currentDate,
                lastUpdated: currentDate
            };

            const createResponse = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/dataElements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                },
                body: JSON.stringify(dataElementPayload)
            });

            if (!createResponse.ok) {
                throw new Error('Failed to create data element');
            }

            const createdElement = await createResponse.json();
            const dataElementId = createdElement.response.uid;

            // 2. Link to selected program stage
            if (selectedProgramStage) {
                // Fetch full program stage details including name and program
                const fullProgramStageResponse = await fetch(
                    `${process.env.REACT_APP_DHIS2_URL}/api/programStages/${selectedProgramStage}.json?fields=id,name,program,programStageDataElements[dataElement[id],compulsory,sortOrder,allowProvidedElsewhere,displayInReports]`,
                    {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                        }
                    }
                );

                if (!fullProgramStageResponse.ok) {
                    throw new Error('Failed to fetch full program stage details');
                }

                const fullProgramStage = await fullProgramStageResponse.json();
                const existingPSDEs = fullProgramStage.programStageDataElements || [];

                const nextSortOrder = existingPSDEs.length > 0
                    ? Math.max(...existingPSDEs.map(e => e.sortOrder || 0)) + 1
                    : 1;

                // Add the new data element
                existingPSDEs.push({
                    dataElement: { id: dataElementId },
                    compulsory: true,
                    allowProvidedElsewhere: false,
                    displayInReports: true,
                    sortOrder: nextSortOrder
                });

                // Final payload including required fields
                const updatePayload = {
                    id: selectedProgramStage,
                    name: fullProgramStage.name,
                    program: fullProgramStage.program, // program: { id: 'abc123' }
                    programStageDataElements: existingPSDEs
                };

                // PUT updated program stage
                const updateResponse = await fetch(
                    `${process.env.REACT_APP_DHIS2_URL}/api/programStages/${selectedProgramStage}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                        },
                        body: JSON.stringify(updatePayload)
                    }
                );

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    throw new Error(`Failed to update program stage: ${errorText}`);
                }
            }

            // 3. Update UI
            const newElement = {
                id: dataElementId,
                displayName: newDataElement.name,
                name: newDataElement.name,
                code: newDataElement.code,
                valueType: newDataElement.valueType,
                added: false
            };

            setDataElements(prev => [...prev, newElement]);
            setSelectedDataElements(prev => [...prev, newElement]);
            setNewDataElement({ name: '', valueType: 'TEXT', code: '' });

            setSuccessMessage('Data element created and linked to program stage successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage(`Error: ${error.message}`);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSection = (sectionId) => {
        // When removing a section, mark its DEs as not added
        const sectionToRemove = sections.find(s => s.id === sectionId);
        if (sectionToRemove) {
            setSelectedDataElements(selectedDataElements.map(de =>
                sectionToRemove.dataElements.some(sde => sde.id === de.id)
                    ? { ...de, added: false }
                    : de
            ));
        }

        setSections(sections.filter(s => s.id !== sectionId));
        if (activeSection === sectionId) {
            setActiveSection(null);
        }
    };

    // Add this utility function to generate UIDs (11-digit alphanumeric)
    const generateUID = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let uid = '';
        for (let i = 0; i < 11; i++) {
            uid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return uid;
    };

    // Add these utility functions near the top of your component
    const saveFormToDataStore = async (formKey, formData, isUpdate = false) => {
        try {
            const endpoint = `${process.env.REACT_APP_DHIS2_URL}/api/dataStore/standard/${formKey}`;
            const method = isUpdate ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isUpdate ? 'update' : 'save'} form in dataStore`);
            }

            return true;
        } catch (error) {
            console.error(`Error ${isUpdate ? 'updating' : 'saving'} form to dataStore:`, error);
            throw error;
        }
    };

    const loadFormFromDataStore = async (formKey) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_DHIS2_URL}/api/dataStore/standard/${formKey}`,
                {
                    headers: {
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load form from dataStore');
            }

            return await response.json();
        } catch (error) {
            console.error('Error loading form from dataStore:', error);
            throw error;
        }
    };

    const getAllFormsFromDataStore = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_DHIS2_URL}/api/dataStore/standard`,
                {
                    headers: {
                        'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch form keys from dataStore');
            }

            const formKeys = await response.json();
            const forms = await Promise.all(
                formKeys.map(key => loadFormFromDataStore(key))
            );

            return forms;
        } catch (error) {
            console.error('Error fetching forms from dataStore:', error);
            throw error;
        }
    };

    const handleSaveForm = async () => {
        if (!formName.trim() || sections.length === 0) {
            setSuccessMessage('Please provide a form name and at least one section');
            setOpenSnackbar(true);
            return;
        }

        // Validate form key is a year
        const yearRegex = /^\d{4}$/;
        if (!yearRegex.test(formName)) {
            setSuccessMessage('Form key must be a 4-digit year (e.g., 2023)');
            setOpenSnackbar(true);
            return;
        }

        try {
            setLoading(true);

            // Get existing section IDs for the selected program stage
            const existingSections = programStageSectionsList.filter(
                section => section.programStage.id === selectedProgramStage
            );

            const currentDate = new Date().toISOString();
            const userId = "M5zQapPyTZI"; // Replace with actual user ID if available

            const programStageSections = sections.map((section, index) => {
                // Find matching existing section by name and program stage
                const existingSection = existingSections.find(
                    s => s.name === section.name && s.programStage.id === selectedProgramStage
                );

                return {
                    id: existingSection ? existingSection.id : generateUID(),
                    name: section.name,
                    sortOrder: index,
                    programStage: {
                        id: selectedProgramStage
                    },
                    renderType: {
                        MOBILE: { type: "LISTING" },
                        DESKTOP: { type: "LISTING" }
                    },
                    created: existingSection ? existingSection.created : currentDate,
                    lastUpdated: currentDate,
                    lastUpdatedBy: { id: userId },
                    programIndicators: [],
                    translations: [],
                    dataElements: section.dataElements.map(de => ({ id: de.id }))
                };
            });

            const payload = {
                programStageSections
            };

            // Post to DHIS2 metadata endpoint
            const response = await fetch(`${process.env.REACT_APP_DHIS2_URL}/api/metadata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:5Am53808053@')
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to save form to DHIS2');
            }

            // Also save locally for our application
            const newForm = {
                id: Date.now().toString(),
                name: formName,
                programId: selectedProgram,
                programStageId: selectedProgramStage,
                sections: [...sections],
                dataElements: selectedDataElements,
                createdAt: currentDate
            };

            // 2. Prepare form data for dataStore
            const formData = {
                id: selectedForm?.id || Date.now().toString(),
                name: formName,
                programId: selectedProgram,
                programStageId: selectedProgramStage,
                sections: [...sections],
                dataElements: selectedDataElements,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // 3. Save to dataStore
            const isUpdate = !!selectedForm;
            await saveFormToDataStore(formName, formData, isUpdate);

            // const updatedForms = [...forms, newForm];
            // const updatedForms = [...forms.filter(f =>
            //     !(f.programId === selectedProgram && f.programStageId === selectedProgramStage)
            // ), newForm];
            const updatedForms = [...forms.filter(f => f.name !== formName), formData];
            setForms(updatedForms);
            // localStorage.setItem('dataEntryForms', JSON.stringify(updatedForms));

            setSuccessMessage(`Form ${isUpdate ? 'updated' : 'saved'} successfully!`);
            setOpenSnackbar(true);
            setFormName('');
            setSections([]);
            setSelectedDataElements(selectedDataElements.map(de => ({ ...de, added: false })));
            setActiveSection(null);
            setSelectedForm(null);
        } catch (error) {
            console.error('Error saving form:', error);
            setSuccessMessage(`Error: ${error.message}`);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    // const handleLoadForm = (formId) => {
    //     const formToLoad = forms.find(f => f.id === formId);
    //     if (formToLoad) {
    //         setSelectedForm(formToLoad);
    //         setSections(formToLoad.sections);
    //         setFormName(formToLoad.name);
    //         setSelectedProgram(formToLoad.programId);
    //         setSelectedProgramStage(formToLoad.programStageId);

    //         // Split elements into available and selected based on the loaded form
    //         const allElements = [...formToLoad.dataElements];
    //         const selectedIds = new Set(formToLoad.sections.flatMap(s =>
    //             s.dataElements.map(de => de.id)
    //         ));

    //         const updatedSelected = formToLoad.dataElements.map(de => ({
    //             ...de,
    //             added: selectedIds.has(de.id)
    //         }));

    //         setSelectedDataElements(updatedSelected);
    //         setDataElements([]); // All elements are in selected when loading a form
    //     }
    // };

    const handleLoadForm = async (formId) => {
        try {
            setLoading(true);

            // Find the form in our local state to get the form key (year)
            const formToLoad = forms.find(f => f.id === formId);
            if (!formToLoad) return;

            // Load from dataStore
            const loadedForm = await loadFormFromDataStore(formToLoad.name);

            setSelectedForm(loadedForm);
            setSections(loadedForm.sections);
            setFormName(loadedForm.name);
            setSelectedProgram(loadedForm.programId);
            setSelectedProgramStage(loadedForm.programStageId);

            // Split elements into available and selected based on the loaded form
            const allElements = [...loadedForm.dataElements];
            const selectedIds = new Set(loadedForm.sections.flatMap(s =>
                s.dataElements.map(de => de.id)
            ));

            const updatedSelected = loadedForm.dataElements.map(de => ({
                ...de,
                added: selectedIds.has(de.id)
            }));

            setSelectedDataElements(updatedSelected);
            setDataElements([]); // All elements are in selected when loading a form
        } catch (error) {
            console.error('Error loading form:', error);
            setSuccessMessage(`Error loading form: ${error.message}`);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
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
                                                {stage.name}
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
                            {/* Create New Data Element Toggle */}
                            <Box mb={2} display="flex" alignItems="center">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showNewDataElementForm}
                                            onChange={(e) => setShowNewDataElementForm(e.target.checked)}
                                        />
                                    }
                                    label="Create New Data Element"
                                    sx={{ mr: 2 }}
                                />
                            </Box>

                            {/* Create New Data Element Form - Conditionally rendered */}
                            {showNewDataElementForm && (
                                <Box mb={4}>
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
                            )}

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
                        <Grid container spacing={3}>
                            <Grid item xs={8}>
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
                                                label="Form Key"
                                                value={formName}
                                                onChange={(e) => setFormName(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                sx={{ mr: 2 }}
                                                helperText="Enter a 4-digit year (e.g., 2020)"
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
                                                    style={{ height: '40px' }}
                                                >
                                                    <MenuItem value="" disabled>
                                                        {/* Select a saved form */}
                                                        {loading ? 'Loading forms...' : 'Select a saved form'}
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
                                                <Paper
                                                    key={section.id}
                                                    sx={{
                                                        mb: 4,
                                                        p: 2,
                                                        border: activeSection === section.id ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.12)',
                                                        cursor: !previewMode ? 'pointer' : 'default'
                                                    }}
                                                    onClick={!previewMode ? () => setActiveSection(section.id) : undefined}
                                                >
                                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                        <Typography variant="subtitle1">
                                                            {section.name}
                                                        </Typography>
                                                        {!previewMode && (
                                                            <IconButton
                                                                color="error"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveSection(section.id);
                                                                }}
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
                                                                                onClick={() => handleRemoveDataElement(element.id, section.id)}
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
                                </Box>
                            </Grid>

                            <Grid item xs={4}>
                                {!previewMode && selectedDataElements.length > 0 && (
                                    <Card sx={{ position: 'sticky', top: 20 }}>
                                        <CardHeader
                                            title="Available Data Elements"
                                            subheader="Double click to add to active section"
                                        />
                                        <CardContent style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                            <List dense>
                                                {selectedDataElements.map(element => (
                                                    <ListItem
                                                        key={element.id}
                                                        button
                                                        disabled={element.added}
                                                        onDoubleClick={() => handleAddDataElementToSection(element)}
                                                        sx={{
                                                            opacity: element.added ? 0.6 : 1,
                                                            backgroundColor: element.added ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                                                            '&:hover': {
                                                                backgroundColor: element.added ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.08)'
                                                            }
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={element.displayName}
                                                            secondary={`(${element.valueType})`}
                                                        />
                                                        {!element.added && (
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="add"
                                                                onClick={() => handleAddDataElementToSection(element)}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        )}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>
                        </Grid>
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