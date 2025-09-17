import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput placeholder="Email" style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Password" secureTextEntry style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Login" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Register" onPress={() => {}} />
    </View>
  );
}