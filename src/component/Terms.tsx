import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {SeatingContext, SeatingContextProps} from '../context/SeatingContext';
library.add(faCheck);

const Terms: React.FC = () => {
  const {setSubmit, hideTermsModalHandler} =
    useContext<SeatingContextProps>(SeatingContext);
  const [isSelected, setSelection] = useState(false);
  const toggleCheckbox = () => {
    setSelection(!isSelected);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Terms and Conditions</Text>
      </View>
      <View style={styles.contantContainer}>
        <Text style={styles.heading}>
          BKRS LLC - Ticketing Terms and Conditions
        </Text>
        <Text style={styles.textContant}>
          Thank you for your interest in The Kingdom. Before you proceed to
          purchase tickets, we strongly recommend you to go through the
          following event ticketing terms and conditions template.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={toggleCheckbox}
          style={styles.checkboxContainer}>
          {isSelected ? (
            <View style={[styles.checkbox, styles.checkboxSlected]}>
              <FontAwesomeIcon icon={faCheck} color={'white'} />
            </View>
          ) : (
            <View style={styles.checkbox}></View>
          )}

          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          {isSelected ? (
            <TouchableOpacity
              style={[styles.buttonSubmit, styles.buttonSubmitSelected]}
              onPress={() => {
                setSubmit(true), hideTermsModalHandler();
              }}>
              <Text style={styles.buttonCancelText}>Submit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonSubmit}>
              <Text style={styles.buttonSubmitText}>Submit</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={hideTermsModalHandler}>
            <Text style={styles.buttonCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Terms;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contantContainer: {
    borderColor: 'black',
    borderWidth: 0.2,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSlected: {
    backgroundColor: 'darkviolet',
    borderWidth: 0,
  },
  icon: {
    width: 15,
    height: 15,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  buttonSubmit: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  buttonCancel: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'darkorange',
    borderRadius: 5,
  },
  buttonCancelText: {
    color: 'white',
    fontWeight: '500',
  },
  buttonSubmitText: {
    color: 'gray',
    fontWeight: '500',
  },
  acceptText: {
    color: 'black',
    fontWeight: '500',
  },
  buttonSubmitSelected: {
    backgroundColor: 'darkviolet',
  },
  title: {
    color: 'black',
    fontWeight: '400',
    fontSize: 18,
    marginHorizontal: 15,
    paddingBottom: 5,
  },
  heading: {
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 40,
  },
  textContant: {
    color: 'black',
    lineHeight: 20,
  },
});
