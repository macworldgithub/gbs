import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

export default function MuteGroup() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('8 hours');

  const options = ['8 hours', '1 week', 'Always'];

  return (
    <ScrollView style={tw`flex-1 bg-gray-100 mt-6`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-4 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold ml-4`}>Mute Group</Text>
      </View>

      {/* Info Text */}
      <View style={tw`px-4 mt-4`}>
        <Text style={tw`text-gray-700`}>
          Other members won’t see that you muted this group’s messages.
          You’ll still be notified if someone directly rings you for the message.
        </Text>
      </View>

      {/* Mute Duration Options */}
      <View style={tw`bg-white rounded-xl mt-6 mx-4`}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={tw`py-4 px-4 border-b border-gray-200 ${
              index === options.length - 1 ? 'border-b-0' : ''
            }`}
            onPress={() => setSelected(option)}
          >
            <Text style={tw`${selected === option ? 'text-black font-semibold' : 'text-gray-600'}`}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save Button */}
      <View style={tw`px-4 mt-72`}>
        <TouchableOpacity style={tw`bg-red-500 rounded-full py-3 items-center mt-16`}>
          <Text style={tw`text-white font-semibold text-base`}>Save Change</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
