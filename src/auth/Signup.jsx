import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignupUser } from '../utils/api';

export default function Signup() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      if (!name || !email || !password || !phone) {
        Alert.alert('All fields are required!');
        return;
      }
      const response = await SignupUser({ name, email, password, phone });
      await AsyncStorage.setItem('user', JSON.stringify(response));
      navigation.navigate('Tabs', { email });
    } catch (error) {
      console.error('Signup failed:', error);
      Alert.alert('Signup Failed', error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 justify-center px-6 bg-white`}>
      <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>Create new</Text>
      <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>account</Text>
      <Text style={tw`text-sm text-gray-500 mb-6`}>
        Already have an account?{' '}
        <Text style={tw`text-red-500 font-semibold`} onPress={() => navigation.navigate('Signin')}>
          Sign In
        </Text>
      </Text>

      <View style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}>
        <Ionicons name="person-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your name"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={tw`flex-row items-center bg-white border rounded-xl px-4 py-1 mb-2`}>
        <Ionicons name="mail-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your email"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your password"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}>
        <Ionicons name="call-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your phone number"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={tw`mr-2`}>
          <Ionicons
            name={rememberMe ? 'checkbox-outline' : 'square-outline'}
            size={24}
            color={rememberMe ? '#EF4444' : 'gray'}
          />
        </TouchableOpacity>
        <Text style={tw`text-sm text-gray-700`}>Remember me</Text>
      </View>

      <TouchableOpacity style={tw`bg-red-500 py-3 rounded-xl mb-6`} onPress={handleSignup}>
        <Text style={tw`text-white text-center font-semibold`}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={tw`text-xs text-gray-400 text-center px-6 mb-6`}>
        By clicking “Sign Up” you agree to Recognote's{' '}
        <Text style={tw`text-red-500`}>Term of Use</Text> and{' '}
        <Text style={tw`text-red-500`}>Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
}
