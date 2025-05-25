import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FIREBASE_DB } from '../../firebaseConfig';

export default function FeedScreen() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<{ url: string, locationName: string, timestamp: Date }[]>([]);
    const [loading, setLoading] = useState(false);
    const Firestore = getFirestore();
    const userRef = collection(Firestore, "users");

    useEffect(() => {
        const fetchImagesFromFirestore = async () => {
            try {
                const snapshot = await getDocs(collection(FIREBASE_DB, 'uploadedImages'));
                const images = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        url: data.url,
                        locationName: data.locationName || 'Unknown location',
                        timestamp: data.timestamp?.toDate?.() || new Date(), // fallback to now
                    };
                });
                setUploadedImages(images.reverse()); // Newest first
            } catch (error) {
                console.error('❌ Failed to fetch images:', error);
            }
        };

        fetchImagesFromFirestore();
    }, []);

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
            const uri = result.assets[0].uri;
            const location = await getLocation();
            const compressedImage = await compressImageToUnder1MB(uri);
            await uploadImageToServer(compressedImage.uri, location);
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
            const uri = result.assets[0].uri;
            const compressedImage = await compressImageToUnder1MB(uri);
            await uploadImageToServer(compressedImage.uri, null);
        }
    };

    const compressImageToUnder1MB = async (uri: string) => {
        let compressQuality = 1.0;
        let result = null;
        let size = Infinity;

        while (compressQuality > 0 && size > 1048576) {
            result = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1000 } }],
                { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
            );

            const response = await fetch(result.uri);
            const blob = await response.blob();
            size = blob.size;

            compressQuality -= 0.1;
        }

        if (result) {
            return result;
        } else {
            throw new Error('Unable to compress image');
        }
    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location access is required.');
            return null;
        }

        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    };

    const uploadImageToServer = async (photoUri: string, location: { latitude: number, longitude: number } | null) => {
        console.log('📤 Uploading image to server:', photoUri);
        setLoading(true);
        const form = new FormData();

        form.append('image', {
            uri: photoUri,
            name: `photo_${Date.now()}.jpg`,
            type: 'image/jpeg',
        } as any);

        try {
            const res = await fetch('http://ea3141.mooo.com/api/upload.php?upload=image', {
                method: 'POST',
                body: form,
                headers: { 'Accept': 'application/json' },
            });

            const rawText = await res.text();
            const data = JSON.parse(rawText);

            if (data.response === true && data.result.success === true) {
                const uploadedUrl = data.result.path;
                let locationName = 'Unknown location';

                if (location) {
                    const reverseGeocode = await Location.reverseGeocodeAsync({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    });

                    locationName = reverseGeocode.length > 0
                        ? `${reverseGeocode[0].city || reverseGeocode[0].region}, ${reverseGeocode[0].country}`
                        : 'Unknown location';
                }

                await addDoc(collection(FIREBASE_DB, 'uploadedImages'), {
                    url: uploadedUrl,
                    timestamp: new Date(),
                    latitude: location?.latitude || null,
                    longitude: location?.longitude || null,
                    locationName: locationName,
                });

                // Refresh list by refetching
                const snapshot = await getDocs(collection(FIREBASE_DB, 'uploadedImages'));
                const images = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        url: data.url,
                        locationName: data.locationName || 'Unknown location',
                        timestamp: data.timestamp?.toDate?.() || new Date(), // fallback to now
                    };
                });
                setUploadedImages(images.reverse());

                Alert.alert('Upload Successful', 'Your photo has been uploaded successfully.');
            } else {
                Alert.alert('Upload Failed', data.result?.message || 'Unknown error');
            }

        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload Error', 'Something went wrong during upload.');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // in seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.feedContainer}>
                {/* Dynamic Firestore Images */}
                {uploadedImages.map((item, index) => (
                    <View style={styles.card} key={index}>
                        <Image source={{ uri: item.url }} style={styles.image} />
                        <Text style={styles.title}>{item.locationName}</Text>
                        <Text style={styles.time}>{formatTimeAgo(item.timestamp)}</Text>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
                <Ionicons name="camera" size={28} color="white" />
            </TouchableOpacity>

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
        flex: 1,
        backgroundColor: '#fff',
    },
    feedContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
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
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
});
