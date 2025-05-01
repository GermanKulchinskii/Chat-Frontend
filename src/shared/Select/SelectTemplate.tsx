import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface SelectTemplateProps {
  label?: string | React.ReactNode;
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  width?: string | number | { xs?: string | number; sm?: string | number; md?: string | number };
  height?: string | number;
}

const SelectTemplate: React.FC<SelectTemplateProps> = ({
  label = 'Выберите вариант',
  options,
  defaultValue = '',
  onChange,
  width,
  height,
}) => {
  const [value, setValue] = useState<string>(defaultValue);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const isLabelString = typeof label === 'string';

  return (
    <FormControl
      variant="outlined"
      sx={{
        width: width ?? { xs: '100%', sm: 300, md: 400 },
        ...(height && { height: height }),
      }}
    >
      <InputLabel 
        id="select-label" 
        shrink={!isLabelString}
      >
        {label}
      </InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={value}
        label={isLabelString ? label : ''}
        onChange={handleChange}
        sx={{
          ...(height && { height: height }),
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectTemplate;
