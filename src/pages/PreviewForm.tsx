import React, { useState, useEffect } from 'react';
import { Container, Typography, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormFieldRenderer from '../components/FormFieldRenderer';
import { formulaHelpers } from '../utils/formulas';

const PreviewForm = () => {
  const { fields, formName, description } = useSelector((state: RootState) => state.form);
  const [values, setValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    const updatedValues = { ...values };

    fields.forEach((field) => {
      if (field.isDerived && field.formula && field.parentFields?.length) {
        try {
          let code = field.formula;

          // Replace placeholders {id} with actual JSON values
          field.parentFields.forEach((pid: string) => {
            const val = values[pid] ?? '';
            code = code.replaceAll(`{${pid}}`, JSON.stringify(val));
          });

          // Create a function with helpers available
          // eslint-disable-next-line no-new-func
          const fn = new Function(
            'helpers',
            `with(helpers) { return (${code}); }`
          );

          updatedValues[field.id] = fn(formulaHelpers);
        } catch {
          updatedValues[field.id] = 'Error';
        }
      }
    });

    setValues(updatedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), fields]);

  const handleChange = (id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSetError = (id: string, err: string | null) => {
    setErrors((prev) => ({ ...prev, [id]: err }));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Typography variant="h4" fontWeight={600} mb={0.5}>
        {formName || 'Form Preview'}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          {description}
        </Typography>
      )}
      <Divider sx={{ mb: 3 }} />

      {fields.length === 0 ? (
        <Typography color="text.secondary">No form fields added yet.</Typography>
      ) : (
        fields.map((field) => (
          <FormFieldRenderer
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={handleChange}
            error={errors[field.id]}
            setError={handleSetError}
          />
        ))
      )}
    </Container>
  );
};

export default PreviewForm;
