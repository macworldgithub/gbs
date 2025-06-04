import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import Cards from '../../components/Cards';

const categories = [
  { id: 'all', label: 'All', icon: 'ticket-outline' },
  { id: 'music', label: 'Music', icon: 'musical-notes-outline' },
  { id: 'festival', label: 'Festival', icon: 'flame-outline' },
  { id: 'sports', label: 'Sports', icon: 'basketball-outline' },
];

const Favorite = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <View style={tw`bg-white pt-4 px-4`}>
      {/* Title */}
      <Text style={tw`text-lg font-semibold mb-4`}>Favorite</Text>

      {/* Search Bar */}
      <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 py-1 mb-4`}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search Event"
          style={tw`ml-2 flex-1 text-base`}
          placeholderTextColor="#999"
        />
      </View>

      {/* Horizontal Scroll - Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`pb-2`}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                tw`flex-row items-center justify-center mr-3 rounded-full border mb-6`,
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

      <Cards/>
    </View>
    
  );
};

export default Favorite;
