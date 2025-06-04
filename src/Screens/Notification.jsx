import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native'; 

const notifications = {
  today: [
    {
      id: '1',
      title: 'Event Booked Successfully',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      date: '25 Oct 2024 • 11:31 AM',
      unread: true,
    },
    {
      id: '2',
      title: '3 more days until WINC #9 starts!',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      date: '15 Oct 2024 • 9:30 AM',
      highlight: true,
    },
    {
      id: '3',
      title: 'Event Review Request',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      date: '10 Oct 2024 • 9:43 AM',
    },
  ],
  yesterday: [
    {
      id: '4',
      title: 'Event Review Request',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      date: '9 Oct 2024 • 09:43 AM',
    },
    {
      id: '5',
      title: 'Event Booked Successfully',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      date: '9 Oct 2024 • 10:10 AM',
    },
     {
      id: '6',
      title: 'Event Review Request',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      date: '11 Oct 2024 • 09:43 AM',
    },
  ],
};

export default function NotificationScreen() {
  const navigation = useNavigation(); // <-- Added
  const [data, setData] = useState(notifications);

  const markAllAsRead = (section) => {
    const updated = {
      ...data,
      [section]: data[section].map((n) => ({
        ...n,
        unread: false,
        highlight: false,
      })),
    };
    setData(updated);
  };

  const renderItem = (item) => (
    <View
      key={item.id}
      style={
        item.highlight
          ? [tw`flex-row items-start px-4 py-3 rounded bg-purple-100`]
          : tw`flex-row items-start px-4 py-3`
      }
    >
      <View style={tw`mt-1 mr-2`}>
        <FontAwesome name="bell" size={16} color="#f43f5e" />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-sm font-semibold text-black`}>{item.title}</Text>
        <Text style={tw`text-xs text-gray-500`}>{item.body}</Text>
        <Text style={tw`text-xs text-gray-400 mt-1`}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-white pt-4`}>
      {/* Header with back icon */}
      <View style={tw`flex-row justify-between items-center px-4 py-4 border-b border-gray-100`}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-black ml-2 flex-1`}>Notification</Text>
        <TouchableOpacity style={tw`bg-red-500 rounded-full px-3 py-0.5`}>
          <Text style={tw`text-white text-xs font-medium`}>1 NEW</Text>
        </TouchableOpacity>
      </View>

      {/* Today */}
      <View style={tw`mt-2`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-1`}>
          <Text style={tw`text-xs font-medium text-gray-400`}>TODAY</Text>
          <TouchableOpacity onPress={() => markAllAsRead('today')}>
            <Text style={tw`text-xs font-medium text-red-500`}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
        {data.today.map((item) => renderItem(item))}
      </View>

      {/* Yesterday */}
      <View style={tw`mt-4 mb-10`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-1`}>
          <Text style={tw`text-xs font-medium text-gray-400`}>YESTERDAY</Text>
          <TouchableOpacity onPress={() => markAllAsRead('yesterday')}>
            <Text style={tw`text-xs font-medium text-red-500`}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
        {data.yesterday.map((item) => renderItem(item))}
      </View>
    </ScrollView>
  );
}
