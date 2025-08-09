import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from "@mui/material";
import { formulaHelpers } from "../utils/formulas";

const DerivedFieldModal = ({ open, onClose, field, onSave }: any) => {
  const allFields = useSelector((state: any) => state.form.fields);

  const [formulaDisplay, setFormulaDisplay] = useState(""); // with labels
  const [localParents, setLocalParents] = useState<string[]>(
    field.parentFields || []
  );

  /** Convert ID-based formula to label-based for display */
  const idToLabelFormula = (idFormula: string) => {
    let result = idFormula;
    localParents.forEach((pid) => {
      const pf = allFields.find((f: any) => f.id === pid);
      if (pf?.label) {
        result = result.replaceAll(`{${pid}}`, `{${pf.label}}`);
      }
    });
    return result;
  };

  /** Convert label-based formula back to ID-based for saving */
  const labelToIdFormula = (labelFormula: string) => {
    let result = labelFormula;
    localParents.forEach((pid) => {
      const pf = allFields.find((f: any) => f.id === pid);
      if (pf?.label) {
        result = result.replaceAll(`{${pf.label}}`, `{${pid}}`);
      }
    });
    return result;
  };

  /** Compute live preview */
  const computePreview = useMemo(() => {
    try {
      const idFormula = labelToIdFormula(formulaDisplay);

      // Map field values
      const values: Record<string, any> = {};
      localParents.forEach((pid) => {
        const pf = allFields.find((f: any) => f.id === pid);
        values[pid] = pf?.value ?? "";
      });

      // Replace placeholders {id} with values
      let code = idFormula;
      for (const [id, val] of Object.entries(values)) {
        code = code.replaceAll(`{${id}}`, JSON.stringify(val));
      }

      // eslint-disable-next-line no-new-func
      const fn = new Function(
        "helpers",
        `with(helpers) { return (${code}); }`
      );
      return String(fn(formulaHelpers));
    } catch (e) {
      return "⚠️ Error in formula";
    }
  }, [formulaDisplay, localParents, allFields]);

  /** Save handler */
  const handleSave = () => {
    const idFormula = labelToIdFormula(formulaDisplay);
    onSave({
      ...field,
      isDerived: true,
      formula: idFormula,
      parentFields: localParents
    });
    onClose();
  };

  useEffect(() => {
    if (open) {
      setLocalParents(field.parentFields || []);
      setFormulaDisplay(idToLabelFormula(field.formula || ""));
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
            You can use placeholders like <code>{`{Field Label}`}</code> and helper functions like:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem" }}>
            <li><code>yearsBetween({`{DOB}`})</code> → age in years</li>
            <li><code>sum({`{Price}`}, {`{Tax}`})</code> → sum of numbers</li>
            <li><code>upper({`{Name}`})</code> → uppercase text</li>
          </ul>

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
                ?.filter((f: any) => f.id !== field.id)
                .map((f: any) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Insert field buttons */}
          {localParents.length > 0 && (
            <Box>
              <Typography variant="body2" mb={1}>
                Click to insert field placeholders:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {localParents.map((pid) => {
                  const pf = allFields.find((f: any) => f.id === pid);
                  return (
                    <Button
                      key={pid}
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        setFormulaDisplay(
                          (prev) => prev + `{${pf?.label || pid}}`
                        )
                      }
                    >
                      {pf?.label || pid}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Formula Input */}
          <TextField
            label="Formula"
            fullWidth
            value={formulaDisplay}
            onChange={(e) => setFormulaDisplay(e.target.value)}
            helperText={`Example: yearsBetween({${allFields.find((f:any) => f.id === localParents[0])?.label || "DOB"}})`}
          />

          {/* Live Preview */}
          <Box p={2} border="1px solid #ddd" borderRadius={1} bgcolor="#fafafa">
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Live Preview
            </Typography>
            <Typography>{computePreview}</Typography>
          </Box>
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
