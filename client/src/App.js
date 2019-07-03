import React, { Suspense, createContext } from 'react';
import {
  Container,
  Typography,
  Link,
  CircularProgress
} from '@material-ui/core';
import useData from './hooks/useData';
import ChartSelect from './components/ChartSelect';
import temp from './charts/temp';
import precip from './charts/precip';
import combined from './charts/combined';
const ChartArea = React.lazy(() => import('./containers/ChartArea'));

const URL = '/api/all';

export const DataContext = createContext(null);

export default function App() {
  const [{ data, isLoading, isError }] = useData(URL, []);
  const [selectedValue, setSelectedValue] = React.useState('t');

  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  const Optional = () => {
    switch (selectedValue) {
      case 't':
        return (
          <DataContext.Provider
            value={{ data: data.temps, isLoading, isError, chartFunc: temp }}
          >
            <ChartArea type="Temperature range" />
          </DataContext.Provider>
        );
      case 'p':
        return (
          <DataContext.Provider
            value={{ data: data.precip, isLoading, isError, chartFunc: precip }}
          >
            <ChartArea type="Precipitation" />
          </DataContext.Provider>
        );
      case 'c':
        return (
          <DataContext.Provider
            value={{ data, isLoading, isError, chartFunc: combined }}
          >
            <ChartArea type="Temperature range and precipitation" combine />
          </DataContext.Provider>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="xl"
      style={{
        height: '100vh',
        paddingTop: '1.5rem',
        backgroundColor: '#e3f2fd'
      }}
    >
      <Typography variant="h4" align="center">
        Historical weather data for Subotica, Serbia
      </Typography>
      <Typography variant="h5" align="center">
        collected from{' '}
        <Link
          href="http://www.sumeteo.info/"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.sumeteo.info
        </Link>
      </Typography>

      <ChartSelect selectedValue={selectedValue} handleChange={handleChange} />

      <Suspense
        fallback={
          <CircularProgress
            disableShrink
            size={70}
            thickness={4}
            variant="indeterminate"
            style={{ position: 'relative', left: '50%' }}
          />
        }
      >
        <Optional />
      </Suspense>
    </Container>
  );
}
