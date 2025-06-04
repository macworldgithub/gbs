import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, view } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import Cards from '../../components/Cards';

const tabs = [
  { key: 'all', label: 'All', icon: 'th-large' },
  { key: 'upcoming', label: 'Upcoming events', icon: 'calendar-alt' },
  { key: 'popular', label: 'Popular events', icon: 'star' },
  { key: 'live', label: 'Live events', icon: 'broadcast-tower' },
];

export default function PopularEvent() {
  const [activeTab, setActiveTab] = useState('popular');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`pt-4 px-2`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-2 `}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold ml-4 `}>Popular Event</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mt-4 px-2`}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={tw.style(
              `flex-row items-center px-4 py-2 rounded-full mr-2`,
              activeTab === tab.key ? `bg-red-400` : `bg-gray-100`
            )}
          >
            <Icon
              name={tab.icon}
              size={14}
              color={activeTab === tab.key ? '#fff' : '#555'}
              style={tw`mr-2`}
            />
            <Text
              style={tw.style(
                `text-sm`,
                activeTab === tab.key ? `text-white` : `text-gray-700`
              )}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={tw`mt-6`}>
      <Cards/>
      </View>
    </SafeAreaView>
  );
}
