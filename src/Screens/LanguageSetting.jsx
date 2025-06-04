import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'tailwind-react-native-classnames';

const LanguageSetting = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { name: 'English', flag: '🇺🇸' },
    { name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { name: '中国人', flag: '🇨🇳' },
    { name: '한국어', flag: '🇰🇷' },
  ];

  const renderLanguageOption = (lang) => (
    <TouchableOpacity
      key={lang.name}
      onPress={() => setSelectedLanguage(lang.name)}
      style={[
        tw`p-4 m-2 rounded-lg border flex-row justify-between items-center`,
        selectedLanguage === lang.name ? tw`border-red-500` : tw`border-gray-200`,
      ]}
    >
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-xl mr-3`}>{lang.flag}</Text>
        <Text style={tw`text-base text-gray-800`}>{lang.name}</Text>
      </View>
      {selectedLanguage === lang.name && (
        <Icon name="check-circle" size={18} color="red" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white pt-8`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold ml-4`}>Language</Text>
      </View>

      {/* Language Options */}
      <View style={tw`p-4`}>
        {languages.map((lang) => renderLanguageOption(lang))}
      </View>

      {/* Save Button */}
      <View style={tw`absolute bottom-4 w-full px-4`}>
        <TouchableOpacity
          style={[
            tw`py-3 rounded-xl`,
            { backgroundColor: 'red', opacity: 0.9 },
          ]}
          onPress={() => {
            console.log(`Selected Language: ${selectedLanguage}`);
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

export default LanguageSetting;
