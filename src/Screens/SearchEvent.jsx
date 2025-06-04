import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import Cards from '../../components/Cards';
 
export default function SearchEvent() {
  const [location, setLocation] = useState("Sleman, Yogyakarta");
  const [query, setQuery] = useState("");

  return (
    <View style={tw`p-4`}>
      {/* Location Row */}
      <View style={tw`flex-row justify-between items-center mb-2 mt-6`}>
        <Text style={tw`text-sm text-gray-600`}>Current Location</Text>
        <TouchableOpacity style={tw`bg-red-500 p-2 rounded-full`}>
          <FontAwesome name="sliders" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Location Name */}
      <Text style={tw`text-base font-semibold text-indigo-900 mb-4`}>
        {location}
      </Text>

      {/* Search Bar */}
      <View style={tw`flex-row items-center border border-red-400 rounded px-3 py-1`}>
        <FontAwesome name="search" size={16} color="#888" />
        <TextInput
          style={tw`ml-2 flex-1 text-sm text-gray-800`}
          placeholder="Search something..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Result Label */}
      <Text style={tw`text-xs text-gray-400 mt-2 tracking-widest`}>
        SEARCH RESULT
      </Text>
      <Cards/>
    </View>
    
  );
}
