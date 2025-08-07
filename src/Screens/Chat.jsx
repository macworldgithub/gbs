import React, { useState, useRef } from 'react';
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

export default function Chat() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user ?? { name: "Guest" };

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey! I’m finally on vacation! 🌴❄️', fromMe: false },
    { id: '2', text: 'Wow, these look amazing! 😍 Where are you?', fromMe: true, status: 'seen' },
    {
      id: '3',
      type: 'images',
      images: [
        require('../../assets/event1.png'),
        require('../../assets/event2.png'),
        require('../../assets/event3.png'),
      ],
      fromMe: false,
    },
    {
      id: '4',
      text: 'That sounds incredible! Enjoy your trip, and send more pics! 🇺🇸',
      fromMe: true,
      status: 'delivered',
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
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handlePlus = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.type === 'success') {
        Alert.alert('File Selected', result.name);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open document picker.');
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('Photo Taken', 'Image captured successfully.');
    }
  };


  return (
    <View style={tw`flex-1 bg-white mt-6 pb-6`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-3 border-b`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center mr-16`}>
          <Image
            source={require('../../assets/user.png')}
            style={tw`w-10 h-10 rounded-full mr-2`}
          />
          <View>
            <Text style={tw`font-semibold`}>{user.name}</Text>
            <Text style={tw`text-xs text-gray-500`}>Last seen 2 hours ago</Text>
          </View>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity>
            <Ionicons name="call" size={22} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="video-call" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={tw`flex-1`}
        renderItem={({ item }) => {
          if (item.type === 'images') {
            return (
              <View style={tw`p-3`}>
                <View style={tw`bg-gray-100 p-2 rounded-xl`}>
                  <View style={tw`flex-row flex-wrap`}>
                    {item.images.map((img, index) => (
                      <Image
                        key={index}
                        source={img}
                        style={tw`w-24 h-24 rounded-md m-1`}
                      />
                    ))}
                  </View>
                  <Text style={tw`text-sm mt-2`}>Thanks! I’m at Bali!</Text>
                </View>
              </View>
            );
          }

          return (
            <View
              style={tw.style(
                `px-4 py-2 my-1`,
                item.fromMe ? 'items-end' : 'items-start'
              )}
            >
              <View
                style={tw.style(
                  'rounded-xl px-4 py-2 flex-row items-center',
                  item.fromMe ? 'bg-pink-200' : 'bg-gray-100'
                )}
              >
                <Text style={tw`mr-1`}>{item.text}</Text>
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

      {/* Typing status */}
      <Text style={tw`text-sm text-gray-500 px-4`}>{user.name} is typing...</Text>

      {/* Input */}
      <View style={tw`flex-row items-center px-2 py-2 border-t`}>
        <TouchableOpacity onPress={handlePlus}>
          <FontAwesome name="plus" size={20} style={tw`mx-2`} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCamera}>
          <Ionicons name="camera" size={20} style={tw`mx-2`} />
        </TouchableOpacity>
   
        <TextInput
          placeholder="Type Here..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mx-2`}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
