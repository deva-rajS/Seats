import React from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

class SimpleSeatingChartWithChangeConfig extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={styles.scrollview}>
          <Text style={styles.title}>Ticket Booking</Text>
          <View style={styles.chart}>
            <SeatsioSeatingChart
              region="eu"
              workspaceKey="38e8358c-1de3-44f8-95fa-497f582e9036"
              event="85607055-4e5e-41c9-9c2a-5328d3cc0c25"
              onChartRendered={chart => (this.chart = chart)}
              pricing={[
                {
                  category: 1,
                  ticketTypes: [{ticketType: 'Price', price: 100}],
                },
                {
                  category: 2,
                  ticketTypes: [{ticketType: 'Price', price: 150}],
                },
                {category: 3, price: 50},
              ]}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chart: {
    width: '100%',
    height: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
});

export default SimpleSeatingChartWithChangeConfig;
