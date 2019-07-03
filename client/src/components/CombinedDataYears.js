import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Container,
  Button,
  CircularProgress,
  Divider
} from '@material-ui/core';
import YearsSelect from './YearsSelect';
import getYear from '../helpers/getYear';
import { DataContext } from '../App';

export default function CombinedDataYears({ onClick }) {
  const { data, isLoading, isError, chartFunc } = useContext(DataContext);
  const [selectedYears, setSelectedYears] = useState({});

  useEffect(() => {
    setSelectedYears(() => ({
      ...data.temps.reduce((acc, { date }) => {
        const year = getYear(date);
        if (+year !== 2009 && +year !== getYear()) {
          acc = { ...acc, [year]: false };
        }
        return acc;
      }, {})
    }));
  }, [data.temps]);

  const handleChangeYears = name => event => {
    setSelectedYears({ ...selectedYears, [name]: event.target.checked });
  };

  const handleAllYears = val => {
    Object.keys(selectedYears).forEach(key =>
      setSelectedYears(prev => ({ ...prev, [key]: val }))
    );
  };

  const years = Object.entries(selectedYears).reduce((acc, year) => {
    if (year[1]) {
      acc.push(Number(year[0]));
    }
    return acc;
  }, []);

  const filteredTemps = data.temps.filter(day =>
    years.includes(getYear(day.date))
  );
  const filteredPrecip = data.precip.filter(day =>
    years.includes(getYear(day.date))
  );

  useEffect(() => chartFunc.years(data, filteredTemps, filteredPrecip, years));

  return (
    <>
      <Typography variant="h6" align="center">
        {isLoading ? (
          <CircularProgress
            disableShrink
            size={20}
            thickness={3}
            variant="indeterminate"
          />
        ) : (
          `selected years`
        )}
        {isError ? 'ERROR' : null}
      </Typography>
      <Container maxWidth="xl" style={{ overflowX: 'auto' }}>
        <svg id="chart" width="1500px" height="550px" />
      </Container>
      <YearsSelect
        selectedYears={selectedYears}
        handleChangeYears={handleChangeYears}
        handleAllYears={handleAllYears}
      />
      <Divider variant="middle" light />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onClick(true)}
        style={{ margin: '0.5rem' }}
      >
        Back
      </Button>
    </>
  );
}
