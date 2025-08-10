import React, { JSX, useState } from 'react';
import {
    Box, Button, IconButton, MenuItem, Paper, TextField,
    Select, Typography, FormControl, Menu, ListItemIcon, ListItemText, Switch, FormControlLabel
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ContentCopy as ContentCopyIcon,
    DragIndicator as DragIndicatorIcon,
    Close as CloseIcon
} from '@mui/icons-material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import FunctionsIcon from '@mui/icons-material/Functions';
import CheckIcon from '@mui/icons-material/Check';
import RuleIcon from '@mui/icons-material/Rule';

import { useDrag, useDrop } from 'react-dnd';
import ValidationModal from './ValidationModal';
import {
    ShortText as ShortTextIcon,
    Numbers as NumbersIcon,
    Notes as NotesIcon,
    ArrowDropDownCircle as SelectIcon,
    RadioButtonChecked as RadioIcon,
    CheckBox as CheckboxIcon,
    Event as DateIcon
} from '@mui/icons-material';
import DerivedFieldModal from './DerivedFieldModal';

// Map field types to icons
const FIELD_TYPE_ICONS: Record<string, JSX.Element> = {
    text: <ShortTextIcon fontSize="small" sx={{ mr: 1 }} />,
    number: <NumbersIcon fontSize="small" sx={{ mr: 1 }} />,
    textarea: <NotesIcon fontSize="small" sx={{ mr: 1 }} />,
    select: <SelectIcon fontSize="small" sx={{ mr: 1 }} />,
    radio: <RadioIcon fontSize="small" sx={{ mr: 1 }} />,
    checkbox: <CheckboxIcon fontSize="small" sx={{ mr: 1 }} />,
    date: <DateIcon fontSize="small" sx={{ mr: 1 }} />,
};
const FIELD_TYPES = ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

const DraggableField = ({ field, index, moveField, onDelete, onUpdate, onDuplicate }: any) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const dragHandleRef = React.useRef<HTMLDivElement>(null);

    const [showDerivedConfig, setShowDerivedConfig] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleOpenValidation = () => setShowValidation(true);
    const handleCloseValidation = () => setShowValidation(false);

    // Drop Target Setup
    const [, drop] = useDrop({
        accept: 'field',
        hover(item: any) {
            if (!ref.current || item.index === index) return;
            moveField(item.index, index);
            item.index = index;
        },
    });

    // Drag Source Setup
    const [{ isDragging }, drag, preview] = useDrag({
        type: 'field',
        item: { id: field.id, index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    drag(dragHandleRef);
    drop(preview(ref));

    // Handlers for Option Fields
    const handleOptionChange = (i: number, value: string) => {
        const options = [...(field.options || [])];
        options[i] = value;
        onUpdate({ ...field, options });
    };

    const handleAddOption = () => {
        const options = [...(field.options || []), ''];
        onUpdate({ ...field, options });
    };

    const handleDeleteOption = (i: number) => {
        const options = [...(field.options || [])];
        options.splice(i, 1);
        onUpdate({ ...field, options });
    };

    return (
        <Paper
            ref={ref}
            elevation={3}
            sx={{
                p: 2,
                mb: 3,
                opacity: isDragging ? 0.6 : 1,
                borderLeft: '5px solid #673ab7',
                backgroundColor: '#fffefc',
            }}
        >
            {/* Top Bar */}
            <Box
                ref={dragHandleRef}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ cursor: 'grab', mb: 2 }}
            >
                <Box display="flex" alignItems="center" gap={1} flex={1}>
                    <DragIndicatorIcon color="disabled" />
                    <TextField
                        variant="standard"
                        placeholder="Untitled Question"
                        value={field.label}
                        onChange={(e) => onUpdate({ ...field, label: e.target.value })}
                        sx={{ input: { fontSize: '1.1rem', fontWeight: 600 }, width: '56%' }}
                    />
                </Box>

                <FormControl size="small" sx={{ ml: 2, minWidth: 160 }}>
                    <Select
                        value={field.type}
                        onChange={(e) => onUpdate({ ...field, type: e.target.value })}
                        renderValue={(selected) => (
                            <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                                {FIELD_TYPE_ICONS[selected]}
                                <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                    {selected}
                                </Typography>
                            </Box>
                        )}
                        sx={{
                            '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1 },
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    borderRadius: 1.5,
                                    mt: 1,
                                    '& .MuiMenuItem-root': {
                                        py: 1,
                                        px: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        borderRadius: 1,
                                        '&:hover': { bgcolor: 'action.hover' },
                                    },
                                },
                            },
                        }}
                    >
                        {FIELD_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {FIELD_TYPE_ICONS[type]}
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {type}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Three-dot menu */}
                {['text', 'date', 'textarea', 'number'].includes(field.type) && <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon />
                </IconButton>}
                <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                    <MenuItem
                        onClick={() => {
                            onUpdate({
                                ...field,
                                isDerived: !field.isDerived,
                                ...(field.isDerived ? { formula: '', parentFields: [] } : {})
                            });
                            if(!field.isDerived) setShowDerivedConfig(true);
                            handleMenuClose();
                        }}
                    >
                        <ListItemIcon>
                            {field.isDerived ? <CheckIcon fontSize="small" /> : <FunctionsIcon fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText>
                            {field.isDerived ? 'Unmark Derived Field' : 'Mark as Derived'}
                        </ListItemText>
                    </MenuItem>

                    {field.type == 'text' && <MenuItem
                        onClick={() => {
                            setShowValidation(true);
                            handleMenuClose();
                        }}
                    >
                        <ListItemIcon>
                            <RuleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Add Validations</ListItemText>
                    </MenuItem>}

                    {field.isDerived && (
                        <MenuItem
                            onClick={() => {
                                setShowDerivedConfig(true);
                                handleMenuClose();
                            }}
                        >
                            <ListItemIcon>
                                <FunctionsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Configure Derived</ListItemText>
                        </MenuItem>
                    )}
                </Menu>
            </Box>

            {/* Option Input Section */}
            {['radio', 'checkbox', 'select'].includes(field.type) ? (
                <Box pl={4} mt={2}>
                    <Typography variant="subtitle2" color="text.secondary" mb={1}>
                        Options
                    </Typography>
                    {(field.options || []).map((opt: string, i: number) => (
                        <Box
                            key={i}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                            sx={{
                                '&:hover .remove-btn': { visibility: 'visible' },
                            }}
                        >
                            <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                placeholder={`Option ${i + 1}`}
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                            />
                            {field.options.length > 1 && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleDeleteOption(i)}
                                    className="remove-btn"
                                    sx={{ visibility: 'hidden' }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    <Button
                        size="small"
                        variant="text"
                        onClick={handleAddOption}
                        sx={{ mt: 1, textTransform: 'none', pl: 0 }}
                    >
                        + Add Option
                    </Button>
                </Box>
            ) : (
                <Box pl={4} mt={2}>
                    {field.type === 'textarea' ? (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.1 }}>
                                Long Answer
                            </Typography>
                            <Box sx={{
                                borderBottom: '1px solid rgba(0,0,0,0.4)',
                                height: '1.5rem',
                                width: '100%',
                                mt: 0,
                            }} />
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                                Short Answer
                            </Typography>
                            <Box sx={{
                                borderBottom: '1px solid rgba(0,0,0,0.4)',
                                height: '1.5rem',
                                width: '50%',
                                mt: 0,
                            }} />
                        </>
                    )}
                </Box>
            )}

            {/* Bottom Actions */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mt={3} flexWrap="wrap" gap={2}>
                <Box display="flex" gap={1}>
                    <IconButton onClick={() => onDuplicate(field, index)}>
                        <ContentCopyIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(field.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>

                <FormControlLabel
                    control={
                        <Switch
                            checked={field.required}
                            onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
                        />
                    }
                    label="Required"
                    labelPlacement="start"
                />
            </Box>

            {/* Validation Modal */}
            <ValidationModal
                open={showValidation}
                onClose={handleCloseValidation}
                field={field}
                onSave={(newValidations: any) => onUpdate({ ...field, validations: newValidations })}
            />
            <DerivedFieldModal
                open={showDerivedConfig}
                onClose={() => setShowDerivedConfig(false)}
                field={field}
                onSave={(updatedField: any) => onUpdate(updatedField)}
            />

        </Paper>
    );
};

export default DraggableField;
