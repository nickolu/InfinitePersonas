import {Button, ButtonGroup} from '@mui/material';
import React from 'react';

type ButtonOption = {
  value: string;
  label: string;
};

const SelectableButtonGroup = ({
  options,
  onSelection,
}: {
  options: ButtonOption[];
  onSelection: (value: string) => void;
}) => {
  const [selectedButton, setSelectedButton] = React.useState('');

  const handleButtonClick = (value: string) => {
    onSelection(value);
    setSelectedButton(value);
  };

  return (
    <ButtonGroup color="primary" aria-label="outlined primary button group">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={selectedButton === option.value ? 'contained' : 'outlined'}
          onClick={() => handleButtonClick(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default SelectableButtonGroup;
