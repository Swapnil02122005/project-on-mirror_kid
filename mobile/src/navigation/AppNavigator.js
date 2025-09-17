import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChildDetailScreen from '../screens/ChildDetailScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ControlsScreen from '../screens/ControlsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ChildDetail" component={ChildDetailScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
      <Stack.Screen name="Controls" component={ControlsScreen} />
    </Stack.Navigator>
  );
}