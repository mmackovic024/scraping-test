import React from 'react';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';

export default function ChartSelect({ selectedValue, handleChange }) {
  return (
    <>
      <RadioGroup
        style={{ justifyContent: 'center' }}
        aria-label="select"
        name="select"
        value={selectedValue}
        onChange={handleChange}
        row
      >
        <FormControlLabel
          style={{ margin: '0rem 1rem 0rem 2rem' }}
          value="t"
          control={<Radio checked={selectedValue === 't'} name="temperature" />}
          label="Temperatures"
          labelPlacement="end"
        />
        <FormControlLabel
          style={{ margin: '0rem 1rem 0rem 2rem' }}
          value="p"
          control={
            <Radio
              color="primary"
              checked={selectedValue === 'p'}
              name="precipitation"
            />
          }
          label="Precipitation"
          labelPlacement="end"
        />
        <FormControlLabel
          style={{ margin: '0rem 1rem 0rem 2rem' }}
          value="c"
          control={
            <Radio
              color="default"
              checked={selectedValue === 'c'}
              name="combined"
            />
          }
          label="Combined"
          labelPlacement="end"
        />
      </RadioGroup>
    </>
  );
}
