import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RazorpayCheckout from 'react-native-razorpay';

export default function CheckOut({
  ticket,
  onClose,
  setSelectedTicket,
  selectedTicket,
  Client,
  eventKey,
}) {
  const [price, setPrice] = useState(0);
  useEffect(() => {
    TotalPrice();
  }, [ticket]);
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
  async function holdSeats(holdToken, seats) {
    try {
      await Client.events.hold(eventKey, seats, holdToken);
    } catch (error) {
      console.error('Error holding seats:', error);
      throw error;
    }
  }
  function consolidateLabels(ticket) {
    const consolidatedTicket = [];
    // console.log(RazorpayCheckout);

    ticket.forEach(item => {
      const existingItemIndex = consolidatedTicket.findIndex(
        consolidatedItem => consolidatedItem.label === item.label,
      );

      if (existingItemIndex !== -1) {
        // If the label already exists, update the existing item
        consolidatedTicket[existingItemIndex].seat += `, ${item.seat}`;
        consolidatedTicket[existingItemIndex].price += item.price;
        consolidatedTicket[existingItemIndex].count += 1;
      } else {
        // Otherwise, add a new item to the consolidated array
        consolidatedTicket.push({
          label: item.label,
          seat: item.seat,
          ticketType: item.ticketType,
          price: item.price,
          count: 1,
        });
      }
    });

    return consolidatedTicket;
  }
  const handleCloseTicketDetails = async index => {
    const closedItem = selectedTicket[index];
    const updatedTicket = [...selectedTicket];

    this.chart
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
    // console.log('ticketindex :', JSON.stringify(ticket[index], null, 2));
  };

  const handleCheckout = async () => {
    try {
      // Create a hold token
      const holdToken = await createHoldToken();

      // Perform holds using the created hold token
      const consolidatedTicket = consolidateLabels(ticket);
      for (const item of consolidatedTicket) {
        await holdSeats(holdToken, [item.seat]);
      }
      const options = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_1DP5mmOlF5G5ag', // Your Razorpay API key
        amount: price * 100, // Amount is in paisa (multiply by 100 for rupees)
        name: 'Dev',
        prefill: {
          email: 'void@razorpay.com',
          contact: '9191919191',
          name: 'Razorpay Software',
        },
        theme: {color: '#F37254'},
      };

      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          console.log(`Success: ${data.razorpay_payment_id}`);
        })
        .catch(error => {
          // handle failure
          console.error(`Error: ${error} | ${error.description}`);
          if (
            error &&
            error.error &&
            error.error.reason === 'payment_cancelled'
          ) {
            // Extract additional details from the error object
            const {code, description, source, metadata} = error.error;

            // Log information about the canceled payment
            console.log(
              `Payment canceled - Code: ${code}, Description: ${description}, Source: ${source}`,
            );

            // Release the hold token
            console.log('Releasing hold token:', holdToken);
            // Add logic to release the hold token using your client
            // For example: client.holdTokens.release(holdToken);
          }
        });
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.categoryContainer}>
      <View style={styles.itemContainer}>
        <Text style={styles.textBold}>{item.label}</Text>
        <TouchableOpacity onPress={() => handleCloseTicketDetails(index)}>
          <Text style={styles.textBold}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.text}>
          {item.count} x {item.ticketType}
        </Text>
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
      <FlatList
        scrollEnabled
        data={consolidateLabels(ticket)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* <Button title="Close" onPress={onClose} /> */}
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
      <TouchableOpacity style={styles.btnCheckout} onPress={handleCheckout}>
        <Text style={styles.btnText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray',
    marginHorizontal: 10,
    marginBottom: 10,
    paddingTop: 15,
    borderRadius: 5,
    columnGap: 5,
    rowGap: 5,
  },
  categoryContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  subConatiner: {
    rowGap: 5,
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
    backgroundColor: 'violet',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
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
});
