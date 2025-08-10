import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, FormControlLabel, Checkbox,
  Typography,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';

const ValidationModal = ({ open, onClose, field, onSave }: any) => {
  const [local, setLocal] = useState({ ...field.validations });

  const [regexError, setRegexError] = useState('');
  const [customRuleError, setCustomRuleError] = useState('');
  const [errors, setErrors] = useState<{ minMax?: string }>({});
  const [validationType, setValidationType] = useState<string>('');

  const handleChange = (key: string, value: string) => {
    setLocal((prev: any) => ({ ...prev, [key]: value }));
  };

  const clearValidationInputs = () => {
    setLocal((prev: any) => ({ ...prev, pattern: '', customRule: '', ruleDescription: '' }));
    setRegexError('');
    setCustomRuleError('');
    setErrors({});
    setValidationType('none');
  };



  // click handler to support toggle-on-second-click
  const handleRadioClick = (selectedValue: string) => {
    setLocal((prev: any) => {
      const currentlySelected =
        (selectedValue === 'isEmail' && !!prev.isEmail) ||
        (selectedValue === 'isPassword' && !!prev.isPassword);

      if (currentlySelected) {
        return { ...prev, isEmail: false, isPassword: false };
      }

      return {
        ...prev,
        isEmail: selectedValue === 'isEmail',
        isPassword: selectedValue === 'isPassword',
      };
    });
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
    if (validationType === "regex" && data.pattern) {
      handleChange('customRule', '');
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
    if (validationType === "customJS" && data.customRule) {
      handleChange('pattern', '');
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

          <FormControl component="fieldset">
            <FormLabel component="legend">Validation Type</FormLabel>
            <Box display="flex" alignItems="center">
              <RadioGroup
                row
                value={validationType}
                onChange={(e) => {
                  const value = e.target.value;
                  setValidationType((prev) => (prev === value ? "none" : value));
                }}
              >
                {/* Hidden clear option */}
                <FormControlLabel value="none" control={<Radio sx={{ display: "none" }} />} label="" />
                <FormControlLabel value="regex" control={<Radio />} label="Pattern (Regex)" />
                <FormControlLabel value="customJS" control={<Radio />} label="Custom JS Rule" />
              </RadioGroup>

              {validationType !== "none" && <Button
                size="small"
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={clearValidationInputs}
              >
                Clear
              </Button>}
            </Box>
          </FormControl>



          {validationType === 'regex' && (
            <TextField
              label="Pattern (Regex)"
              size="small"
              variant="outlined"
              fullWidth
              value={local.pattern || ''}
              onChange={(e) => handleChange('pattern', e.target.value)}
              helperText={
                regexError ||
                'Enter a valid regex pattern. Example: ^[A-Z]{3}\\d{3}$ (3 letters followed by 3 digits)'
              }
              error={!!regexError}
            />

          )}

          {validationType === 'customJS' && (
            <TextField
              label="Custom JS Rule"
              size="small"
              variant="outlined"
              fullWidth
              value={local.customRule || ''}
              onChange={(e) => handleChange('customRule', e.target.value)}
              helperText={
                customRuleError ||
                'Must return true/false. Example: value.length > 5 (valid if more than 5 characters)'
              }
              error={!!customRuleError}
            />

          )}

          {(validationType === "regex" || validationType === "customJS") && <TextField
            label="Rule Description"
            size="small"
            variant="outlined"
            fullWidth
            value={local.ruleDescription || ''}
            onChange={(e) => handleChange('ruleDescription', e.target.value)}
          />}


          {/* Quick Toggles */}
          <Box>
            <Typography fontWeight={500} mb={1}>
              Quick Validation Toggles
            </Typography>

            <RadioGroup
              value={local.isEmail ? 'isEmail' : local.isPassword ? 'isPassword' : ''}
            >
              <FormControlLabel
                value="isEmail"
                control={<Radio slotProps={{ input: { onClick: () => handleRadioClick('isEmail') } }} />}
                label="Must be a valid email"
              />
              <FormControlLabel
                value="isPassword"
                control={<Radio slotProps={{ input: { onClick: () => handleRadioClick('isPassword') } }} />}
                label="Must match password rules (8+ chars, include number)"
              />
            </RadioGroup>

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
