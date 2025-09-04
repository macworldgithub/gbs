import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState({ today: [], yesterday: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://gbs.westsidecarcare.com.au/notification")
      .then((res) => res.json())
      .then((resData) => {
        // Group notifications into Today / Yesterday
        const today = [];
        const yesterday = [];
        const now = new Date();
        const todayDate = now.toDateString();

        resData.forEach((n) => {
          const createdDate = new Date(n.createdAt);
          if (createdDate.toDateString() === todayDate) {
            today.push(n);
          } else {
            yesterday.push(n);
          }
        });

        setData({ today, yesterday });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const markAllAsRead = (section) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].map((n) => ({
        ...n,
        unread: false,
        highlight: false,
      })),
    }));
  };

  const renderItem = (item) => (
    <View
      key={item._id}
      style={
        item.highlight
          ? [tw`flex-row items-start px-4 py-3 rounded bg-purple-100`]
          : tw`flex-row items-start px-4 py-3`
      }
    >
      <View style={tw`mt-1 mr-2`}>
        <FontAwesome name="bell" size={16} color="#f43f5e" />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-sm font-semibold text-black`}>{item.title}</Text>
        <Text style={tw`text-xs text-gray-500`}>{item.message}</Text>
        <Text style={tw`text-xs text-gray-400 mt-1`}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#f43f5e" />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white pt-10`}>
      {/* Header */}
      <View
        style={tw`flex-row justify-between items-center px-4 py-4 border-b border-gray-100`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-black ml-2 flex-1`}>
          Notification
        </Text>
        <TouchableOpacity style={tw`bg-red-500 rounded-full px-3 py-0.5`}>
          <Text style={tw`text-white text-xs font-medium p-2`}>
            {data.today.length + data.yesterday.length} NEW
          </Text>
        </TouchableOpacity>

         {/* <TouchableOpacity
         onPress={() => navigation.navigate("NotificationForm")}
         style={tw`bg-red-500 rounded-full px-3 py-0.5`}>
          <Text style={tw`text-white text-xs font-medium p-2`}>
            create event
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Today */}
      <View style={tw`mt-2`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-1`}>
          <Text style={tw`text-xs font-medium text-gray-400`}>TODAY</Text>
          <TouchableOpacity onPress={() => markAllAsRead("today")}>
            <Text style={tw`text-xs font-medium text-red-500`}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
        {data.today.length > 0 ? (
          data.today.map((item) => renderItem(item))
        ) : (
          <Text style={tw`text-center text-gray-400 text-xs`}>
            No notifications for today
          </Text>
        )}
      </View>

      {/* Yesterday */}
      <View style={tw`mt-4 mb-10`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-1`}>
          <Text style={tw`text-xs font-medium text-gray-400`}>YESTERDAY</Text>
          <TouchableOpacity onPress={() => markAllAsRead("yesterday")}>
            <Text style={tw`text-xs font-medium text-red-500`}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
        {data.yesterday.length > 0 ? (
          data.yesterday.map((item) => renderItem(item))
        ) : (
          <Text style={tw`text-center text-gray-400 text-xs`}>
            No notifications for yesterday
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
