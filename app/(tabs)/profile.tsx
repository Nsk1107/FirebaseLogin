import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH } from '../../firebaseConfig';

export default function ProfileScreen() {
    const [email, setEmail] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const auth = FIREBASE_AUTH;
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email);
            setUserId(user.uid);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/'); // or use router.push('/') if appropriate
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Profile</Text>
                <Text style={styles.email}>Email: {email}</Text>
                <Text style={styles.userId}>User ID: {userId}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        //flex: 1,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        alignSelf: 'center',
    },
    email: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    userId: {
        fontSize: 14,
        color: '#999',
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#FF3B30',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
