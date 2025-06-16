import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const TextFieldWrapper = ({
  name,
  control,
  label,
  type = 'text',
  ...otherProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, ref },
        fieldState: { error }
      }) => (
        <TextField
          fullWidth
          label={label}
          variant="outlined"
          value={value || ''}
          onChange={onChange}
          inputRef={ref}
          type={type}
          error={!!error}
          helperText={error?.message}
          margin="normal"
          {...otherProps}
        />
      )}
    />
  );
};

export default TextFieldWrapper; 