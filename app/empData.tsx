import { Entypo, FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Employee = {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    company: {
        name: string;
    };
    address: {
        suite: string;
        street: string;
        city: string;
    };
};

const DirectoryScreen = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    // Fetch data from API
    const fetchData = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.phone.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.company.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search employees..."
                style={styles.search}
                value={searchText}
                onChangeText={setSearchText}
            />
            <Text style={styles.heading}>Company Directory ({filteredEmployees.length})</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#1E90FF" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {filteredEmployees.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Text style={styles.name}>{item.name}</Text>

                            <View style={styles.row}>
                                <Entypo name="email" size={16} color="gray" />
                                <Text style={styles.text}> {item.email}</Text>
                            </View>

                            <View style={styles.row}>
                                <FontAwesome name="phone" size={16} color="gray" />
                                <Text style={styles.text}> {item.phone}</Text>
                            </View>

                            <Text style={styles.text}>{item.company.name}</Text>

                            <TouchableOpacity
                                onPress={() => Linking.openURL(`http://${item.website}`)}
                                style={styles.row}
                            >
                                <Entypo name="globe" size={16} color="#1E90FF" />
                                <Text style={[styles.text, { color: '#1E90FF' }]}> {item.website}</Text>
                            </TouchableOpacity>

                            <Text style={styles.address}>
                                {item.address.suite}, {item.address.street}, {item.address.city}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default DirectoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        padding: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    search: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        elevation: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
    },
    address: {
        fontSize: 13,
        color: '#555',
        marginTop: 8,
    },
});
