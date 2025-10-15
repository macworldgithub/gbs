import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";

export default function GroupInfo() {
  const navigation = useNavigation();

  return (
    <ScrollView style={tw`bg-gray-100 flex-1 mt-3`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-4 bg-white`}>
        <TouchableOpacity onPress={() => navigation.navigate("GroupChat")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold ml-4`}>Group Info</Text>
        <View style={tw`flex-1 items-end`}>
          <TouchableOpacity onPress={() => navigation.navigate("EditGroup")}>
            <Text style={tw`text-blue-600 text-base`}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Group Profile */}
      <View style={tw`items-center mt-6`}>
        <Image
          source={require('../../assets/grouppic.png')}
          style={tw`w-24 h-24 rounded-full`}
        />
        <Text style={tw`mt-4 text-lg font-bold`}>Group Name</Text>
        <Text style={tw`text-gray-500`}>Group - 6 members</Text>
      </View>

      {/* Cards */}
      <View style={tw`mt-8 px-4 mb-10`}>
        {[
          { label: "Add group description", screen: "AddDescription" },
          { label: "Gallery", screen: "Gallery" },
          { label: "Mute Group", screen: "MuteGroup" },
          { label: "Chat theme", screen: "Theme" },
          { label: "Share group invitation link", screen: "ShareGroupLink" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.screen)}
            style={tw`bg-white border border-gray-300 rounded-lg p-4 flex-row justify-between items-center mb-4`}
          >
            <Text style={tw`text-base`}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
