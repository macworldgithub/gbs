import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Cards from '../../components/Cards';

const upcomingEvents = [
  {
    id: '1',
    title: 'Synchronize Fest 2024',
    date: 'May 20',
    location: 'Yogyakarta',
    price: '$285',
    image: require('../../assets/event1.png'),
  },
  {
    id: '2',
    title: 'WJNC #9 : Gathering',
    date: 'Oct 7',
    location: 'Yogyakarta',
    price: '$185',
    image: require('../../assets/event2.png'),
  },
];

const tabs = [
  { key: 'all', label: 'All'},
  { key: 'upcoming', label: 'VIC'},
  { key: 'popular', label: 'NSW'},
  { key: 'live', label: 'QLD' },
  { key: 'past', label: 'SA'},
];

export default function Home() {
  const navigation = useNavigation(); 
  const [likedEvents, setLikedEvents] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  const toggleLike = (id) => {
    setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabPress = (key) => {
    setActiveTab(key);
    switch (key) {
      case 'upcoming':
        navigation.navigate('UpcomingEvent');
        break;
      case 'popular':
        navigation.navigate('PopularEvent');
        break;
      case 'live':
        navigation.navigate('LiveEvent');
        break;
      default:
        // stay on Home
        break;
    }
  };

  const renderHeader = () => (
    <View style={tw`px-4 pt-6 mt-10`}>
      {/* Location & Notifications */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View>
          <Text style={tw`text-xs text-gray-400`}>Current Location</Text>
          <Text style={tw`font-semibold`}>Sleman, Yogyakarta</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <View style={tw`relative`}>
            <FontAwesome name="bell" size={20} color="black" />
            <View style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3 border border-gray-300`}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={tw`ml-2 flex-1 text-sm`}
          placeholder="Search Event"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Scrollable Tabs */}
      <FlatList
        data={tabs}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleTabPress(item.key)}
            style={tw.style(
              `flex-row items-center px-4 py-2 rounded-md mt-4 mr-2 mb-2 border-gray-400 border`,
              activeTab === item.key ? `bg-red-100` : `bg-gray-100`
            )}
          >
            <FontAwesome5
              name={item.icon}
              size={14}
              color={activeTab === item.key ? '#EF4444' : '#6B7280'}
              style={tw`mr-2`}
            />
            <Text
              style={tw.style(
                `text-sm`,
                activeTab === item.key ? `text-red-500` : `text-gray-600`
              )}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        style={tw`mb-4`}
      />

      {/* Upcoming Events Section */}
      <View style={tw`mb-2`}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`font-semibold`}>Upcoming Events</Text>
          <Text style={tw`text-red-500 text-sm`}>See all events</Text>
        </View>

        <FlatList
          data={upcomingEvents}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={tw`mr-4`}>
              <Image
                source={item.image}
                style={{ width: 180, height: 100, borderRadius: 10 }}
              />
              <Text style={tw`mt-2 font-semibold text-sm`}>{item.title}</Text>
              <Text style={tw`text-red-500`}>{item.price}</Text>
              <Text style={tw`text-gray-500 text-xs`}>{item.location}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={[{}]} 
      renderItem={() => (
        <View style={tw`px-4 `}>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`font-semibold`}>Popular Events</Text>
            <Text style={tw`text-red-500 text-sm`}>See all events</Text>
          </View>
          <Cards />
        </View>
      )}
      keyExtractor={() => 'footer'}
    />
  );
}
