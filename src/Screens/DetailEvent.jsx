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
import { useRoute } from '@react-navigation/native';

export default function EventDetailsScreen({ navigation }) {
    const route = useRoute();
    const { event } = route.params;
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <ScrollView contentContainerStyle={tw`pb-14`}>
                {/* Event Image */}
                <View style={tw`relative`}>
                    <Image
                        source={event.image}
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
                    {event.title}
                </Text>

                <View style={tw`flex-row justify-between items-center bg-white rounded-2xl p-3 mt-3 border border-gray-200 shadow-sm`}>
                    {[
                        { icon: 'tag', title: 'Price', value: event.price },
                        { icon: 'calendar', title: 'Date', value: event.date },
                        { icon: 'clock', title: 'Time', value: event.time },
                        { icon: 'map-marker-alt', title: 'Location', value: event.location },
                    ].map((item, index) => (
                        <View key={index} style={tw`flex-1 items-center`}>
                            <View style={tw`flex-row items-center mb-1`}>
                                <Icon name={item.icon} size={12} color="red" />
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
                        source={event.profileImage}
                        style={tw`w-10 h-10 rounded-full`}
                    />
                    <View style={tw`ml-3`}>
                        <Text style={tw`text-sm font-semibold text-black`}>
                            {event.organizer}
                        </Text>
                        <Text style={tw`text-xs text-gray-500`}>Organizer</Text>
                    </View>
                </View>

                {/* About */}
                <View style={tw`px-4 mt-5`}>
                    <Text style={tw`text-base font-semibold`}>About this event:</Text>
                    <Text style={tw`text-sm text-gray-600 mt-1`}>
                        {event.description}
                        <Text style={tw`text-red-500`}> Read more</Text>
                    </Text>
                </View>

                {/* Location */}
                <View style={tw`px-4 mt-4`}>
                    <Text style={tw`text-base font-semibold`}>Location:</Text>
                    <Text style={tw`text-sm text-gray-700`}>{event.location}</Text>
                    <Image
                        source={event.map}
                        style={tw`w-full h-32 rounded-lg mt-2`}
                        resizeMode="cover"
                    />
                </View>
          

            {/* Footer Buttons */}
            <View
                style={tw`left-0 right-0 px-4 flex-row justify-between mt-2`}
            >
                <TouchableOpacity
                    style={tw`flex-1 bg-white border border-red-400 rounded-full py-3 mr-2 items-center`}
                >
                    <Icon name="heart" size={16} color="red" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`flex-1 bg-red-500 rounded-full py-3 mx-2 items-center`}
                >
                    <Text style={tw`text-white font-semibold`}>Buy Ticket</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`flex-1 bg-red-500 rounded-full py-3 ml-2 items-center`}
                >
                    <Text style={tw`text-white font-semibold`}>Brochure</Text>
                </TouchableOpacity>
            </View>
              </ScrollView>
        </SafeAreaView>
    );
}