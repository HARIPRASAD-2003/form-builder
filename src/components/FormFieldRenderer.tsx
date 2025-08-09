import React from 'react';
import {
  TextField, MenuItem, Checkbox, FormControlLabel, RadioGroup,
  Radio, FormGroup, FormLabel, Box, Alert, Paper, Fade, Typography
} from '@mui/material';
import { toast } from 'react-toastify';

const validateField = (value: any, field: any): string | null => {
  if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
    return 'This field is required';
  }
  const { validations } = field;

  if (validations) {
    if (validations.minLength && value?.length < validations.minLength)
      return `Minimum length is ${validations.minLength}`;
    if (validations.maxLength && value?.length > validations.maxLength)
      return `Maximum length is ${validations.maxLength}`;
    if (validations.pattern && !new RegExp(validations.pattern).test(value))
      return `Invalid format`;
    if (validations.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return 'Invalid email format';
    if (validations.isPassword && !/^(?=.*\d).{8,}$/.test(value))
      return 'Password must be at least 8 characters and contain a number';
  }
  return null;
};

interface FormFieldRendererProps {
  field: any;
  value: any;
  onChange: (id: string, value: any) => void;
  error: string | null;
  setError: (id: string, error: string | null) => void;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  setError
}) => {
  const handleBlur = () => {
    const err = validateField(value, field);
    setError(field.id, err);
    if (err) toast.error(`${field.label || 'Field'}: ${err}`);
  };

  const labelText = (
    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
      {field.label}
      {field.required && <span style={{ color: '#d93025' }}> *</span>}
    </Typography>
  );

  const shortAnswerProps = {
    variant: "standard" as const, // underline only
    fullWidth: true,
    value: value || '',
    onChange: (e: any) => onChange(field.id, e.target.value),
    onBlur: handleBlur,
    error: Boolean(error),
    helperText: error || '',
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'password':
      case 'date':
        return (
          <>
            {labelText}
            <TextField {...shortAnswerProps} type={field.type} placeholder="Your answer" sx={{ maxWidth: '50%' }} />
          </>
        );

      case 'textarea':
        return (
          <>
            {labelText}
            <TextField {...shortAnswerProps} multiline placeholder="Long answer" />
          </>
        );

      case 'select':
        return (
          <>
            {labelText}
            <TextField
              variant="standard"
              select
              sx={{ maxWidth: '60%' }}
              value={value || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              onBlur={handleBlur}
              error={Boolean(error)}
              helperText={error || ''}
              SelectProps={{
                displayEmpty: true, // Allow empty display
              }}
            >
              <MenuItem value="" disabled>
                <em>Select an option</em>
              </MenuItem>
              {(field.options || []).map((opt: string) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </>
        );


      case 'radio':
        return (
          <>
            {labelText}
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              onBlur={handleBlur}
            >
              {(field.options || []).map((opt: string) => (
                <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
              ))}
            </RadioGroup>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          </>
        );

      case 'checkbox':
        return (
          <>
            {labelText}
            <FormGroup onBlur={handleBlur}>
              {(field.options || []).map((opt: string) => (
                <FormControlLabel
                  key={opt}
                  control={
                    <Checkbox
                      checked={value?.includes?.(opt) || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newValue = new Set(value || []);
                        checked ? newValue.add(opt) : newValue.delete(opt);
                        onChange(field.id, Array.from(newValue));
                      }}
                    />
                  }
                  label={opt}
                />
              ))}
            </FormGroup>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Fade in>
      <Paper
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 2,
          border: '1px solid #dadce0',
          backgroundColor: '#fff',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
          }
        }}
      >
        {renderInput()}
      </Paper>
    </Fade>
  );
};

export default FormFieldRenderer;
