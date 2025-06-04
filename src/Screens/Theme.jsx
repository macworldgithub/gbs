import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'tailwind-react-native-classnames';

const Theme = () => {
  const navigation = useNavigation();
  const [selectedTheme, setSelectedTheme] = useState('Light');

  const themes = ['Light', 'Dark', 'System Default'];

  const renderThemeOption = (item) => (
    <TouchableOpacity
      key={item}
      onPress={() => setSelectedTheme(item)}
      style={[
        tw`p-4 m-2 rounded-lg border`,
        selectedTheme === item ? tw`border-red-500` : tw`border-gray-200`,
      ]}
    >
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-base text-gray-800`}>{item}</Text>
        {selectedTheme === item && (
          <Icon name="check-circle" size={18} color="red" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white pt-8`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold ml-4`}>Theme</Text>
      </View>

      {/* Theme Options */}
      <View style={tw`p-4`}>
        {themes.map((theme) => renderThemeOption(theme))}
      </View>

      {/* Save Button */}
      <View style={tw`absolute bottom-4 w-full px-4`}>
        <TouchableOpacity
          style={[
            tw`py-3 rounded-xl`,
            { backgroundColor: 'red', opacity: 0.9 },
          ]}
          onPress={() => {
            console.log(`Selected Theme: ${selectedTheme}`);
            navigation.goBack();
          }}
        >
          <Text style={tw`text-white text-center font-semibold`}>
            Save Change
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Theme;
