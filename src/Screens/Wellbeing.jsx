import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function WellbeingScreen() {
  const [activeTab, setActiveTab] = useState('Resources');

  const data = [
    {
      id: '1',
      title: 'Mental Health First Aid',
      date: 'March 20, 2025',
    location: 'Barossa Valley, SA',
      description:
        'Learn how to provide initial support to someone experiencing a mental health problem.',
      category: 'Mental Health',
    },
    {
      id: '2',
      title: 'Mental Health First Aid',
      date: 'March 20, 2025',
      location: 'Barossa Valley, SA',
      description:
        'Learn how to provide initial support to someone experiencing a mental health problem.',
      category: 'Mental Health',
    },
    {
      id: '3',
      title: 'Mental Health First Aid',
      date: 'March 20, 2025',
      location: 'Barossa Valley, SA',
      description:
        'Learn how to provide initial support to someone experiencing a mental health problem.',
      category: 'Mental Health',
    },
    {
      id: '4',
      title: 'Mental Health First Aid',
      date: 'March 20, 2025',
      location: 'Barossa Valley, SA',
      description:
        'Learn how to provide initial support to someone experiencing a mental health problem.',
      category: 'Mental Health',
    },
  ];

  const renderCard = (item) => (
    <View key={item.id} style={tw`bg-gray-50 rounded-lg p-4 mb-4`}>
      {/* Title */}
      <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{item.title}</Text>

      {/* Date & Location */}
      <View style={tw`flex-row items-center mb-2`}>
        <FontAwesome name="calendar" size={14} color="gray" />
        <Text style={tw`text-xs text-gray-500 ml-1`}>{item.date}</Text>
        <FontAwesome name="map-marker" size={14} color="gray" style={tw`ml-3`} />
        <Text style={tw`text-xs text-gray-500 ml-1`}>{item.location}</Text>
      </View>

      {/* Description */}
      <Text style={tw`text-sm text-gray-600 mb-3`}>{item.description}</Text>

      {/* Buttons */}
      <View style={tw`flex-row`}>
        <TouchableOpacity style={tw`bg-red-500 px-3 py-2 rounded-lg mr-2`}>
          <Text style={tw`text-white text-xs font-medium`}>{item.category}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-red-500 px-3 py-2 rounded-lg`}>
          <Text style={tw`text-white text-xs font-medium`}>Access</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Section Title */}
      <View style={tw`pt-14`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>Wellbeing</Text>
        <Text style={tw`text-sm text-gray-600 mb-4`}>
          Supporting Your Health & Wellness Journey
        </Text>
      </View>

      {/* Tabs */}
      <View style={tw`flex-row mb-4`}>
        {['Resources', 'Events', 'Community'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={tw`px-4 py-2 mr-2 rounded-md ${
              activeTab === tab ? 'bg-red-500' : 'bg-gray-100'
            }`}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={tw`${activeTab === tab ? 'text-white' : 'text-gray-700'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cards */}
      {data.map(renderCard)}
    </ScrollView>
  );
}
