import React, { useContext } from 'react';
import {
  Typography,
  Container,
  Button,
  CircularProgress
} from '@material-ui/core';
import { DataContext } from '../App';

export default function DataAll({ titleYears, onClick }) {
  const { data, isLoading, isError, chartFunc } = useContext(DataContext);
  React.useEffect(() => chartFunc.all(data));

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
          `${titleYears}`
        )}
        {isError ? 'ERROR' : null}
      </Typography>
      <Container maxWidth="xl" style={{ overflowX: 'auto' }}>
        <svg id="chart" width="1500px" height="550px" />
      </Container>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onClick(false)}
        style={{ margin: '5px' }}
        disabled={isLoading}
      >
        Select years...
      </Button>
    </>
  );
}
