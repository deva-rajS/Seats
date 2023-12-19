import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';
import CheckOut from './CheckOut';

const Client = {
  holdTokens: {
    create: async () => {
      // Simulate creating a hold token
      return {holdToken: 'mockHoldToken'};
    },
  },
  events: {
    hold: async (eventKey, seats, holdToken) => {
      // Simulate holding seats
      console.log(
        `Holding seats ${seats.join(
          ', ',
        )} for event ${eventKey} with hold token ${holdToken}`,
      );
    },
  },
};

const SimpleSeatingChartWithChangeConfig = () => {
  const [selectedTicket, setSelectedTicket] = useState([]);

  const pricing = [
    {
      category: 1,
      ticketTypes: [
        {ticketType: 'Adult', price: 10},
        // { ticketType: 'Senior/Child', price: 5 },
      ],
    },
    {
      category: 2,
      ticketTypes: [
        {ticketType: 'Adult', price: 8},
        // { ticketType: 'Senior/Child', price: 3 },
      ],
    },
  ];

  const handleTicketClick = selection => {
    const seatInfo = extractSeatInfo(selection);
    setSelectedTicket([...selectedTicket, seatInfo]);

    const selectedCategory = selection.sectionCategory;
  };

  const extractSeatInfo = selection => {
    const {category, seatId} = selection;
    return {
      label: category.label || '',
      seat: seatId,
      ticketType: category.pricing.ticketTypes[0].ticketType || '',
      price: category.pricing.ticketTypes[0].price || '',
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Text style={styles.title}>Ticket Booking</Text>
        <View style={styles.chart}>
          <SeatsioSeatingChart
            region="eu"
            workspaceKey="38e8358c-1de3-44f8-95fa-497f582e9036"
            event="85607055-4e5e-41c9-9c2a-5328d3cc0c25"
            onChartRendered={chart => (this.chart = chart)}
            pricing={pricing}
            onObjectSelected={handleTicketClick}
          />
        </View>
      </ScrollView>

      {selectedTicket.length > 0 && (
        <CheckOut
          ticket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          selectedTicket={selectedTicket}
          eventKey="85607055-4e5e-41c9-9c2a-5328d3cc0c25"
          Client={Client}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  scrollview: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  chart: {
    flex: 1,
    width: '100%',
    height: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
});

export default SimpleSeatingChartWithChangeConfig;
