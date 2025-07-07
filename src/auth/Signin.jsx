import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SigninUser } from '../utils/api';
// import { useDispatch } from 'react-redux'; // if Redux is implemented

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();
  // const dispatch = useDispatch();

  const handleSignin = async () => {
    console.log('Logging in with:', email, password);
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      // Optional: dispatch({ type: 'LOGIN_START' });

      const res = await SigninUser(email, password);

      if (res?.success || res?.token) {
        console.log('Login success:', res);
        
        // Redux update if needed
        // dispatch({ type: 'LOGIN_SUCCESS', payload: res.user });

        // Store token and user info in AsyncStorage
        await AsyncStorage.setItem('userToken', res.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.user));

        navigation.replace('Tabs');
      } else {
        Alert.alert('Login Failed', res.message || 'Invalid credentials');
        // dispatch({ type: 'LOGIN_FAILURE' });
      }
    } catch (error) {
      console.error('Login Error:', 'Error', error?.response?.data?.message);
      Alert.alert('Error', error?.response?.data?.message || 'Network error. Please try again.');
      // dispatch({ type: 'LOGIN_FAILURE' });
      
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={tw`flex-grow justify-start px-6 pt-10`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>Sign in to</Text>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>your account</Text>

        <Text style={tw`text-sm text-gray-600 mb-6`}>
          Don’t have an account?{' '}
          <Text style={tw`text-red-500 font-semibold`} onPress={() => navigation.navigate('Signup')}>
            Sign Up
          </Text>
        </Text>

        {/* Email Input */}
        <View style={tw`flex-row items-center border rounded-lg px-3 py-1 mb-4 bg-gray-100`}>
          <FontAwesome name="envelope" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}>
          <FontAwesome name="lock" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={tw`flex-row items-center`}
          >
            <View style={tw`w-4 h-4 mr-2 border border-gray-400 rounded items-center justify-center`}>
              {rememberMe && <FontAwesome name="check" size={10} color="#EF4444" />}
            </View>
            <Text style={tw`text-sm text-gray-700`}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
            <Text style={tw`text-sm text-red-500 font-semibold`}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={tw`bg-red-500 py-3 rounded-xl mb-6`} onPress={handleSignin}>
          <Text style={tw`text-white text-center font-semibold`}>Sign in</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`flex-1 h-px bg-gray-300`} />
          <Text style={tw`px-2 text-sm text-gray-400`}>or sign in with</Text>
          <View style={tw`flex-1 h-px bg-gray-300`} />
        </View>

        {/* Social Buttons */}
        <View style={tw`mb-4`}>
          <TouchableOpacity style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}>
            <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={tw`text-sm`}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}>
            <Image source={{ uri: 'https://img.icons8.com/color/48/facebook-new.png' }} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={tw`text-sm`}>Sign in with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white`}>
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/mac-os.png' }} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={tw`text-sm`}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
