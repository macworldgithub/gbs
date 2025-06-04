import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { FontAwesome } from '@expo/vector-icons';

const popularEvents = [
    {
        id: '1',
        title: 'BMTH Tour 2024',
        location: 'Mandala Krida, Yogyakarta',
        price: '$60.00 - $300.00',
        image: require('../assets/popular1.png'),
    },
    {
        id: '2',
        title: 'Moshing Metal Fest 2024',
        location: 'Sleman, Yogyakarta',
        price: '$15.00 - $30.00',
        image: require('../assets/popular2.png'),
    },
    {
        id: '3',
        title: 'Moshing Metal Fest II 2024',
        location: 'Maguwo, Yogyakarta',
        price: '$15.00 - $30.00',
        image: require('../assets/popular3.png'),
    },
     {
        id: '4',
        title: 'Moshing Metal Fest II 2024',
        location: 'Maguwo, Yogyakarta',
        price: '$15.00 - $30.00',
        image: require('../assets/popular3.png'),
    },
];

const Cards = () => {
    const [likedEvents, setLikedEvents] = useState({});

    const toggleLike = (id) => {
        setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <FlatList
            data={popularEvents}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <View style={tw`flex-row items-center bg-gray-100 rounded-lg p-2 mb-2`}>
                    <Image source={item.image} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }} />
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
                </View>
            )}
        />
    );
};

export default Cards;
