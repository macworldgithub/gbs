

import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const popularEvents = [
    {
        id: '1',
        title: 'BMTH Tour 2024',
        location: 'Mandala Krida, Yogyakarta',
        price: '$60.00 - $300.00',
        date: 'Sep 12',
        time: '7:00 PM',
        organizer: 'Ayla02',
        description: 'Join us for the legendary BMTH live in concert...',
        image: require('../assets/popular1.png'),
        profileImage: require('../assets/profile.png'),
        map: require('../assets/map.png'),
    },
    {
        id: '2',
        title: 'Moshing Metal Fest 2024',
        location: 'Sleman, Yogyakarta',
        price: '$15.00 - $30.00',
        date: 'Oct 10',
        time: '6:00 PM',
        organizer: 'MetalHeads Club',
        description: 'The ultimate mosh pit experience awaits...',
        image: require('../assets/popular2.png'),
        profileImage: require('../assets/profile.png'),
        map: require('../assets/map.png'),
    },
    {
        id: '3',
        title: 'Moshing Metal Fest II 2024',
        location: 'Maguwo, Yogyakarta',
        price: '$15.00 - $30.00',
        date: 'Nov 11',
        time: '5:00 PM',
        organizer: 'MetalHeads Club',
        description: 'Back again by demand with harder breakdowns...',
        image: require('../assets/popular3.png'),
        profileImage: require('../assets/profile.png'),
        map: require('../assets/map.png'),
    },
    {
        id: '4',
        title: 'Moshing Metal Fest 2024',
        location: 'Sleman, Yogyakarta',
        price: '$15.00 - $30.00',
        date: 'Oct 10',
        time: '6:00 PM',
        organizer: 'MetalHeads Club',
        description: 'The ultimate mosh pit experience awaits...',
        image: require('../assets/popular2.png'),
        profileImage: require('../assets/profile.png'),
        map: require('../assets/map.png'),
    },
];

const Cards = () => {
    const [likedEvents, setLikedEvents] = useState({});
    const navigation = useNavigation();

    const toggleLike = (id) => {
        setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePress = (event) => {
        navigation.navigate('DetailEvent', { event });
    };

    return (
        <FlatList
            data={popularEvents}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => handlePress(item)}
                    style={tw`flex-row items-center bg-gray-100 rounded-lg p-2 mb-2`}
                >
                    <Image
                        source={item.image}
                        style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
                    />
                    <View style={tw`flex-1`}>
                        <Text style={tw`font-semibold text-sm`}>{item.title}</Text>
                        <Text style={tw`text-red-500 text-xs`}>{item.price}</Text>
                        <Text style={tw`text-gray-500 text-xs`}>{item.location}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleLike(item.id)}>
                        <FontAwesome
                            name={likedEvents[item.id] ? 'heart' : 'heart-o'}
                            size={16}
                            color={likedEvents[item.id] ? 'red' : '#9CA3AF'}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
        />
    );
};

export default Cards;
