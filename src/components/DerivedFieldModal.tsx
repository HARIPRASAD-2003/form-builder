import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, FormControl,
  InputLabel, Select, MenuItem, Chip, OutlinedInput
} from "@mui/material";

const DerivedFieldModal = ({ open, onClose, field, onSave }: any) => {
    const allFields = useSelector((state: any) => state.form.fields);

  const [localFormula, setLocalFormula] = useState(field.formula || "");
  const [localParents, setLocalParents] = useState<string[]>(field.parentFields || []);

  const handleSave = () => {
    onSave({
      ...field,
      formula: localFormula,
      parentFields: localParents
    });
    onClose();
  };

  useEffect(() => {
    if (open) {
      setLocalFormula(field.formula || "");
      setLocalParents(field.parentFields || []);
    }
  }, [open, field]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
        Configure Derived Field
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <Typography variant="body2" color="text.secondary">
            Derived fields are automatically calculated based on other fields.
          </Typography>

          {/* Parent Fields Selection */}
          <FormControl fullWidth>
            <InputLabel id="parent-fields-label">Parent Fields</InputLabel>
            <Select
              labelId="parent-fields-label"
              multiple
              value={localParents}
              onChange={(e) => setLocalParents(e.target.value as string[])}
              input={<OutlinedInput label="Parent Fields" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const f = allFields.find((fld: any) => fld.id === id);
                    return <Chip key={id} label={f?.label || id} />;
                  })}
                </Box>
              )}
            >
              {allFields
                .filter((f: any) => f.id !== field.id)
                .map((f: any) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Formula Input */}
          <TextField
            label="Formula"
            fullWidth
            value={localFormula}
            onChange={(e) => setLocalFormula(e.target.value)}
            helperText={`Example: field1 + " " + field2`}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DerivedFieldModal;
