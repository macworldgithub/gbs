import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

const dummyImages = Array.from({ length: 28 }, (_, i) => ({
  id: i.toString(),
  uri: 'https://via.placeholder.com/150',
}));

const numColumns = 4;
const size = Dimensions.get('window').width / numColumns;

const GalleryScreen = () => {
  const navigation = useNavigation();

  const renderItem = () => (
    <View style={[tw`bg-gray-300 m-0.5`, { width: size - 2, height: size - 2 }]} />
  );

  return (
    <View style={tw`flex-1 bg-white mt-6`}>
      <View style={tw`flex-row justify-between items-center px-4 py-3 border-b border-gray-200`}>
  <View style={tw`flex-row items-center`}>
    <TouchableOpacity onPress={() => navigation.navigate('GroupInfo')} style={tw`p-1`}>
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
    <Text style={tw`text-lg font-semibold ml-1`}>Gallery</Text>
  </View>
  <TouchableOpacity onPress={() => alert('Select pressed')}>
    <Text style={tw`text-blue-600 text-base font-medium`}>Select</Text>
  </TouchableOpacity>
</View>

      {/* Gallery Grid */}
      <FlatList
        data={dummyImages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={tw`p-1`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default GalleryScreen;
