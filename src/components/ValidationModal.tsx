import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, FormControlLabel, Checkbox,
  Typography
} from '@mui/material';

const ValidationModal = ({ open, onClose, field, onSave }: any) => {
  const [local, setLocal] = useState({ ...field.validations });

  const [regexError, setRegexError] = useState('');
  const [customRuleError, setCustomRuleError] = useState('');
  const [errors, setErrors] = useState<{ minMax?: string }>({});

  const handleChange = (key: string, value: string) => {
    setLocal({ ...local, [key]: value });
  };

  const handleCheckbox = (key: string, checked: boolean) => {
    setLocal({ ...local, [key]: checked });
  };

  const validate = (data: any) => {
    const errs: { minMax?: string } = {};
    let isValid = true;

    const min = parseInt(data.minLength);
    const max = parseInt(data.maxLength);

    if (!isNaN(min) && !isNaN(max) && min > max) {
      errs.minMax = 'Minimum length cannot be greater than maximum length.';
      isValid = false;
    }

    // Regex validation
    if (data.pattern) {
      try {
        new RegExp(data.pattern);
        setRegexError('');
      } catch (e) {
        setRegexError('Invalid regular expression');
        isValid = false;
      }
    } else {
      setRegexError('');
    }

    // Custom JS rule validation
    if (data.customRule) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('value', `return ${data.customRule}`);
        const result = fn('sample');
        if (typeof result !== 'boolean') throw new Error('Must return boolean');
        setCustomRuleError('');
      } catch (e) {
        setCustomRuleError('Invalid JS rule: must return true/false');
        isValid = false;
      }
    } else {
      setCustomRuleError('');
    }

    setErrors(errs);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate(local)) return;
    onSave(local);
    onClose();
  };

  useEffect(() => {
    validate(local);
  }, [local]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.3rem', pb: 1 }}>
        Field Validation Rules
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          {/* Min / Max Length Side-by-side */}
          <Box display="flex" gap={2}>
            <TextField
              label="Min Length"
              type="number"
              size="small"
              variant="outlined"
              fullWidth
              value={local.minLength || ''}
              onChange={(e) => handleChange('minLength', e.target.value)}
              helperText="Minimum number of characters"
            />
            <TextField
              label="Max Length"
              type="number"
              size="small"
              variant="outlined"
              fullWidth
              value={local.maxLength || ''}
              onChange={(e) => handleChange('maxLength', e.target.value)}
              helperText={errors.minMax || 'Maximum number of characters'}
              error={!!errors.minMax}
            />
          </Box>

          {/* Pattern (Regex) */}
          <TextField
            label="Pattern (Regex)"
            size="small"
            variant="outlined"
            fullWidth
            value={local.pattern || ''}
            onChange={(e) => handleChange('pattern', e.target.value)}
            helperText={regexError || 'Enter a valid regex pattern'}
            error={!!regexError}
          />

          {/* Custom JS Rule */}
          <TextField
            label="Custom JS Rule"
            size="small"
            variant="outlined"
            fullWidth
            value={local.customRule || ''}
            onChange={(e) => handleChange('customRule', e.target.value)}
            helperText={customRuleError || 'Must return true/false. Example: value.length > 5'}
            error={!!customRuleError}
          />

          {/* Quick Toggles */}
          <Box>
            <Typography fontWeight={500} mb={1}>
              Quick Validation Toggles
            </Typography>

            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!local.isEmail}
                    onChange={(e) => handleCheckbox('isEmail', e.target.checked)}
                  />
                }
                label="Must be a valid email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!local.isPassword}
                    onChange={(e) => handleCheckbox('isPassword', e.target.checked)}
                  />
                }
                label="Must match password rules (8+ chars, include number)"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!!errors.minMax || !!regexError || !!customRuleError}
        >
          Save Rules
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationModal;
