import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import tw from 'tailwind-react-native-classnames';

const eventData = {
    title: 'Magic Round Sports Lunch Brisbane',
    price: '$285',
    date: 'May 20',
    time: '12:00 pm',
    location: 'Yogyakarta',
    organizer: 'Michael De Santa',
    description:
        'Join us for an afternoon of premium hospitality, entertainment, and inspiration as we connect, share stories, and celebrate the spirit of the Good Blokes Society...',
    image: require('../../assets/banner.png'), // Replace with your event banner image
    profileImage: require('../../assets/profile.png'), // Your uploaded .png profile image
    map: require('../../assets/map.png'), // Add map image preview here
};

export default function EventDetailsScreen({ navigation }) {
    const handleBuyTicket = () => {
        // Example external link or navigate to ticket screen
        Linking.openURL('https://your-ticket-url.com');
    };

    const handleBrochure = () => {
        // Example brochure link
        Linking.openURL('https://your-brochure-url.com');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <ScrollView contentContainerStyle={tw`pb-14`}>
                {/* Event Image */}
                <View style={tw`relative`}>
                    <Image
                        source={eventData.image}
                        style={tw`w-full h-60 rounded-b-xl`}
                        resizeMode="cover"
                    />
                    <View style={tw`absolute top-4 left-4`}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={tw`bg-white p-2 rounded-full`}
                        >
                            <Icon name="arrow-left" size={16} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`absolute top-4 right-4`}>
                        <TouchableOpacity style={tw`bg-white p-2 rounded-full`}>
                            <Icon name="share-alt" size={16} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Title */}
                <Text style={tw`text-lg font-bold px-4 mt-6`}>
                    {eventData.title}
                </Text>

                <View style={tw`flex-row justify-between items-center bg-white rounded-2xl p-3 mt-3 border border-gray-200 shadow-sm`}>
                    {[
                        { icon: 'tag', title: 'Price', value: '$285' },
                        { icon: 'calendar', title: 'Date', value: 'May 20' },
                        { icon: 'clock', title: 'Time', value: '12:00 pm' },
                        { icon: 'map-marker-alt', title: 'Location', value: 'Yogyakarta' },
                    ].map((item, index) => (
                        <View key={index} style={tw`flex-1 items-center`}>
                            <View style={tw`flex-row items-center mb-1`}>
                                <Icon name={item.icon} size={12} color="gray" />
                                <Text style={tw`text-xs text-gray-400 ml-1`}>{item.title}</Text>
                            </View>
                            <Text style={tw`text-sm font-semibold text-red-500`}>{item.value}</Text>

                            {index < 3 && (
                                <View style={tw`absolute right-0 top-1/4 h-6 border-r border-gray-200`} />
                            )}
                        </View>
                    ))}
                </View>


                {/* Organizer */}
                <View style={tw`flex-row items-center px-4 mt-4`}>
                    <Image
                        source={eventData.profileImage}
                        style={tw`w-10 h-10 rounded-full`}
                    />
                    <View style={tw`ml-3`}>
                        <Text style={tw`text-sm font-semibold text-black`}>
                            {eventData.organizer}
                        </Text>
                        <Text style={tw`text-xs text-gray-500`}>Organizer</Text>
                    </View>
                </View>

                {/* About */}
                <View style={tw`px-4 mt-5`}>
                    <Text style={tw`text-base font-semibold`}>About this event:</Text>
                    <Text style={tw`text-sm text-gray-600 mt-1`}>
                        {eventData.description}
                        <Text style={tw`text-red-500`}> Read more</Text>
                    </Text>
                </View>

                {/* Location */}
                <View style={tw`px-4 mt-4`}>
                    <Text style={tw`text-base font-semibold`}>Location:</Text>
                    <Text style={tw`text-sm text-gray-700`}>{eventData.location}</Text>
                    <Image
                        source={eventData.map}
                        style={tw`w-full h-32 rounded-lg mt-2`}
                        resizeMode="cover"
                    />
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View
                style={tw`absolute bottom-4 left-0 right-0 px-4 flex-row justify-between`}
            >
                <TouchableOpacity
                    style={tw`flex-1 bg-white border border-red-400 rounded-full py-3 mr-2 items-center`}
                >
                    <Icon name="heart" size={16} color="red" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleBuyTicket}
                    style={tw`flex-1 bg-red-500 rounded-full py-3 mx-2 items-center`}
                >
                    <Text style={tw`text-white font-semibold`}>Buy Ticket</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleBrochure}
                    style={tw`flex-1 bg-red-500 rounded-full py-3 ml-2 items-center`}
                >
                    <Text style={tw`text-white font-semibold`}>Brochure</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
