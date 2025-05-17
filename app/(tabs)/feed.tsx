import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FeedScreen() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);


    const handleImagePick = () => {
        Alert.alert(
            'Upload Photo',
            'Choose an option',
            [
                { text: 'Camera', onPress: openCamera },
                { text: 'Gallery', onPress: openGallery },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: false }
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
            //setUploadedImages(prev => [...prev, uri]);
            await uploadImageToServer(uri);
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
            //setUploadedImages(prev => [...prev, uri]);
            await uploadImageToServer(uri);
        }
    };

    const uploadImageToServer = async (photoUri: string) => {
        console.log('📤 Uploading image to server:', photoUri); // Log the image URI being uploaded
        setLoading(true);
        const form = new FormData();

        form.append('image', {
            uri: photoUri,
            name: `photo_${Date.now()}.jpg`,
            type: 'image/jpeg',
        } as any);

        //console.log('📤 Form data:', form); // Log the form data being sent

        try {
            const res = await fetch('http://ea3141.mooo.com/api/upload.php?upload=image', {
                method: 'POST',
                body: form,
                headers: { 'Accept': 'application/json' },
            });

            //console.log('📤 Server response status:', res.status);
            //console.log('📤 Server response headers:', res.headers);

            // Get raw response text
            const rawText = await res.text();
            console.log('📄 Raw response text:\n', rawText);

            // Try to parse JSON
            const data = JSON.parse(rawText);
            console.log('✅ Parsed JSON:\n', data);

            //const data = await res.json();

            if (data.response === true && data.result.success === true) {
                const uploadedUrl = data.result.path;
                console.log('📸 Uploaded URL:', uploadedUrl);
                setUploadedImages(prev => [...prev, uploadedUrl]);
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

                {/* Dynamically added images */}
                {uploadedImages.map((uri, index) => (
                    <View style={styles.card} key={index}>
                        <Image source={{ uri }} style={styles.image} />
                        <Text style={styles.title}>{`#${index + 1}`}</Text>
                        <Text style={styles.time}>Just now</Text>
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
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },

});
