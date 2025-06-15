import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: 'Home',
        headerShown: false,
      }} />
      <Stack.Screen name="signup" options={{
        title: 'Signup',
        headerShown: false,
      }} />
      <Stack.Screen name="(tabs)" options={{
        headerShown: false,
      }} />
      <Stack.Screen name="settings" options={{
        title: 'Settings',
        headerShown: true,
      }} />
      <Stack.Screen name="deviceControl" options={{
        title: 'Device Control',
        headerShown: true,
      }} />
      <Stack.Screen name="weather" options={{
        title: 'Weather',
        headerShown: true,
      }} />
      <Stack.Screen name="empData" options={{
        title: 'Employee Directory',
        headerShown: true,
      }} />
    </Stack>
  );
}