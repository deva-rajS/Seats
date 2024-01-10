import React, {useEffect} from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';
import {faBars} from '@fortawesome/free-solid-svg-icons';
library.add(faGoogle, faBars);
export interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
export async function GoogleSignInProcess() {
  GoogleSignin.configure({
    offlineAccess: false,
    webClientId:
      '481080137238-v70f8vje1p6mjje5vlvi3cvql4nsn7n8.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });
  try {
    // Check if play services are available
    await GoogleSignin.hasPlayServices();

    const isSignedIn = await GoogleSignin.isSignedIn();

    if (!isSignedIn) {
      // Get the user's ID token
      const {idToken, user} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      Alert.alert('Successfully Logged In');
      // console.log('User Credentials:', userCredential);
    }
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('Google Sign-In Cancelled');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert('Google Sign-In in Progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert('Google Play Services not available');
    } else {
      Alert.alert('Error', error.message);
      console.log('Google Sign-In Error:', error);
    }
  }
}

export async function GoogleSignOut() {
  GoogleSignin.configure({
    offlineAccess: false,
    webClientId:
      '481080137238-v70f8vje1p6mjje5vlvi3cvql4nsn7n8.apps.googleusercontent.com',
    // scopes: ['profile', 'email'],
  });
  try {
    // Check if play services are available
    await GoogleSignin.hasPlayServices();

    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      // Get the user's ID token
      await GoogleSignin.signOut();
      Alert.alert('Successfully Log Out');
    }
  } catch (error) {
    console.log('Google Sign-Out Error:', error);
  }
}
function GoogleSignInButton() {
  return (
    <TouchableOpacity style={styles.button} onPress={GoogleSignInProcess}>
      <FontAwesomeIcon icon={faGoogle} color={'white'} />
    </TouchableOpacity>
  );
}
function GoogleSignOutButton() {
  return (
    <TouchableOpacity style={styles.button} onPress={GoogleSignOut}>
      <FontAwesomeIcon icon={faGoogle} color={'violet'} />
    </TouchableOpacity>
  );
}

export default function GoogleSignIn() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuContainer}>
        <FontAwesomeIcon icon={faBars} style={styles.buttonText} size={30} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: '#C75052',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 16,
  },
  menuContainer: {
    alignItems: 'center',
  },
});
