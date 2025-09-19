import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons"; // use vector icons
import tw from "tailwind-react-native-classnames";

export default function ProfileScreen() {
  return (
    <ScrollView style={tw`flex-1 bg-white px-4 pt-12`}>
      {/* Top Bar */}
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <Text style={tw`text-base font-semibold text-black`}>Profile</Text>
        <TouchableOpacity style={tw`bg-red-100 px-4 py-1 rounded-full`}>
          <Text style={tw`text-red-500 text-sm font-medium`}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={tw`items-center mb-8`}>
        <View style={tw`w-20 h-20 bg-red-500 rounded-full items-center justify-center mb-3`}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={tw`text-lg font-bold text-black`}>Franklin Clinton</Text>
        <Text style={tw`text-sm text-gray-500`}>franklinclinton@gmail.com</Text>
      </View>

      {/* Menu Items */}
      <View style={tw`space-y-4`}>
        {/* 1. Edit Profile */}
        <TouchableOpacity style={tw`flex-row items-center bg-gray-100 p-4 rounded-xl justify-between`}>
          <View style={tw`flex-row items-center space-x-3`}>
            <Ionicons name="person" size={20} color="#ef4444" />
            <Text style={tw`text-base text-black`}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 2. Account Security */}
        <TouchableOpacity style={tw`flex-row items-center bg-gray-100 p-4 rounded-xl justify-between`}>
          <View style={tw`flex-row items-center space-x-3`}>
            <Ionicons name="shield-checkmark" size={20} color="#ef4444" />
            <Text style={tw`text-base text-black`}>Account Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 3. Scan Member */}
        <TouchableOpacity style={tw`flex-row items-center bg-gray-100 p-4 rounded-xl justify-between`}>
          <View style={tw`flex-row items-center space-x-3`}>
            <MaterialIcons name="qr-code-scanner" size={20} color="#ef4444" />
            <Text style={tw`text-base text-black`}>Scan Member</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 4. Payment Method */}
        <TouchableOpacity style={tw`flex-row items-center bg-gray-100 p-4 rounded-xl justify-between`}>
          <View style={tw`flex-row items-center space-x-3`}>
            <FontAwesome5 name="credit-card" size={18} color="#ef4444" />
            <Text style={tw`text-base text-black`}>Payment Method</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 5. General Settings */}
        <TouchableOpacity style={tw`flex-row items-center bg-gray-100 p-4 rounded-xl justify-between`}>
          <View style={tw`flex-row items-center space-x-3`}>
            <Feather name="settings" size={20} color="#ef4444" />
            <Text style={tw`text-base text-black`}>General Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 6. Help Centre */}
        <TouchableOpacity style={tw`flex-row items-center bg-gray-100 p-4 rounded-xl justify-between mb-4`}>
          <View style={tw`flex-row items-center space-x-3`}>
            <Feather name="help-circle" size={20} color="#ef4444" />
            <Text style={tw`text-base text-black`}>Help Centre</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <Text style={tw`text-center text-gray-400 text-xs mt-4 mb-8`}>
        App version 1.0.0.1
      </Text>
    </ScrollView>
  );
}

