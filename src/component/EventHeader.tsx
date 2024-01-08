import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SeatingContext, SeatingContextProps} from '../context/SeatingContext';
import axios from 'axios';

const EventHeader = () => {
  const {eventColData} = useContext<SeatingContextProps>(SeatingContext);

  const EventTimeDisplay = ({startTime, endTime}) => {
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      const optionsEnd = {
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      };

      const formattedStartDate = new Intl.DateTimeFormat(
        'en-US',
        options,
      ).format(startDate);
      const formattedEndDate = new Intl.DateTimeFormat(
        'en-US',
        optionsEnd,
      ).format(endDate);

      const formattedTimeRange = `${formattedStartDate} - ${formattedEndDate}`;
      setFormattedTime(formattedTimeRange);
    }, [startTime, endTime]);

    return (
      <View>
        <Text>{formattedTime}</Text>
      </View>
    );
  };

  const LocationDisplay = ({longitude, latitude}) => {
    const [location, setLocation] = useState('');

    useEffect(() => {
      const fetchLocation = async () => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCyM0xNTHAl4ULtp-J8VjohoLjOdvH8Fr0`,
          );

          if (response.data.results && response.data.results.length > 0) {
            const address = response.data.results[0].formatted_address;
            setLocation(address);
          } else {
            console.error('No results found for the given coordinates');
          }
        } catch (error) {
          console.error('Error fetching location:', error.message);
        }
      };

      fetchLocation();
    }, [longitude, latitude]);

    return (
      <View>
        <Text style={styles.text}>{location}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {eventColData && (
        <>
          <View>
            <Image style={styles.image} source={{uri: eventColData.image}} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.textBold}>{eventColData.name}</Text>
            <EventTimeDisplay
              startTime={eventColData.startTime}
              endTime={eventColData.endTime}
            />
            {/* <LocationDisplay
              longitude={eventColData.coordinates.longitude}
              latitude={eventColData.coordinates.latitude}
            /> */}
          </View>
        </>
      )}
    </View>
  );
};

export default EventHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: '50%',
    alignSelf: 'center',
    height: 120,
    objectFit: 'cover',
    marginTop: 10,
  },
  detailsContainer: {
    marginHorizontal: 30,
    marginVertical: 15,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  textBold: {
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
    paddingBottom: 5,
  },
});
