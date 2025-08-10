import React from 'react';
import {
    Box, Button, Container, Paper, TextField, useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider as ReactDndProvider } from 'react-dnd';
import { toast } from 'react-toastify';

import { RootState } from '../redux/store';
import {
    addField, deleteField, setFormMeta,
    reorderFields, updateField, insertFieldAtIndex
} from '../redux/formSlice';

import DraggableField from '../components/DraggableForm';
import EditableDescription from '../components/EditableDescription';


const CreateForm = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { fields, formName, description } = useSelector((state: RootState) => state.form);

    const [title, setTitle] = React.useState(formName || "Untitled Form");

    const [desc, setDesc] = React.useState(description);

    const handleDuplicateField = (field: any, index: number) => {
        const newField = {
            ...field,
            id: uuidv4(),
            label: field.label ? `${field.label} (copy)` : 'Untitled Question (copy)',
            options: field.options ? [...field.options] : [],
        };

        dispatch(insertFieldAtIndex({ field: newField, index: index + 1 }));
    };



    // Instantly add a field with default values
    const handleAddField = () => {
        const newField = {
            id: uuidv4(),
            type: 'text',
            label: 'Untitled Question',
            required: false,
            validations: {},
            options: ['Option 1', 'Option 2']
        };
        dispatch(addField(newField));
    };

    const handleSaveForm = () => {
        if (title.trim() === "") setTitle("Untitled Form");

        // Show toast first
        const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
        const existingIndex = savedForms.findIndex((f: any) => f.formName === title);

        if (existingIndex >= 0) {
            toast.success("Form updated!");
        } else {
            toast.success("Form saved to localStorage!");
        }

        dispatch(setFormMeta({ formName: title, description: desc }));

        const saved = {
            formName: title,
            description: desc,
            fields,
            timestamp:
                existingIndex >= 0
                    ? savedForms[existingIndex].timestamp
                    : new Date().toISOString(),
        };

        if (existingIndex >= 0) {
            savedForms[existingIndex] = saved;
        } else {
            savedForms.push(saved);
        }

        localStorage.setItem("forms", JSON.stringify(savedForms));
    };




    const moveField = (from: number, to: number) => {
        const updated = [...fields];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        dispatch(reorderFields(updated));
    };

    return (
        <ReactDndProvider backend={HTML5Backend}>
            <Container maxWidth="md" sx={{ pb: 12 }}>
                <Box my={4}>
                    {/* Title */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderTop: '8px solid #673ab7',
                            backgroundColor: '#f8f6fd',
                        }}
                    >
                        {/* Title Field */}
                        <TextField
                            variant="standard"
                            fullWidth
                            InputProps={{ disableUnderline: true }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                mb: 1,
                                input: { fontSize: '2rem', fontWeight: 600 },
                            }}
                            placeholder="Untitled Form"
                        />

                        {/* Description Field */}
                        <EditableDescription value={desc} onChange={setDesc} placeholder={"Form Description (optional)"} />
                    </Paper>


                    {/* Fields */}
                    {fields.map((field, index) => (
                        <DraggableField
                            key={field.id}
                            field={field}
                            index={index}
                            moveField={moveField}
                            onDelete={(id: string) => dispatch(deleteField(id))}
                            onUpdate={(f: any) => dispatch(updateField(f))}
                            onDuplicate={handleDuplicateField}
                        />
                    ))}
                </Box>
            </Container>

            {/* Enhanced Sticky Action Bar */}
            <Box
                position="fixed"
                bottom={20}
                left="50%"
                sx={{
                    transform: 'translateX(-50%)',
                    width: 'fit-content',
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    zIndex: 1300,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleAddField}
                    startIcon={<span style={{ fontSize: '1.25rem' }}>➕</span>}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: '#673ab7',
                            color: '#673ab7',
                            backgroundColor: '#f3e5f5',
                        }
                    }}
                >
                    Add Field
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveForm}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1.4,
                        borderRadius: 2,
                        backgroundColor: '#43a047',
                        '&:hover': {
                            backgroundColor: '#388e3c'
                        }
                    }}
                >
                    Save Form
                </Button>
            </Box>

        </ReactDndProvider>
    );
};

export default CreateForm;
