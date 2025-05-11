import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FeedScreen() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);

    const handleImagePick = () => {
        Alert.alert(
            'Upload Photo',
            'Choose an option',
            [
                { text: 'Camera', onPress: openCamera },
                { text: 'Gallery', onPress: openGallery },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Gallery access is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {/* Scrollable Feed */}
            <ScrollView contentContainerStyle={styles.feedContainer}>
                <View style={styles.card}>
                    <Image source={{ uri: 'https://picsum.photos/400/200?city' }} style={styles.image} />
                    <Text style={styles.title}>Pannipitiya, Western Province</Text>
                    <Text style={styles.time}>2 hours ago</Text>
                </View>

                <View style={styles.card}>
                    <Image source={{ uri: 'https://picsum.photos/400/200?desert' }} style={styles.image} />
                    <Text style={styles.title}>Anuradhapura, North Western Province</Text>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
                <Ionicons name="camera" size={28} color="white" />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 16,
    },
    feedContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100, // space for bottom nav
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2, // shadow for Android
        shadowColor: '#000', // shadow for iOS
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    image: {
        width: '100%',
        height: 180,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        padding: 10,
    },
    time: {
        fontSize: 12,
        color: 'gray',
        paddingLeft: 10,
        paddingBottom: 10,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    navButton: {
        padding: 10,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#007bff',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
});
