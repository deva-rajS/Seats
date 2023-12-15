import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';
import CheckOut from './CheckOut';

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
    const selectedTicketType = findSelectedTicketType(
      selectedCategory,
      selection.ticketType,
    );
  };
  // console.log('SelectedTicketType:', JSON.stringify(selectedTicket, null, 2));
  const handleDeselect = deselection => {
    const deselectedSeatInfo = extractSeatInfo(deselection);
    const updatedSelectedTicket = selectedTicket.filter(
      ticket => ticket.seat !== deselectedSeatInfo.seat,
    );
    setSelectedTicket(updatedSelectedTicket);
  };

  const findSelectedTicketType = (selectedCategory, selectedTicketType) => {
    const categoryConfig = pricing.find(
      category => category.category === selectedCategory,
    );

    if (categoryConfig && categoryConfig.ticketTypes) {
      const selectedType = categoryConfig.ticketTypes.find(
        type => type.ticketType === selectedTicketType,
      );

      if (selectedType) {
        return selectedType.ticketType;
      }
    }

    return null;
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

  // const handleCloseTicketDetails = () => {
  //   setSelectedTicket([]);
  // };

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
            pricing={pricing}
            onObjectSelected={handleTicketClick}
            onObjectDeselected={handleDeselect}
          />
        </View>
      </ScrollView>

      {selectedTicket.length > 0 && (
        <CheckOut
          ticket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          selectedTicket={selectedTicket}
          handleDeselect={handleDeselect}
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
