import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const API_KEY = '4c684792b89788e392bba0693a501aa9';

export default function WeatherScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState<any>(null);

    const fetchWeather = async (lat: number, lon: number) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data) {
                console.log('Weather data:', data);
                setWeather(data);
            }
        } catch (error) {
            console.error('Failed to fetch weather:', error);
        } finally {
            setLoading(false);
        }
    };

    function getCardinalDirection(deg: number): string {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(deg / 45) % 8;
        return directions[index];
    }


    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Location permission denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            fetchWeather(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!weather) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Unable to load weather data.</Text>
            </SafeAreaView>
        );
    }

    const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <View style={styles.container}>

            <View style={styles.card}>
                <Text style={styles.location}>
                    {weather.name}, {weather.sys.country}
                </Text>

                <Image
                    source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }}
                    style={styles.weatherIcon}
                />

                <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
                <Text style={styles.description}>{weather.weather[0].description}</Text>
                <Text style={styles.feelsLike}>
                    Feels like {weather.main.feels_like}°C
                </Text>

                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridTitle}>Humidity</Text>
                        <Text style={styles.gridValue}>{weather.main.humidity}%</Text>
                    </View>

                    <View style={styles.gridItem}>
                        <Text style={styles.gridTitle}>Wind Speed & Dir</Text>
                        <Text style={styles.gridValue}>{weather.wind.speed} m/s</Text>
                        <Text style={styles.gridValue}>{getCardinalDirection(weather.wind.deg)} ({weather.wind.deg}°)</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridTitle}>Pressure</Text>
                        <Text style={styles.gridValue}>{weather.main.pressure} hPa</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridTitle}>Visibility</Text>
                        <Text style={styles.gridValue}>{weather.visibility / 1000} km</Text>
                    </View>



                    <View style={styles.gridItem}>
                        <Text style={styles.gridTitle}>Sunrise</Text>
                        <Text style={styles.gridValue}>{sunrise}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridTitle}>Sunset</Text>
                        <Text style={styles.gridValue}>{sunset}</Text>
                    </View>


                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'gray',
        flex: 1,
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtn: {
        marginBottom: 10,
    },
    backText: {
        fontSize: 16,
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    location: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    weatherIcon: {
        width: 60,
        height: 60,
        marginVertical: 10,
    },
    temp: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 16,
        textTransform: 'capitalize',
        color: '#666',
        marginVertical: 4,
    },
    feelsLike: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#EAF0F1',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 6,
    },
    gridTitle: {
        fontSize: 12,
        color: '#555',
    },
    gridValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sunTimes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    sunTimeItem: {
        alignItems: 'center',
        flex: 1,
    },
});
