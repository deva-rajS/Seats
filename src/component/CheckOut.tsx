import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import firestore from '@react-native-firebase/firestore';
import Promo from './Promo';

interface CheckOutProps {
  ticket: any[];
  onClose: () => void;
  setSelectedTicket: (selectedTicket: any[]) => void;
  selectedTicket: any[];
  Client: any;
  eventKey: string;
  showTermsModalHandler: () => void;
  submit: boolean;
  setSubmit: (submit: boolean) => void;
  hideTermsModalHandler: () => void;
  chartRef: any;
}

const CheckOut: React.FC<CheckOutProps> = ({
  ticket,
  setSelectedTicket,
  selectedTicket,
  Client,
  eventKey,
  showTermsModalHandler,
  submit,
  setSubmit,
  chartRef,
}) => {
  const [price, setPrice] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [promoCode, onChangePromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('EventPromoCode')
          .get();
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    TotalPrice();
  }, [ticket]);
  useEffect(() => {
    submit && handleCheckout();
  }, [submit]);
  function TotalPrice() {
    setPrice(prevPrice => {
      return ticket.reduce((accumulator, item) => accumulator + item.price, 0);
    });
  }

  async function createHoldToken() {
    try {
      const holdTokenResponse = await Client.holdTokens.create();
      return holdTokenResponse.holdToken;
    } catch (error) {
      console.error('Error creating hold token:', error);
      throw error;
    }
  }
  async function holdSeats(holdToken: string, seats: string) {
    try {
      await Client.events.hold(eventKey, seats, holdToken);
    } catch (error) {
      console.error('Error holding seats:', error);
      throw error;
    }
  }
  function consolidateLabels(ticket: any[]) {
    const consolidatedTicket: any[] = [];
    // console.log(RazorpayCheckout);

    ticket.forEach(item => {
      const existingItemIndex = consolidatedTicket.findIndex(
        consolidatedItem => consolidatedItem.label === item.label,
      );

      if (existingItemIndex !== -1) {
        consolidatedTicket[existingItemIndex].seat += `, ${item.seat}`;
        consolidatedTicket[existingItemIndex].price += item.price;
        consolidatedTicket[existingItemIndex].ticketType.add(item.ticketType);
        if (item.ticketType === 'Senior/Child') {
          consolidatedTicket[existingItemIndex].SnCCount += 1;
        }
        if (item.ticketType === 'Adult') {
          consolidatedTicket[existingItemIndex].AdultCount += 1;
        }
      } else {
        consolidatedTicket.push({
          label: item.label,
          seat: item.seat,
          ticketType: new Set([item.ticketType]),
          price: item.price,
          AdultCount: item.ticketType === 'Adult' && 1,
          SnCCount: item.ticketType === 'Senior/Child' && 1,
        });
      }
    });

    return consolidatedTicket;
  }
  const handleCloseTicketDetails = async (index: number) => {
    const closedItem = selectedTicket[index];
    const updatedTicket = [...selectedTicket];

    chartRef.current
      .findObject(closedItem.seat)
      .then(seatObject => seatObject.deselect(closedItem.ticketType))
      .then(() =>
        console.log(
          `Seat ${closedItem.seat} deselected for ${closedItem.ticketType}`,
        ),
      );

    updatedTicket.splice(index, 1);
    setSelectedTicket(updatedTicket);
    setPrice(prevprice => prevprice - closedItem.price);
  };

  const handleCheckout = async () => {
    try {
      const holdToken = await createHoldToken();
      const consolidatedTicket = consolidateLabels(ticket);
      for (const item of consolidatedTicket) {
        await holdSeats(holdToken, [item.seat]);
      }
      const options = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_1DP5mmOlF5G5ag',
        amount: price * 100,
        name: 'Dev',
        prefill: {
          email: 'void@razorpay.com',
          contact: '9191919191',
          name: 'Razorpay Software',
        },
        theme: {color: '#B961C7'},
      };

      RazorpayCheckout.open(options)
        .then(data => {
          console.log(`Success: ${data.razorpay_payment_id}`);
        })
        .catch(error => {
          console.error(`Error: ${error} | ${error.description}`);
          if (
            error &&
            error.error &&
            error.error.reason === 'payment_cancelled'
          ) {
            const {code, description, source, metadata} = error.error;
            console.log(
              `Payment canceled - Code: ${code}, Description: ${description}, Source: ${source}`,
            );
            console.log('Releasing hold token:', holdToken);
          }
        });
    } catch (error) {
      console.error('Error during checkout:', error);
    }
    setSubmit(false);
  };

  function handleApply() {
    data.map(item => {
      if (!promoApplied) {
        if (promoCode === item.code) {
          if (item.discountType === 'actual') {
            setPrice(prevPrice => prevPrice - item.discountValue);
          }
          if (item.discountType === 'percent') {
            setPrice(prevPrice => prevPrice * (item.discountValue / 100));
          }
          setPromoApplied(true);
        }
      }
    });
  }
  const renderItem = ({item, index}) => (
    <View style={styles.categoryContainer}>
      <View style={styles.itemContainer}>
        <Text style={styles.textBold}>Orchestra</Text>
        <Text style={styles.textBold}>₹80 - ₹100</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.text}>Adult</Text>
        <Text style={styles.text}>80</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.text}>Processing Fee</Text>
        <Text style={styles.text}>5</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.text}>Upsc Cost</Text>
        <Text style={styles.text}>3</Text>
      </View>
    </View>
  );
  const renderSelectedItem = ({item, index}) => (
    <View style={styles.categoryContainer}>
      <View style={styles.itemContainer}>
        <Text style={styles.textBold}>{item.label}</Text>
        <TouchableOpacity onPress={() => handleCloseTicketDetails(index)}>
          <Text style={styles.textBold}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.itemContainer}>
        <View style={styles.ticketTypesContainer}>
          {Array.from(item.ticketType).map((val, index) => (
            <Text key={index} style={styles.text}>
              {val === 'Senior/Child'
                ? `${item.SnCCount} x ${val}`
                : `${item.AdultCount} x ${val}`}
            </Text>
          ))}
        </View>
        <Text style={styles.text}>{item.price}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.textBold}>Tickets</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.text}>
          {item.label} {item.seat}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.promo}>
        <Promo
          onChangePromoCode={onChangePromoCode}
          promoCode={promoCode}
          handleApply={handleApply}
        />
      </View>
      <FlatList
        scrollEnabled
        data={selectedTicket.length > 0 ? consolidateLabels(ticket) : '1'}
        renderItem={selectedTicket.length > 0 ? renderSelectedItem : renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatList}
      />
      {selectedTicket.length > 0 && (
        <>
          <View style={styles.subConatiner}>
            <View style={styles.itemContainerHorizontal}>
              <Text style={styles.textBold}>{ticket.length} Seat</Text>
              <Text style={styles.textBold}>{price}</Text>
            </View>
            <View style={styles.itemContainerHorizontal}>
              <Text style={styles.text}>Processing Fee</Text>
              <Text style={styles.text}>3</Text>
            </View>
            <View style={styles.itemContainerHorizontal}>
              <Text style={styles.text}>Upsc Cost</Text>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={styles.itemContainerHorizontal}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>{price}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnCheckout}
            onPress={() => showTermsModalHandler()}>
            <Text style={styles.btnText}>Checkout</Text>
          </TouchableOpacity>
        </>
      )}
      {/* <Terms /> */}
    </View>
  );
};
export default CheckOut;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white',
    paddingTop: 15,
    borderRadius: 5,
    columnGap: 5,
    rowGap: 5,
  },
  categoryContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  flatList: {
    backgroundColor: '#E3E3E3',
  },
  subConatiner: {
    backgroundColor: 'lightgray',
    rowGap: 5,
    paddingVertical: 10,
    // marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginHorizontal: 15,
  },
  itemContainerHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  itemContainerVertical: {
    paddingHorizontal: 20,
    rowGap: 5,
  },
  btnCheckout: {
    marginHorizontal: 10,
    backgroundColor: 'darkviolet',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  textBold: {
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
  },
  totalText: {
    color: 'red',
    fontWeight: '500',
    fontSize: 18,
  },
  promo: {
    marginHorizontal: 10,
  },
  ticketTypesContainer: {
    flexDirection: 'column',
  },
});
