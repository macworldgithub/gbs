import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Cards from "../../components/Cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Drawer from "../../components/Drawer"; 

const upcomingEvents = [
  {
    id: "1",
    title: "Synchronize Fest 2024",
    date: "May 20",
    location: "Yogyakarta",
    price: "$285",
    image: require("../../assets/event1.png"),
  },
  {
    id: "2",
    title: "WJNC #9 : Gathering",
    date: "Oct 7",
    location: "Yogyakarta",
    price: "$185",
    image: require("../../assets/event2.png"),
  },
];

const tabs = [
  { key: "all", label: "All" },
  { key: "VIC", label: "VIC" },
  { key: "NSW", label: "NSW" },
  { key: "QLD", label: "QLD" },
  { key: "SA", label: "SA" },
  { key: "WA", label: "WA" },
];


export default function Home() {
  const navigation = useNavigation();
  const [likedEvents, setLikedEvents] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
    } catch (e) {}
    navigation.reset({ index: 0, routes: [{ name: "Signin" }] });
  };


  const handleTabPress = (key) => {
  setActiveTab(key);
};



  // const handleTabPress = (key) => {
  //   setActiveTab(key);
  //   switch (key) {
  //     case "upcoming":
  //       navigation.navigate("UpcomingEvent");
  //       break;
  //     case "popular":
  //       navigation.navigate("PopularEvent");
  //       break;
  //     case "live":
  //       navigation.navigate("LiveEvent");
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const renderHeader = () => (
    <View style={tw`px-4 pt-6 mt-10`}>
      {/* Location & Notifications */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <TouchableOpacity onPress={toggleSidebar}>
          <FontAwesome name="bars" size={24} color="black" style={tw`mr-4`} />
        </TouchableOpacity>

        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")} style={tw`mr-4`}>
            <View style={tw`relative`}>
              <FontAwesome name="bell" size={20} color="black" />
              <View style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={tw`flex-row items-center`}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={tw`ml-1 text-red-500`}>Logout</Text>
          </TouchableOpacity>
        </View>
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
              color={activeTab === item.key ? "#EF4444" : "#6B7280"}
              style={tw`mr-2`}
            />
            <Text
              style={tw.style(
                `text-sm`,
                activeTab === item.key ? `text-red-500` : `text-gray-600`
              )}
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
          <Text style={tw`font-semibold`}>Latest News</Text>
          <Text style={tw`text-red-500 text-sm`}>See all News</Text>
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
              <Text style={tw`font-semibold`}>Chairman's Partners</Text>
              <Text style={tw`text-red-500 text-sm`}>See all partners</Text>
            </View>
            <Cards stateFilter={activeTab} />
          </View>
        )}
        keyExtractor={() => "footer"}
      />

      {/* Sidebar Component */}
      <Drawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}
