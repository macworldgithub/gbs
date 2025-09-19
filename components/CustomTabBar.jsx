import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={tw`flex-row bg-white border-t border-gray-200 px-2 pb-2 pt-2 mb-4`}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

      const getIcon = () => {
          switch (route.name) {
            case 'Home':
              return isFocused ? 'home' : 'home-outline';
            case 'Favorite':
              return isFocused ? 'heart' : 'heart-outline';
            case 'Chat':
              return isFocused ? 'chatbubble' : 'chatbubble-outline';
            case 'Profile':
              return isFocused ? 'person' : 'person-outline';
            case 'Directory':
              return isFocused ? 'people' : 'people-outline';
            case 'Business': 
              return isFocused ? 'briefcase' : 'briefcase-outline';
            case 'Social':
              return isFocused ? 'chatbubbles' : 'chatbubbles-outline';
            case 'Wellbeing':
              return isFocused ? 'heart' : 'heart-outline';
            case 'Offers':
              return isFocused ? 'pricetag' : 'pricetag-outline';
            default:
              return 'ellipse-outline';
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={tw`flex-1 items-center justify-center`}
            activeOpacity={0.7}
          >
            <Ionicons
              name={getIcon()}
              size={24}
              color={isFocused ? '#EF4444' : '#6B7280'}
            />
            <Text
              style={tw.style(
                'text-xs mt-1',
                isFocused ? 'text-red-500' : 'text-gray-500'
              )}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
