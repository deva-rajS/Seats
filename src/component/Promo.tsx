import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import {useEffect, useState} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
library.add(faCircleQuestion);

interface PromoProps {
  promoCode: string;
  onChangePromoCode: (text: string) => void;
  handleApply: () => void;
}
const Promo: React.FC<PromoProps> = ({
  promoCode,
  onChangePromoCode,
  handleApply,
}) => {
  const [togglePromo, setTogglePromo] = useState(true);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    if (minutes > 0 || seconds > 0) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes(prevMinutes => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds(prevSeconds => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.textBold}>Promo</Text>
      </View>
      {togglePromo ? (
        <TouchableHighlight>
          <Text style={styles.text} onPress={() => setTogglePromo(false)}>
            Do You have a promo code?
          </Text>
        </TouchableHighlight>
      ) : (
        <View>
          <View>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangePromoCode}
              value={promoCode}
              placeholder="Promo Code"></TextInput>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableHighlight
              style={[styles.button, styles.buttonApply]}
              onPress={handleApply}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setTogglePromo(true)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      )}
      <View style={styles.timerContainer}>
        <Text style={styles.textBold}>Tickets</Text>
        <View style={styles.timer}>
          <Text style={styles.textBold}>
            {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
              2,
              '0',
            )}`}
            &nbsp;
            <FontAwesomeIcon icon={faCircleQuestion} color={'black'} />
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Promo;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.2,
    paddingBottom: 8,
  },
  titleContainer: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.2,
  },
  textBold: {
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
  },
  text: {
    fontSize: 16,
    color: 'blue',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  button: {
    color: 'white',
    width: 80,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonApply: {
    backgroundColor: 'darkviolet',
  },
  buttonCancel: {
    backgroundColor: 'darkorange',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  textInput: {
    borderColor: 'darkviolet',
    borderWidth: 1.5,
    marginBottom: 10,
    borderRadius: 5,
  },
  timerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
});
