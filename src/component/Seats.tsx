import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';
import firestore from '@react-native-firebase/firestore';
import CheckOut from './CheckOut';
import Terms from './Terms';

interface SeatInfo {
  label: string;
  seat: string;
  ticketType: string;
  price: string;
}

interface ChartSelection {
  sectionCategory: {
    label?: string;
    pricing: {
      category: number;
      ticketTypes: {
        ticketType: string;
        price: string;
      }[];
    };
  };
  seatId: string;
  category: {
    label: string;
    pricing: {
      ticketTypes: {
        ticketType: string;
        price: number;
      };
    };
  };
}

const Client = {
  holdTokens: {
    create: async () => {
      // Simulate creating a hold token
      return {holdToken: 'mockHoldToken'};
    },
  },
  events: {
    hold: async (eventKey: string, seats: string[], holdToken: string) => {
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
  const [pricingData, setPricingData] = useState([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submit, setSubmit] = useState(false);

  const pricing = [
    {
      category: 1,
      ticketTypes: [
        {ticketType: 'Adult', price: 100},
        // { ticketType: 'Senior/Child', price: 5 },
      ],
    },
    {
      category: 2,
      ticketTypes: [
        {ticketType: 'Adult', price: 80},
        // { ticketType: 'Senior/Child', price: 3 },
      ],
    },
  ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const querySnapshot = await firestore().collection('Pricing').get();
  //       const fetchedData = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setData(fetchedData);
  //       console.log(JSON.stringify(fetchedData));
  //     } catch (error) {
  //       console.error('Error fetching data from Firestore:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleTicketClick = (selection: ChartSelection) => {
    const seatInfo = extractSeatInfo(selection);
    setSelectedTicket([...selectedTicket, seatInfo]);

    const selectedCategory = selection.sectionCategory;
  };
  // console.log('Selected chart:', this.chart.data);
  const extractSeatInfo = (selection: ChartSelection): SeatInfo => {
    const {category, seatId} = selection;
    return {
      label: category.label || '',
      seat: seatId,
      ticketType: category.pricing.ticketTypes[0].ticketType || '',
      price: category.pricing.ticketTypes[0].price || '',
    };
  };

  const showTermsModalHandler = () => {
    setShowTermsModal(true);
  };

  const hideTermsModalHandler = () => {
    setShowTermsModal(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={'1'}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.scrollview}>
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

            <View style={styles.CheckOut}>
              <CheckOut
                ticket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
                selectedTicket={selectedTicket}
                eventKey="85607055-4e5e-41c9-9c2a-5328d3cc0c25"
                Client={Client}
                showTermsModalHandler={showTermsModalHandler}
                hideTermsModalHandler={hideTermsModalHandler}
                submit={submit}
                setSubmit={setSubmit}
              />
            </View>
          </View>
        )}
      />

      {showTermsModal && (
        <View style={styles.termsModal}>
          <Terms
            setSubmit={setSubmit}
            hideTermsModalHandler={hideTermsModalHandler}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  chart: {
    flex: 1,
    width: '100%',
    height: 400,
  },
  CheckOut: {
    flex: 1,
    width: '100%',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
  termsModal: {
    flex: 1,
    // height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SimpleSeatingChartWithChangeConfig;
