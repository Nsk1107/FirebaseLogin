import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Please fill all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Passwords do not match');
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, email.trim(), password);
            console.log('User created:', response.user);

            await sendEmailVerification(response.user);
            Alert.alert('Account created', 'Please verify your email address.');
            router.push('/');
        } catch (error: any) {
            console.error('Signup error:', error);
            Alert.alert('Signup error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={signUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={styles.text}>Already have an account?</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.link}> Log In</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 8,
        marginBottom: 20,
    },
    link: {
        color: '#007AFF',
        fontSize: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
