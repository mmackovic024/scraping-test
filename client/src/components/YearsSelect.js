import React from 'react';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button
} from '@material-ui/core';
import getYear from '../helpers/getYear';

export default function YearsSelect({
  selectedYears,
  handleChangeYears,
  handleAllYears
}) {
  return (
    <>
      <FormControl component="fieldset">
        <FormGroup row>
          <FormLabel component="label" className="MuiFormControlLabel-root">
            Select years:{' '}
          </FormLabel>
          {Object.keys(selectedYears).map(
            (year, i) =>
              +year !== 2009 &&
              +year !== getYear() && (
                <FormControlLabel
                  key={'key' + year}
                  control={
                    <Checkbox
                      checked={selectedYears[year]}
                      onChange={handleChangeYears(year)}
                      value={year}
                    />
                  }
                  label={year}
                />
              )
          )}
          <Button
            size="small"
            variant="contained"
            onClick={() => handleAllYears(true)}
            style={{ margin: '0.5rem' }}
          >
            All
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleAllYears(false)}
            style={{ margin: '0.5rem' }}
          >
            None
          </Button>
        </FormGroup>
      </FormControl>
    </>
  );
}
