import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../utils/storage"; // ✅ import your storage.js
import Cards from "../../components/Cards";

const fallbackImage = require("../../assets/fallback.png");
const tabs = [];
const states = ["All", "VIC", "NSW", "QLD", "SA", "WA"];
const API_URL = "https://gbs.westsidecarcare.com.au/events";

const Social = () => {
  const [activeTab, setActiveTab] = useState("Events");
  const [selectedState, setSelectedState] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [booked, setBooked] = useState(false);
  const loggedInUserId = user?.user?._id || user?._id || user?.sub;

  const [form, setForm] = useState({
    title: "",
    description: "",
    state: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUserData();
      console.log("Fetched user data:", u);
      setUser(u);
    };
    fetchUser();
  }, []);

  const fetchEvents = async (stateFilter = "All") => {
    try {
      setLoading(true);

      let url = `${API_URL}?&limit=100`;
      if (stateFilter !== "All") {
        url += `&state=${stateFilter}`;
      }

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("Fetched events data:", data);

      // if (res.ok) {
      //   setEvents(data);
      // } else {
      //   Alert.alert("Error", data.message || "Failed to load events");
      // }

      if (res.ok) {
        setEvents(Array.isArray(data.events) ? data.events : []);
      } else {
        Alert.alert("Error", data.message || "Failed to load events");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedState);
  }, [selectedState]);
  return (
    <ScrollView style={tw`flex-1 bg-white py-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mt-12 mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-xl font-bold`}>Social</Text>
          <Text style={tw`text-sm text-gray-600`}>Community & Events</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={tw`flex-row mb-4`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw.style(
              `px-4 py-2 mr-2 rounded-md`,
              activeTab === tab ? "bg-red-500" : "bg-gray-100"
            )}
          >
            <Text
              style={tw.style(
                `text-sm`,
                activeTab === tab ? "text-white" : "text-gray-700"
              )}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* State Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mb-4`}
      >
        {states.map((st) => (
          <TouchableOpacity
            key={st}
            onPress={() => setSelectedState(st)}
            style={tw.style(
              `px-4 py-2 mr-2 rounded-md border`,
              selectedState === st
                ? "bg-red-100 border-red-500"
                : "bg-white border-gray-300"
            )}
          >
            <Text
              style={tw.style(
                `text-sm`,
                selectedState === st ? "text-red-600" : "text-gray-700"
              )}
            >
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loader */}
      {loading && (
        <ActivityIndicator size="large" color="red" style={tw`mt-4`} />
      )}

      {/* ✅ Events Section — Use Cards component */}
      {activeTab === "Events" && !loading && (
        <View style={tw`mt-2`}>
          <Cards stateFilter={selectedState} limit={100} />
        </View>
      )}

      {/* If some other tab selected */}
      {activeTab !== "Events" && (
        <Text style={tw`text-gray-500 text-center mt-6`}>
          Select “Events” tab to view events.
        </Text>
      )}
    </ScrollView>
  );
};

export default Social;
