import React, {useEffect, useMemo, useRef, useState} from 'react';
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
      };
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
      return {holdToken: 'mockHoldToken'};
    },
  },
  events: {
    hold: async (eventKey: string, seats: string[], holdToken: string) => {
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
  const chartRef = useRef(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore().collection('Pricing').get();
        const fetchedData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
        }));
        const newPricingData = fetchedData.reduce(
          (accumulator, {pricing, ...rest}) => {
            const flattenedPricing = pricing.map(
              ({ticketTypes, ...categoryRest}) => ({
                ...rest,
                ...categoryRest,
                ticketTypes: ticketTypes.map(({...ticketTypeRest}) => ({
                  ...ticketTypeRest,
                })),
              }),
            );

            return [...accumulator, ...flattenedPricing];
          },
          [],
        );
        setPricingData(newPricingData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const handleTicketClick = (selection: ChartSelection, index: any) => {
    const seatInfo = extractSeatInfo(selection, index);
    setSelectedTicket([...selectedTicket, seatInfo]);
  };
  const extractSeatInfo = (
    selection: ChartSelection,
    index: number,
  ): SeatInfo => {
    const {category, seatId} = selection;
    return {
      label: category.label || '',
      seat: seatId,
      ticketType: index.ticketType || '',
      price: index.price || '',
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
                onChartRendered={chart => (chartRef.current = chart)}
                pricing={pricingData}
                onObjectSelected={handleTicketClick}
                priceFormatter={function (price) {
                  return '₹' + price;
                }}
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
                chartRef={chartRef}
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
