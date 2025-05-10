import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="feed" options={{
        title: 'Feed',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
        ),
      }} />
    </Tabs>
  );
}
