import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: 'all', label: 'All', icon: 'ticket-outline' },
  { id: 'music', label: 'Music', icon: 'musical-notes-outline' },
  { id: 'festival', label: 'Festival', icon: 'flame-outline' },
  { id: 'sports', label: 'Sports', icon: 'basketball-outline' },
];

const FavoriteEmpty = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { height } = Dimensions.get('window');

  return (
    <View style={tw`flex-1 bg-white pt-4 px-4`}>
      {/* Title */}
      <Text style={tw`text-lg font-semibold mb-4`}>Favorite</Text>

      {/* Search Bar */}
      <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4`}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search Event"
          style={tw`ml-2 flex-1 text-base`}
       placeholderTextColor="black"
        />
      </View>

      {/* Category Buttons - Scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mb-6`}
        contentContainerStyle={tw`pb-1`}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                tw`flex-row items-center justify-center mr-3 rounded-full border`,
                isSelected ? tw`bg-red-500 border-red-500` : tw`bg-white border-gray-300`,
                { width: 80, height: 40 },
              ]}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isSelected ? 'white' : 'black'}
                style={tw`mr-1`}
              />
              <Text
                style={[
                  tw`text-sm`,
                  isSelected ? tw`text-white` : tw`text-black`,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Centered Oops Section */}
      <View style={[tw`items-center justify-center mb-56`, { flex: 1 }]}>
        <Image
          source={require('../../assets/oops.png')}
          style={{ width: 100, height: 100, marginBottom: 10 }}
          resizeMode="contain"
        />
        <Text style={tw`text-lg font-semibold text-gray-700 mb-1`}>Oops!</Text>
        <Text style={tw`text-gray-500 mb-8 text-center`}>
          There are no events you saved
        </Text>

        {/* Explore Button */}
        <TouchableOpacity
          onPress={() => alert('Explore Event pressed')}
          style={tw`bg-red-500 px-10 py-3 rounded-full`}
        >
          <Text style={tw`text-white text-base font-semibold`}>Explore Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FavoriteEmpty;
