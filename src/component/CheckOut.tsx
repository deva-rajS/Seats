import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';

export default function CheckOut({
  ticket,
  onClose,
  setSelectedTicket,
  selectedTicket,
  handleDeselect,
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
  function consolidateLabels(ticket) {
    const consolidatedTicket = [];

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
  const handleCloseTicketDetails = index => {
    const closedItemPrice = selectedTicket[index].price;
    const updatedTicket = [...selectedTicket];
    updatedTicket.splice(index, 1);
    setSelectedTicket(updatedTicket);
    setPrice(prevprice => prevprice - closedItemPrice);
    console.log(
      'ticketindex :',
      JSON.stringify(selectedTicket[index], null, 2),
    );
    console.log(`closedItem: ${price - closedItemPrice}`);
    // handleDeselect(selectedTicket[index]);
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
      <TouchableOpacity
        onPress={() => console.log('Checkout')}
        style={styles.btnCheckout}>
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
