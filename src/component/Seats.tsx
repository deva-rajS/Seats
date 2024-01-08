import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';
import {SeatingContext, SeatingContextProps} from '../context/SeatingContext';
import CheckOut from './CheckOut';
import Terms from './Terms';
import EventHeader from './EventHeader';

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

const SimpleSeatingChartWithChangeConfig: React.FC = () => {
  const {
    eventKey,
    selectedTicket,
    setSelectedTicket,
    pricingData,
    showTermsModal,
    chartRef,
  } = useContext<SeatingContextProps>(SeatingContext);

  const handleTicketClick = (selection: ChartSelection, index: any) => {
    const seatInfo = extractSeatInfo(selection, index);
    setSelectedTicket([...selectedTicket, seatInfo]);
    chartRef.current
      .getReportBySelectability()
      .then(categories => console.log('categories :', categories.selectable));
    console.log('chartRef :', chartRef.current);
  };

  const extractSeatInfo = (
    selection: ChartSelection,
    index: number,
  ): SeatInfo => {
    const {category, seatId} = selection;
    // console.log('Selection :', selection);
    return {
      label: category.label || '',
      seat: seatId,
      ticketType: (category.pricing.ticketTypes && index.ticketType) || '',
      price: category.pricing.ticketTypes
        ? index.price
        : category.pricing.price || '',
    };
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={'1'}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.scrollview}>
            <EventHeader />
            <View style={styles.chart}>
              <SeatsioSeatingChart
                region="eu"
                workspaceKey="38e8358c-1de3-44f8-95fa-497f582e9036"
                event={eventKey}
                onChartRendered={chart => (chartRef.current = chart)}
                pricing={pricingData}
                onObjectSelected={handleTicketClick}
                priceFormatter={price => '₹' + price}
              />
            </View>
            <View style={styles.CheckOut}>
              <CheckOut />
            </View>
          </View>
        )}
      />

      {showTermsModal && (
        <View style={styles.termsModal}>
          <Terms />
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
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
});

export default SimpleSeatingChartWithChangeConfig;
