// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// import { useNavigation, DrawerActions } from '@react-navigation/native';
// import tw from 'tailwind-react-native-classnames';
// import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
// import Cards from '../../components/Cards';

// const upcomingEvents = [
//   {
//     id: '1',
//     title: 'Synchronize Fest 2024',
//     date: 'May 20',
//     location: 'Yogyakarta',
//     price: '$285',
//     image: require('../../assets/event1.png'),
//   },
//   {
//     id: '2',
//     title: 'WJNC #9 : Gathering',
//     date: 'Oct 7',
//     location: 'Yogyakarta',
//     price: '$185',
//     image: require('../../assets/event2.png'),
//   },
// ];

// const tabs = [
//   { key: 'all', label: 'All', icon: 'th-large' },
//   { key: 'upcoming', label: 'Upcoming events', icon: 'calendar' },
//   { key: 'popular', label: 'Popular events', icon: 'fire' },
//   { key: 'live', label: 'Live events', icon: 'broadcast-tower' },
// ];

// export default function Home() {
//   const navigation = useNavigation(); 
//   const [likedEvents, setLikedEvents] = useState({});
//   const [activeTab, setActiveTab] = useState('all');

//   const toggleLike = (id) => {
//     setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleTabPress = (key) => {
//     setActiveTab(key);
//     switch (key) {
//       case 'upcoming':
//         navigation.navigate('UpcomingEvent');
//         break;
//       case 'popular':
//         navigation.navigate('PopularEvent');
//         break;
//       case 'live':
//         navigation.navigate('LiveEvent');
//         break;
//       default:
//         // stay on Home
//         break;
//     }
//   };

//   const renderHeader = () => (
//     <View style={tw`px-4 pt-6 mt-10`}>
//       {/* Location & Notifications */}
//       <View style={tw`flex-row justify-between items-center mb-4`}>
//         {/* Hamburger Icon */}
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//          {/* <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}> */}
          // <FontAwesome name="bars" size={24} color="black" style={tw`mr-4`} />
//         </TouchableOpacity>
//         <View style={tw`flex-1`} />
//         <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
//           <View style={tw`relative`}>
//             <FontAwesome name="bell" size={20} color="black" />
//             <View style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`} />
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Search Input */}
//       <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3`}>
//         <Ionicons name="search" size={18} color="#9CA3AF" />
//         <TextInput
//           style={tw`ml-2 flex-1 text-sm`}
//           placeholder="Search Event"
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       {/* Scrollable Tabs */}
//       <FlatList
//         data={tabs}
//         keyExtractor={(item) => item.key}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => handleTabPress(item.key)}
//             style={tw.style(
//               `flex-row items-center px-4 py-2 rounded-full mr-2`,
//               activeTab === item.key ? `bg-red-100` : `bg-gray-100`
//             )}
//           >
//             <FontAwesome5
//               name={item.icon}
//               size={14}
//               color={activeTab === item.key ? '#EF4444' : '#6B7280'}
//               style={tw`mr-2`}
//             />
//             <Text
//               style={tw.style(
//                 `text-sm`,
//                 activeTab === item.key ? `text-red-500` : `text-gray-600`
//               )}
//             >
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         )}
//         style={tw`mb-4`}
//       />

//       {/* Upcoming Events Section */}
//       <View style={tw`mb-2`}>
//         <View style={tw`flex-row justify-between mb-2`}>
//           <Text style={tw`font-semibold`}>Latest News</Text>
//           <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//         </View>

//         <FlatList
//           data={upcomingEvents}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View style={tw`mr-4`}>
//               <Image
//                 source={item.image}
//                 style={{ width: 180, height: 100, borderRadius: 10 }}
//               />
//               <Text style={tw`mt-2 font-semibold text-sm`}>{item.title}</Text>
//               <Text style={tw`text-red-500`}>{item.price}</Text>
//               <Text style={tw`text-gray-500 text-xs`}>{item.location}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );

//   return (
//     <FlatList
//       ListHeaderComponent={renderHeader}
//       data={[{}]} 
//       renderItem={() => (
//         <View style={tw`px-4 `}>
//           <View style={tw`flex-row justify-between mb-2`}>
//             <Text style={tw`font-semibold`}>Chairman's Partners</Text>
//             <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//           </View>
//           <Cards />
//         </View>
//       )}
//       keyExtractor={() => 'footer'}
//     />
//   );
// }



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import tw from 'tailwind-react-native-classnames';
// import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
// import Cards from '../../components/Cards';

// const upcomingEvents = [
//   {
//     id: '1',
//     title: 'Synchronize Fest 2024',
//     date: 'May 20',
//     location: 'Yogyakarta',
//     price: '$285',
//     image: require('../../assets/event1.png'),
//   },
//   {
//     id: '2',
//     title: 'WJNC #9 : Gathering',
//     date: 'Oct 7',
//     location: 'Yogyakarta',
//     price: '$185',
//     image: require('../../assets/event2.png'),
//   },
// ];

// const tabs = [
//   { key: 'all', label: 'All', icon: 'th-large' },
//   { key: 'upcoming', label: 'Upcoming events', icon: 'calendar' },
//   { key: 'popular', label: 'Popular events', icon: 'fire' },
//   { key: 'live', label: 'Live events', icon: 'broadcast-tower' },
// ];

// export default function Home() {
//   const navigation = useNavigation(); 
//   const [likedEvents, setLikedEvents] = useState({});
//   const [activeTab, setActiveTab] = useState('all');

//   const toggleLike = (id) => {
//     setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleTabPress = (key) => {
//     setActiveTab(key);
//     switch (key) {
//       case 'upcoming':
//         navigation.navigate('UpcomingEvent');
//         break;
//       case 'popular':
//         navigation.navigate('PopularEvent');
//         break;
//       case 'live':
//         navigation.navigate('LiveEvent');
//         break;
//       default:
//         // stay on Home
//         break;
//     }
//   };

//   const renderHeader = () => (
//     <View style={tw`px-4 pt-6 mt-10`}>
//       {/* Location & Notifications */}
//       <View style={tw`flex-row justify-between items-center mb-4`}>
//         <View>
//            <FontAwesome name="bars" size={24} color="black" style={tw`mr-4`} />
         

//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
//           <View style={tw`relative`}>
//             <FontAwesome name="bell" size={20} color="black" />
//             <View style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`} />
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Search Input */}
//       <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3`}>
//         <Ionicons name="search" size={18} color="#9CA3AF" />
//         <TextInput
//           style={tw`ml-2 flex-1 text-sm`}
//           placeholder="Search Event"
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       {/* Scrollable Tabs */}
//       <FlatList
//         data={tabs}
//         keyExtractor={(item) => item.key}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => handleTabPress(item.key)}
//             style={tw.style(
//               `flex-row items-center px-4 py-2 rounded-full mr-2`,
//               activeTab === item.key ? `bg-red-100` : `bg-gray-100`
//             )}
//           >
//             <FontAwesome5
//               name={item.icon}
//               size={14}
//               color={activeTab === item.key ? '#EF4444' : '#6B7280'}
//               style={tw`mr-2`}
//             />
//             <Text
//               style={tw.style(
//                 `text-sm`,
//                 activeTab === item.key ? `text-red-500` : `text-gray-600`
//               )}
//             >
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         )}
//         style={tw`mb-4`}
//       />

//       {/* Upcoming Events Section */}
//       <View style={tw`mb-2`}>
//         <View style={tw`flex-row justify-between mb-2`}>
//           <Text style={tw`font-semibold`}>Upcoming Events</Text>
//           <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//         </View>

//         <FlatList
//           data={upcomingEvents}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View style={tw`mr-4`}>
//               <Image
//                 source={item.image}
//                 style={{ width: 180, height: 100, borderRadius: 10 }}
//               />
//               <Text style={tw`mt-2 font-semibold text-sm`}>{item.title}</Text>
//               <Text style={tw`text-red-500`}>{item.price}</Text>
//               <Text style={tw`text-gray-500 text-xs`}>{item.location}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );

//   return (
//     <FlatList
//       ListHeaderComponent={renderHeader}
//       data={[{}]} 
//       renderItem={() => (
//         <View style={tw`px-4 `}>
//           <View style={tw`flex-row justify-between mb-2`}>
//             <Text style={tw`font-semibold`}>Popular Events</Text>
//             <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//           </View>
//           <Cards />
//         </View>
//       )}
//       keyExtractor={() => 'footer'}
//     />
//   );
// }



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import tw from 'tailwind-react-native-classnames';
// import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
// import Cards from '../../components/Cards';

// const { width } = Dimensions.get('window');

// const upcomingEvents = [
//   {
//     id: '1',
//     title: 'Synchronize Fest 2024',
//     date: 'May 20',
//     location: 'Yogyakarta',
//     price: '$285',
//     image: require('../../assets/event1.png'),
//   },
//   {
//     id: '2',
//     title: 'WJNC #9 : Gathering',
//     date: 'Oct 7',
//     location: 'Yogyakarta',
//     price: '$185',
//     image: require('../../assets/event2.png'),
//   },
// ];

// const tabs = [
//   { key: 'all', label: 'All', icon: 'th-large' },
//   { key: 'upcoming', label: 'Upcoming events', icon: 'calendar' },
//   { key: 'popular', label: 'Popular events', icon: 'fire' },
//   { key: 'live', label: 'Live events', icon: 'broadcast-tower' },
// ];

// const menuItems = [
//   {
//     title: 'Chat Groups',
//     subItems: [
//       { title: 'Announcements', adminOnly: true },
//       { title: 'Business' },
//       {
//         title: 'Social',
//         subItems: [
//           { title: 'General' },
//           { title: 'Horse Tipping' },
//           { title: 'Competitions' },
//           { title: 'Golf' },
//           { title: 'Wine Club' },
//           { title: 'Wellbeing' },
//         ],
//       },
//     ],
//   },
// ];

// export default function Home() {
//   const navigation = useNavigation();
//   const [likedEvents, setLikedEvents] = useState({});
//   const [activeTab, setActiveTab] = useState('all');
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [expandedItems, setExpandedItems] = useState({});
//   const slideAnim = useState(new Animated.Value(-width * 0.75))[0];

//   const toggleLike = (id) => {
//     setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleTabPress = (key) => {
//     setActiveTab(key);
//     switch (key) {
//       case 'upcoming':
//         navigation.navigate('UpcomingEvent');
//         break;
//       case 'popular':
//         navigation.navigate('PopularEvent');
//         break;
//       case 'live':
//         navigation.navigate('LiveEvent');
//         break;
//       default:
//         break;
//     }
//   };

//   const toggleMenu = () => {
//     Animated.timing(slideAnim, {
//       toValue: menuVisible ? -width * 0.75 : 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     setMenuVisible(!menuVisible);
//   };

//   const toggleSubMenu = (title) => {
//     setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
//   };

//   const renderMenuItem = ({ item, level = 0 }) => (
//     <View style={tw.style(`pl-${level * 4}`)}>
//       <TouchableOpacity
//         style={tw`flex-row items-center py-3 px-4`}
//         onPress={() => item.subItems && toggleSubMenu(item.title)}
//       >
//         <Text style={tw`text-white text-base flex-1`}>{item.title}</Text>
//         {item.adminOnly && (
//           <Text style={tw`text-gray-400 text-xs mr-2`}>Admin</Text>
//         )}
//         {item.subItems && (
//           <Ionicons
//             name={expandedItems[item.title] ? 'chevron-down' : 'chevron-forward'}
//             size={20}
//             color="white"
//           />
//         )}
//       </TouchableOpacity>

//       {item.subItems && expandedItems[item.title] && (
//         <View>
//           {item.subItems.map((subItem, index) => (
//             <View key={index}>
//               {renderMenuItem({ item: subItem, level: level + 1 })}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={tw`px-4 pt-6 mt-10`}>
//       {/* Location & Notifications */}
//       <View style={tw`flex-row justify-between items-center mb-4`}>
//         <TouchableOpacity onPress={toggleMenu}>
//           <FontAwesome name="bars" size={24} color="black" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
//           <View style={tw`relative`}>
//             <FontAwesome name="bell" size={20} color="black" />
//             <View style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`} />
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Search Input */}
//       <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3`}>
//         <Ionicons name="search" size={18} color="#9CA3AF" />
//         <TextInput
//           style={tw`ml-2 flex-1 text-sm`}
//           placeholder="Search Event"
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       {/* Scrollable Tabs */}
//       <FlatList
//         data={tabs}
//         keyExtractor={(item) => item.key}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => handleTabPress(item.key)}
//             style={tw.style(
//               `flex-row items-center px-4 py-2 rounded-full mr-2`,
//               activeTab === item.key ? `bg-red-100` : `bg-gray-100`
//             )}
//           >
//             <FontAwesome5
//               name={item.icon}
//               size={14}
//               color={activeTab === item.key ? '#EF4444' : '#6B7280'}
//               style={tw`mr-2`}
//             />
//             <Text
//               style={tw.style(
//                 `text-sm`,
//                 activeTab === item.key ? `text-red-500` : `text-gray-600`
//               )}
//             >
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         )}
//         style={tw`mb-4`}
//       />

//       {/* Upcoming Events Section */}
//       <View style={tw`mb-2`}>
//         <View style={tw`flex-row justify-between mb-2`}>
//           <Text style={tw`font-semibold`}>Upcoming Events</Text>
//           <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//         </View>

//         <FlatList
//           data={upcomingEvents}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View style={tw`mr-4`}>
//               <Image
//                 source={item.image}
//                 style={{ width: 180, height: 100, borderRadius: 10 }}
//               />
//               <Text style={tw`mt-2 font-semibold text-sm`}>{item.title}</Text>
//               <Text style={tw`text-red-500`}>{item.price}</Text>
//               <Text style={tw`text-gray-500 text-xs`}>{item.location}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );

//   return (
//     <View style={tw`flex-1`}>
//       <FlatList
//         ListHeaderComponent={renderHeader}
//         data={[{}]}
//         renderItem={() => (
//           <View style={tw`px-4`}>
//             <View style={tw`flex-row justify-between mb-2`}>
//               <Text style={tw`font-semibold`}>Popular Events</Text>
//               <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//             </View>
//             <Cards />
//           </View>
//         )}
//         keyExtractor={() => 'footer'}
//       />

//       {/* Side Menu */}
//       <Animated.View
//         style={[
//           tw`absolute top-0 bottom-0 w-3/4 bg-gray-800`,
//           { transform: [{ translateX: slideAnim }] },
//         ]}
//       >
//         <View style={tw`flex-1 pt-10`}>
//           <TouchableOpacity onPress={toggleMenu} style={tw`px-4 mb-4`}>
//             <Ionicons name="close" size={24} color="white" />
//           </TouchableOpacity>

//           <FlatList
//             data={menuItems}
//             keyExtractor={(item) => item.title}
//             renderItem={({ item }) => renderMenuItem({ item, level: 0 })}
//           />
//         </View>
//       </Animated.View>

//       {/* Overlay */}
//       {menuVisible && (
//         <TouchableOpacity
//           style={tw`absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50`}
//           onPress={toggleMenu}
//         />
//       )}
//     </View>
//   );
// }



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import tw from 'tailwind-react-native-classnames';
// import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
// import Cards from '../../components/Cards';

// const { width } = Dimensions.get('window');

// const upcomingEvents = [
//   {
//     id: '1',
//     title: 'Synchronize Fest 2024',
//     date: 'May 20',
//     location: 'Yogyakarta',
//     price: '$285',
//     image: require('../../assets/event1.png'),
//   },
//   {
//     id: '2',
//     title: 'WJNC #9 : Gathering',
//     date: 'Oct 7',
//     location: 'Yogyakarta',
//     price: '$185',
//     image: require('../../assets/event2.png'),
//   },
// ];

// const tabs = [
//   { key: 'all', label: 'All'},
//   { key: 'upcoming', label: 'VIC'},
//   { key: 'popular', label: 'NSW'},
//   { key: 'live', label: 'QLD' },
//   { key: 'past', label: 'SA'},
// ];

// export default function Home() {
//   const navigation = useNavigation();
//   const [likedEvents, setLikedEvents] = useState({});
//   const [activeTab, setActiveTab] = useState('all');

//   // Sidebar state
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const slideAnim = useState(new Animated.Value(-width))[0];

//   // Expanded items state for menu
//   const [expandedItems, setExpandedItems] = useState({});

//   const toggleExpand = (title) => {
//     setExpandedItems((prev) => ({
//       ...prev,
//       [title]: !prev[title],
//     }));
//   };

//   const toggleSidebar = () => {
//     if (sidebarOpen) {
//       Animated.timing(slideAnim, {
//         toValue: -width,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setSidebarOpen(false));
//     } else {
//       setSidebarOpen(true);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   const toggleLike = (id) => {
//     setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleTabPress = (key) => {
//     setActiveTab(key);
//     switch (key) {
//       case 'upcoming':
//         navigation.navigate('UpcomingEvent');
//         break;
//       case 'popular':
//         navigation.navigate('PopularEvent');
//         break;
//       case 'live':
//         navigation.navigate('LiveEvent');
//         break;
//       default:
//         break;
//     }
//   };

//   const renderMenuItem = (item, level = 0) => {
//     const isExpanded = expandedItems[item.title] || false;

//     return (
//       <View key={item.title}>
//         <TouchableOpacity
//           onPress={() => {
//             if (item.subItems) {
//               toggleExpand(item.title);
//             }
//           }}
//           style={[
//             tw`flex-row items-center py-3 `,
//             { paddingLeft: level * 16, borderBottomWidth: 0.5, borderColor: '#fff3' }
//           ]}
//         >
//           <Text style={[tw`text-black text-base flex-1 `, { fontWeight: '500' }]}>
//             {item.title}
//           </Text>
//           {item.subItems && (
//             <Ionicons
//               name={isExpanded ? 'chevron-up' : 'chevron-down'}
//               size={16}
//               color="black"
//             />
//           )}
//         </TouchableOpacity>

//         {isExpanded && item.subItems && (
//           <View>
//             {item.subItems.map((sub) => renderMenuItem(sub, level + 1))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   const renderMenu = () => (
//     <View
//       style={[
//         tw`h-full`,
//         { width: width * 0.75, backgroundColor: '#fdfdfdff', paddingTop: 60,  paddingLeft: 15  }
//       ]}
//     >
//       <Text style={[tw`text-black text-xl font-bold px-5 mb-4`]}>Menu</Text>
//       {menuItems.map((menu) => renderMenuItem(menu))}
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={tw`px-4 pt-6 mt-10`}>
//       {/* Location & Notifications */}
//       <View style={tw`flex-row justify-between items-center mb-4`}>
//         <TouchableOpacity onPress={toggleSidebar}>
//           <FontAwesome name="bars" size={24} color="black" style={tw`mr-4`} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
//           <View style={tw`relative`}>
//             <FontAwesome name="bell" size={20} color="black" />
//             <View
//               style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`}
//             />
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Search Input */}
//       <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3 border border-gray-300`}>
//         <Ionicons name="search" size={18} color="#9CA3AF" />
//         <TextInput
//           style={tw`ml-2 flex-1 text-sm`}
//           placeholder="Search Event"
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       {/* Scrollable Tabs */}
//       <FlatList
//         data={tabs}
//         keyExtractor={(item) => item.key}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => handleTabPress(item.key)}
//             style={tw.style(
//               `flex-row items-center px-4 py-2 rounded-md mt-4 mr-2 mb-2 border-gray-400 border`,
//               activeTab === item.key ? `bg-red-100` : `bg-gray-100`
//             )}
//           >
//             <FontAwesome5
//               name={item.icon}
//               size={14}
//               color={activeTab === item.key ? '#EF4444' : '#6B7280'}
//               style={tw`mr-2`}
//             />
//             <Text
//               style={tw.style(
//                 `text-sm`,
//                 activeTab === item.key
//                   ? `text-red-500`
//                   : `text-gray-600`
//               )}
//             >
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         )}
//         style={tw`mb-4`}
//       />

//       {/* Upcoming Events Section */}
//       <View style={tw`mb-2`}>
//         <View style={tw`flex-row justify-between mb-2`}>
//           <Text style={tw`font-semibold`}>Upcoming Events</Text>
//           <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//         </View>

//         <FlatList
//           data={upcomingEvents}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View style={tw`mr-4`}>
//               <Image
//                 source={item.image}
//                 style={{ width: 180, height: 100, borderRadius: 10 }}
//               />
//               <Text style={tw`mt-2 font-semibold text-sm`}>
//                 {item.title}
//               </Text>
//               <Text style={tw`text-red-500`}>{item.price}</Text>
//               <Text style={tw`text-gray-500 text-xs`}>
//                 {item.location}
//               </Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         ListHeaderComponent={renderHeader}
//         data={[{}]}
//         renderItem={() => (
//           <View style={tw`px-4`}>
//             <View style={tw`flex-row justify-between mb-2`}>
//               <Text style={tw`font-semibold`}>Popular Events</Text>
//               <Text style={tw`text-red-500 text-sm`}>See all events</Text>
//             </View>
//             <Cards />
//           </View>
//         )}
//         keyExtractor={() => 'footer'}
//       />

//       {sidebarOpen && (
//         <TouchableOpacity
//           style={[
//             tw`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50`,
//           ]}
//           onPress={toggleSidebar}
//           activeOpacity={1}
//         />
//       )}

//       <Animated.View
//         style={{
//           position: 'absolute',
//           top: 0,
//           bottom: 0,
//           left: 0,
//           transform: [{ translateX: slideAnim }],
          
//         }}
//       >
//         {renderMenu()}
//       </Animated.View>
//     </View>
//   );
// }




import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Cards from '../../components/Cards';

const { width } = Dimensions.get('window');

// Sidebar menu items
const menuItems = [
  {
    title: 'Chat Groups',
    subItems: [
      { title: 'Announcements (Admin only)' },
      { title: 'Business' },
      {
        title: 'Social',
        subItems: [
          { title: 'General' },
          { title: 'Horse Tipping' },
          { title: 'Competitions' },
          { title: 'Golf' },
          { title: 'Wine Club' },
        ],
      },
    ],
  },
  // {
  //   title: 'Settings',
  //   subItems: [
  //     { title: 'Profile' },
  //     { title: 'Notifications' },
  //     { title: 'Privacy' },
  //   ],
  // },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Synchronize Fest 2024',
    date: 'May 20',
    location: 'Yogyakarta',
    price: '$285',
    image: require('../../assets/event1.png'),
  },
  {
    id: '2',
    title: 'WJNC #9 : Gathering',
    date: 'Oct 7',
    location: 'Yogyakarta',
    price: '$185',
    image: require('../../assets/event2.png'),
  },
];

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'VIC' },
  { key: 'popular', label: 'NSW' },
  { key: 'live', label: 'QLD' },
  { key: 'past', label: 'SA' },
];

export default function Home() {
  const navigation = useNavigation();
  const [likedEvents, setLikedEvents] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];

  // Expanded items state for menu
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleSidebar = () => {
    if (sidebarOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarOpen(false));
    } else {
      setSidebarOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleLike = (id) => {
    setLikedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabPress = (key) => {
    setActiveTab(key);
    switch (key) {
      case 'upcoming':
        navigation.navigate('UpcomingEvent');
        break;
      case 'popular':
        navigation.navigate('PopularEvent');
        break;
      case 'live':
        navigation.navigate('LiveEvent');
        break;
      default:
        break;
    }
  };

  const renderMenuItem = (item, level = 0) => {
    const isExpanded = expandedItems[item.title] || false;

    return (
      <View key={item.title}>
        <TouchableOpacity
          onPress={() => {
            if (item.subItems) {
              toggleExpand(item.title);
            }
          }}
          style={[
            tw`flex-row items-center py-3`,
            { paddingLeft: level * 16, borderBottomWidth: 0.5, borderColor: '#fff3' },
          ]}
        >
          <Text style={[tw`text-black text-base flex-1`, { fontWeight: '500' }]}>
            {item.title}
          </Text>
          {item.subItems && (
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="black"
            />
          )}
        </TouchableOpacity>

        {isExpanded && item.subItems && (
          <View>
            {item.subItems.map((sub) => renderMenuItem(sub, level + 1))}
          </View>
        )}
      </View>
    );
  };

  const renderMenu = () => (
    <View
      style={[
        tw`h-full`,
        { width: width * 0.75, backgroundColor: '#fdfdfdff', paddingTop: 60, paddingLeft: 15 },
      ]}
    >
      <Text style={[tw`text-black text-xl font-bold px-5 mb-4`]}>Menu</Text>
      {menuItems.map((menu) => renderMenuItem(menu))}
    </View>
  );

  const renderHeader = () => (
    <View style={tw`px-4 pt-6 mt-10`}>
      {/* Location & Notifications */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <TouchableOpacity onPress={toggleSidebar}>
          <FontAwesome name="bars" size={24} color="black" style={tw`mr-4`} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <View style={tw`relative`}>
            <FontAwesome name="bell" size={20} color="black" />
            <View style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View
        style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3 border border-gray-300`}
      >
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={tw`ml-2 flex-1 text-sm`}
          placeholder="Search Event"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Scrollable Tabs */}
      <FlatList
        data={tabs}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleTabPress(item.key)}
            style={tw.style(
              `flex-row items-center px-4 py-2 rounded-md mt-4 mr-2 mb-2 border-gray-400 border`,
              activeTab === item.key ? `bg-red-100` : `bg-gray-100`
            )}
          >
            <FontAwesome5
              name={item.icon}
              size={14}
              color={activeTab === item.key ? '#EF4444' : '#6B7280'}
              style={tw`mr-2`}
            />
            <Text
              style={tw.style(`text-sm`, activeTab === item.key ? `text-red-500` : `text-gray-600`)}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        style={tw`mb-4`}
      />

      {/* Upcoming Events Section */}
      <View style={tw`mb-2`}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`font-semibold`}>Upcoming Events</Text>
          <Text style={tw`text-red-500 text-sm`}>See all events</Text>
        </View>

        <FlatList
          data={upcomingEvents}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={tw`mr-4`}>
              <Image
                source={item.image}
                style={{ width: 180, height: 100, borderRadius: 10 }}
              />
              <Text style={tw`mt-2 font-semibold text-sm`}>{item.title}</Text>
              <Text style={tw`text-red-500`}>{item.price}</Text>
              <Text style={tw`text-gray-500 text-xs`}>{item.location}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[{}]}
        renderItem={() => (
          <View style={tw`px-4`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`font-semibold`}>Popular Events</Text>
              <Text style={tw`text-red-500 text-sm`}>See all events</Text>
            </View>
            <Cards />
          </View>
        )}
        keyExtractor={() => 'footer'}
      />

      {sidebarOpen && (
        <TouchableOpacity
          style={[tw`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50`]}
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      )}

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {renderMenu()}
      </Animated.View>
    </View>
  );
}
