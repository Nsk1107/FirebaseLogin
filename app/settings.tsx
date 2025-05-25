import * as Location from 'expo-location';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';

export default function SettingsScreen() {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const fetchUserDataAndLocation = async () => {
      if (!FIREBASE_AUTH.currentUser) return;

      // Get user data from Firestore
      try {
        const docRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || '');
          setMobileNumber(data.mobileNumber || '');
          setEmail(data.email || '');
          setLatitude(data.latitude || '');
          setLongitude(data.longitude || '');
        }
      } catch (error: any) {
        Alert.alert('Error loading settings', error.message);
      }

      // Get user location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          setLoadingLocation(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude.toString());
        setLongitude(location.coords.longitude.toString());
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert('Error getting location', error.message);
        } else {
          Alert.alert('Error getting location', 'An unknown error occurred');
        }
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchUserDataAndLocation();
  }, []);

  const saveSettings = async () => {
    if (!FIREBASE_AUTH.currentUser) {
      Alert.alert('You must be logged in');
      return;
    }

    try {
      await setDoc(doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid), {
        fullName,
        mobileNumber,
        email,
        latitude,
        longitude,
      }, { merge: true });

      Alert.alert('Settings saved!');
    } catch (error: any) {
      Alert.alert('Error saving settings', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Enter full name" />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput style={styles.input} value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" placeholder="Enter mobile number" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Enter email" />

      {loadingLocation ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#007BFF" />
          <Text>Getting location...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.label}>Latitude</Text>
          <TextInput style={styles.input} value={latitude} editable={false} />

          <Text style={styles.label}>Longitude</Text>
          <TextInput style={styles.input} value={longitude} editable={false} />
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings} disabled={loadingLocation}>
        <Text style={styles.saveText}>Save Setting</Text>
      </TouchableOpacity>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  loadingBox: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
