// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   Alert,
// } from 'react-native';
// import tw from 'tailwind-react-native-classnames';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';

// export default function Chat() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const user = route.params?.user ?? { name: "Guest" };

//   const [messages, setMessages] = useState([
//     { id: '1', text: 'Hey! I’m finally on vacation! 🌴❄️', fromMe: false },
//     { id: '2', text: 'Wow, these look amazing! 😍 Where are you?', fromMe: true, status: 'seen' },
//     {
//       id: '3',
//       type: 'images',
//       images: [
//         require('../../assets/event1.png'),
//         require('../../assets/event2.png'),
//         require('../../assets/event3.png'),
//       ],
//       fromMe: false,
//     },
//     {
//       id: '4',
//       text: 'That sounds incredible! Enjoy your trip, and send more pics! 🇺🇸',
//       fromMe: true,
//       status: 'delivered',
//     },
//   ]);

//   const [newMessage, setNewMessage] = useState('');


//   const sendMessage = () => {
//     if (newMessage.trim() === '') return;

//     const newMsg = {
//       id: (messages.length + 1).toString(),
//       text: newMessage,
//       fromMe: true,
//       status: 'sent',
//     };
//     setMessages([...messages, newMsg]);
//     setNewMessage('');
//   };

//   const handlePlus = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*',
//         copyToCacheDirectory: true,
//         multiple: false,
//       });

//       if (result.type === 'success') {
//         Alert.alert('File Selected', result.name);
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Could not open document picker.');
//     }
//   };

//   const handleCamera = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Camera access is required.');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       Alert.alert('Photo Taken', 'Image captured successfully.');
//     }
//   };


//   return (
//     <View style={tw`flex-1 bg-white pt-8 pb-2 `}>
//       {/* Header */}
//       <View style={tw`flex-row items-center justify-between px-4 py-3 border-b`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} />
//         </TouchableOpacity>
//         <View style={tw`flex-row items-center mr-16`}>
//           <Image
//             source={require('../../assets/user.png')}
//             style={tw`w-10 h-10 rounded-full mr-2`}
//           />
//           <View>
//             <Text style={tw`font-semibold`}>{user.name}</Text>
//             <Text style={tw`text-xs text-gray-500`}>Last seen 2 hours ago</Text>
//           </View>
//         </View>
//         <View style={tw`flex-row`}>
//           <TouchableOpacity>
//             <Ionicons name="call" size={22} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <MaterialIcons name="video-call" size={24} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Messages */}
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         style={tw`flex-1`}
//         renderItem={({ item }) => {
//           if (item.type === 'images') {
//             return (
//               <View style={tw`p-3`}>
//                 <View style={tw`bg-gray-100 p-2 rounded-xl`}>
//                   <View style={tw`flex-row flex-wrap`}>
//                     {item.images.map((img, index) => (
//                       <Image
//                         key={index}
//                         source={img}
//                         style={tw`w-24 h-24 rounded-md m-1`}
//                       />
//                     ))}
//                   </View>
//                   <Text style={tw`text-sm mt-2`}>Thanks! I’m at Bali!</Text>
//                 </View>
//               </View>
//             );
//           }

//           return (
//             <View
//               style={tw.style(
//                 `px-4 py-2 my-1`,
//                 item.fromMe ? 'items-end' : 'items-start'
//               )}
//             >
//               <View
//                 style={tw.style(
//                   'rounded-xl px-4 py-2 flex-row items-center',
//                   item.fromMe ? 'bg-pink-200' : 'bg-gray-100'
//                 )}
//               >
//                 <Text style={tw`mr-1`}>{item.text}</Text>
//                 {item.fromMe && item.status && (
//                   <Ionicons
//                     name={
//                       item.status === 'sent'
//                         ? 'checkmark'
//                         : item.status === 'delivered'
//                         ? 'checkmark-done'
//                         : item.status === 'seen'
//                         ? 'checkmark-done-circle'
//                         : 'time'
//                     }
//                     size={16}
//                     color={item.status === 'seen' ? 'blue' : 'gray'}
//                   />
//                 )}
//               </View>
//             </View>
//           );
//         }}
//       />

//       {/* Typing status */}
//       <Text style={tw`text-sm text-gray-500 px-4`}>{user.name} is typing...</Text>

//       {/* Input */}
//       <View style={tw`flex-row items-center px-2 py-2 border-t`}>
//         <TouchableOpacity onPress={handlePlus}>
//           <FontAwesome name="plus" size={20} style={tw`mx-2`} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleCamera}>
//           <Ionicons name="camera" size={20} style={tw`mx-2`} />
//         </TouchableOpacity>
   
//         <TextInput
//           placeholder="Type Here..."
//           value={newMessage}
//           onChangeText={setNewMessage}
//           style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mx-2`}
//         />
//         <TouchableOpacity onPress={sendMessage}>
//           <Ionicons name="send" size={20} color="#3b82f6" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }


import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const tabs = ["Events", "Chat Group", "Photo Gallery"];

const eventsData = [
  {
    id: 1,
    title: "Wine Club Tasting Evening",
    date: "March 20, 2025",
    location: "Barossa Valley, SA",
    attending: 24,
  },
  {
    id: 2,
    title: "Golf Tournament",
    date: "March 20, 2025",
    location: "Barossa Valley, SA",
    attending: 24,
  },
  {
    id: 3,
    title: "Horse Racing Day",
    date: "March 20, 2025",
    location: "Barossa Valley, SA",
    attending: 24,
  },
 {
    id: 4,
    title: "Horse Racing Day",
    date: "March 20, 2025",
    location: "Barossa Valley, SA",
    attending: 24,
  },
];

const SocialPage = () => {
  const [activeTab, setActiveTab] = useState("Events");

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Header */}
      <Text style={tw`text-xl font-bold text-gray-800 mb-1 mt-14`}>Social</Text>
      <Text style={tw`text-sm text-gray-600 mb-4`}>Community & Events</Text>

      {/* Tabs */}
      <View style={tw`flex-row mb-4`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              if (tab === "Events") {
                setActiveTab(tab); // sirf Events pe change hoga
              }
            }}
            style={tw`px-4 py-2 mr-2 rounded-md ${
              activeTab === tab ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            <Text
              style={tw`text-sm ${
                activeTab === tab ? "text-white" : "text-gray-700"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      {activeTab === "Events" &&
        eventsData.map((event) => (
          <View key={event.id} style={tw`bg-gray-50 rounded-lg p-4 mb-4`}>
            <Text style={tw`text-base font-bold text-gray-800 mb-2`}>
              {event.title}
            </Text>

            {/* Date */}
            <View style={tw`flex-row items-center mb-1`}>
              <MaterialIcons name="event" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>{event.date}</Text>
            </View>

            {/* Location */}
            <View style={tw`flex-row items-center mb-1`}>
              <MaterialIcons name="location-on" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {event.location}
              </Text>
            </View>

            {/* Attending */}
            <View style={tw`flex-row items-center`}>
              <MaterialIcons name="people" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {event.attending} attending
              </Text>
            </View>
          </View>
        ))}
    </ScrollView>
  );
};

export default SocialPage;
