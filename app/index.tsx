import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';


export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = FIREBASE_AUTH;
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', response);
      Alert.alert('Login successful');
      router.push('/feed'); // navigate to feed after login
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login error', error.message);
    }
    setLoading(false);
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text style={styles.text}>Don't have an account?</Text>
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.link}> Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff', padding: 20,
  },
  title: {
    fontSize: 32, fontWeight: 'bold', marginBottom: 40,
  },
  input: {
    width: '100%', height: 50, borderColor: '#ccc',
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF', paddingVertical: 15,
    paddingHorizontal: 60, borderRadius: 8, marginBottom: 20,
  },
  buttonText: {
    color: '#fff', fontSize: 18, fontWeight: '600',
  },
  link: {
    color: '#007AFF', fontSize: 16,
  },
  text: {
    fontSize: 16, color: '#333',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
