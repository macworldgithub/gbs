import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

const chats = [
  {
    id: '1',
    name: 'Emma Carter',
    message: 'Hey! Are we still on for tonight? 🤔',
    time: '10.24 PM',
    unread: true,
    sent: true,
  },
  {
    id: '2',
    name: 'Sophia Rivera',
    message: 'I just sent you the files.',
    time: '10.24 PM',
    unread: true,
  },
  {
    id: '3',
    name: 'James Mitchell',
    message: 'Had such a great time today! 😎',
    time: '10.24 PM',
    unread: true,
  },
  {
    id: '4',
    name: 'Ava Martinez',
    message: 'The game last night was crazy!',
    time: '10.24 PM',
    sent: true,
  },
  {
    id: '5',
    name: 'Olivia Nguyen',
    message: 'Morning! Don’t forget our meeting.',
    time: '10.24 PM',
    sent: true,
  },
  {
    id: '6',
    name: 'Ethan Walker',
    message: 'Yo, are you free to catch up later?',
    time: 'Tomorrow',
  },
];

export default function AllChat() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', { user: item })}
      style={tw`flex-row items-center p-3 border-b border-gray-200`}
    >
      <Image
        source={require('../../assets/user.png')}
        style={tw`w-12 h-12 rounded-full`}
      />
      <View style={tw`flex-1 ml-3`}>
        <Text style={tw`text-base font-semibold`}>{item.name}</Text>
        <Text style={tw`text-sm text-gray-600`} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <View style={tw`items-end`}>
        <Text style={tw`text-xs text-gray-500`}>{item.time}</Text>
        {item.unread && <View style={tw`w-3 h-3 rounded-full bg-red-500 mt-1`} />}
      </View>
    </TouchableOpacity>

  );

  return (
    <View style={tw`flex-1 bg-white mt-10`}>
      <View style={tw`p-4 flex-row justify-between items-center`}>
        <Text style={tw`text-lg font-bold`}>Chat</Text>
        <TouchableOpacity
          style={tw`bg-red-500 rounded-full p-2`}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={tw`text-white text-xl`}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`mx-4 mb-2`}>
        <TextInput
          style={tw`bg-gray-100 rounded-full px-4 py-2`}
          placeholder="Search"
        />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
