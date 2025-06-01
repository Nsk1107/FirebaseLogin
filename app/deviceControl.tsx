import { Ionicons } from "@expo/vector-icons";
import { off, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { FIREBASE_DB_REALTIME } from "../firebaseConfig"; // adjust as needed

export default function SettingScreen() {
    const [isOn, setIsOn] = useState<boolean | null>(null); // null = loading state
    //console.log("Realtime DB instance:", FIREBASE_DB_REALTIME);

    useEffect(() => {
        const powerRef = ref(FIREBASE_DB_REALTIME, "devices/device1/power");

        const listener = onValue(powerRef, (snapshot) => {
            const value = snapshot.val();
            setIsOn(value === 1);
        });

        return () => {
            off(powerRef, "value", listener);
        };
    }, []);

    const handleToggle = async () => {
        if (isOn === null) return;
        const newState = !isOn;

        try {
            await set(ref(FIREBASE_DB_REALTIME, "devices/device1/power"), newState ? 1 : 0);
            // state is updated by the Firebase listener
        } catch (error) {
            console.error("Error writing to Firebase:", error);
        }
    };
    /*
        if (isOn === null) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    */
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Device Control</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>ESP32 Device Control</Text>
                <View style={styles.controlRow}>
                    <Ionicons name="power" size={36} color={isOn ? "green" : "gray"} />
                    <View style={styles.statusContainer}>
                        <Text style={styles.label}>Device Power</Text>
                        <Text style={[styles.status, { color: isOn ? "green" : "gray" }]}>
                            {isOn ? "ON" : "OFF"}
                        </Text>
                    </View>
                    <Switch value={isOn ?? false} onValueChange={handleToggle} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
    pageTitle: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
    controlRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    statusContainer: { flex: 1, marginLeft: 12 },
    label: { fontSize: 16, fontWeight: "500" },
    status: { fontSize: 14, fontWeight: "700" },
});
