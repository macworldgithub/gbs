import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function GroupChat() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route?.params?.user || { name: 'Unknown User' };

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey! I’m finally on vacation! 🌴❄️\nJust wanted to share some pictures with you.', fromMe: false, time: '10.24 PM' },
    { id: '2', text: 'Wow, these look amazing! 😍\nWhere are you?', fromMe: true, status: 'seen', time: '10.24 PM' },
    {
      id: '3',
      type: 'images',
      images: [
        require('../../assets/event1.png'),
        require('../../assets/event2.png'),
        require('../../assets/event3.png'),
        require('../../assets/event1.png'),
      ],
      text: "Thanks! I’m at Bali, the weather is perfect!\nWish you were here!",
      fromMe: false,
      time: '10.24 PM'
    },
    {
      id: '4',
      text: 'That sounds incredible! Enjoy your trip, and send more pics! 🇺🇸',
      fromMe: true,
      status: 'delivered',
      time: '10.24 PM'
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: (messages.length + 1).toString(),
      text: newMessage,
      fromMe: true,
      status: 'sent',
      time: '10.25 PM',
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handlePlus = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.type === 'success') {
        Alert.alert('File Selected', result.name);
      }
    } catch {
      Alert.alert('Error', 'Could not open document picker.');
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) {
      Alert.alert('Photo Taken', 'Image captured successfully.');
    }
  };

  return (
    <View style={tw`flex-1 bg-white mt-6 mb-8`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-2 border-b border-gray-300`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center mr-24`}>
          <Image
            source={require('../../assets/user.png')}
            style={tw`w-10 h-10 rounded-full mr-2`}
          />
          <View>
            <Text style={tw`font-semibold text-base`}>Group Name</Text>
            <Text style={tw`text-xs text-gray-500`}>Members.......</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="video-call" size={28} color="red" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-2`}
        renderItem={({ item }) => {
          if (item.type === 'images') {
            return (
              <View style={tw`px-4 mt-2`}>
                <View style={tw`bg-gray-100 p-2 rounded-xl`}>
                  <View style={tw`flex-row flex-wrap`}>
                    {item.images.map((img, index) => (
                      <Image key={index} source={img} style={tw`w-24 h-24 m-1 rounded-md`} />
                    ))}
                  </View>
                  <Text style={tw`mt-2 text-sm`}>{item.text}</Text>
                  <Text style={tw`text-xs text-gray-500 mt-1`}>{item.time}</Text>
                </View>
              </View>
            );
          }

          return (
            <View style={tw.style('px-4 mt-1', item.fromMe ? 'items-end' : 'items-start')}>
              <View style={tw.style(
                'rounded-xl px-4 py-2',
                item.fromMe ? 'bg-pink-200' : 'bg-gray-100'
              )}>
                <Text>{item.text}</Text>
              </View>
              <View style={tw`flex-row items-center mt-1`}>
                <Text style={tw`text-xs text-gray-500 mr-1`}>{item.time}</Text>
                {item.fromMe && item.status && (
                  <Ionicons
                    name={
                      item.status === 'sent'
                        ? 'checkmark'
                        : item.status === 'delivered'
                        ? 'checkmark-done'
                        : item.status === 'seen'
                        ? 'checkmark-done-circle'
                        : 'time'
                    }
                    size={16}
                    color={item.status === 'seen' ? 'blue' : 'gray'}
                  />
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Typing Status */}
      <Text style={tw`text-xs text-gray-400 px-4 pt-2`}>{user.name} is typing...</Text>

      {/* Input */}
      <View style={tw`flex-row items-center px-2 py-2 border-t border-gray-300`}>
        <TouchableOpacity onPress={handlePlus}>
          <FontAwesome name="plus" size={20} style={tw`mx-2`} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCamera}>
          <Ionicons name="camera" size={20} style={tw`mx-2`} />
        </TouchableOpacity>
        {/* Removed mic button */}
        <TextInput
          placeholder="Type Here..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mx-2`}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
