import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

const EditableDescription = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder: string } ) => {
  const [editing, setEditing] = useState(false);

  return (
    <Box mt={1}>
      {editing ? (
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setEditing(false);
          }}
          InputProps={{ disableUnderline: true }}
          sx={{
            input: {
              fontSize: '1rem',
              fontWeight: 400,
              color: 'text.secondary',
            },
          }}
        />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ cursor: 'text', minHeight: '1.5rem' }}
          onClick={() => setEditing(true)}
        >
          {value || placeholder}
        </Typography>
      )}
    </Box>
  );
};

export default EditableDescription;
