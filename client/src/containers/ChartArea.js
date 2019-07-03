import React, { useState } from 'react';
import { Paper, Typography } from '@material-ui/core';
import DataAll from '../components/DataAll';
import DataYears from '../components/DataYears';
import CombinedDataYears from '../components/CombinedDataYears';
import getYear from '../helpers/getYear';

export default function ChartArea({ type, combine }) {
  const [all, setAll] = useState(true);

  const finalYear = getYear();

  return (
    <Paper
      style={{ textAlign: 'center', padding: '1rem', margin: '0.5rem auto' }}
    >
      <Typography variant="h5" align="center">
        {type}
      </Typography>
      {all ? (
        <>
          <DataAll titleYears={`2009 - ${finalYear}`} onClick={setAll} />
        </>
      ) : combine ? (
        <CombinedDataYears onClick={setAll} />
      ) : (
        <>
          <DataYears onClick={setAll} />
        </>
      )}
    </Paper>
  );
}
