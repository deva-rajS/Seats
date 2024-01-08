import {View, Text} from 'react-native';
import React from 'react';
import SimpleSeatingChartWithChangeConfig from './src/component/Seats';
import {SeatingProvider} from './src/context/SeatingContext';

export default function App() {
  return (
    <SeatingProvider>
      <SimpleSeatingChartWithChangeConfig />
    </SeatingProvider>
  );
}
