import React from 'react';
import { View, Text, Button } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Dashboard</Text>
      <Button title="View Child" onPress={() => navigation.navigate('ChildDetail')} />
      <Button title="Alerts" onPress={() => navigation.navigate('Alerts')} />
      <Button title="Controls" onPress={() => navigation.navigate('Controls')} />
    </View>
  );
}