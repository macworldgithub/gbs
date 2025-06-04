import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons'; // use vector icons

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-12">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-base font-semibold text-black">Profile</Text>
        <TouchableOpacity className="bg-red-100 px-4 py-1 rounded-full">
          <Text className="text-red-500 text-sm font-medium">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-red-500 rounded-full items-center justify-center mb-3">
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text className="text-lg font-bold text-black">Franklin Clinton</Text>
        <Text className="text-sm text-gray-500">franklinclinton@gmail.com</Text>
      </View>

      {/* Menu Items */}
      <View className="space-y-4">
        {/* 1. Edit Profile */}
        <TouchableOpacity className="flex-row items-center bg-gray-100 p-4 rounded-xl justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="person" size={20} color="#ef4444" />
            <Text className="text-base text-black">Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 2. Account Security */}
        <TouchableOpacity className="flex-row items-center bg-gray-100 p-4 rounded-xl justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="shield-checkmark" size={20} color="#ef4444" />
            <Text className="text-base text-black">Account Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 3. Scan Member */}
        <TouchableOpacity className="flex-row items-center bg-gray-100 p-4 rounded-xl justify-between">
          <View className="flex-row items-center space-x-3">
            <MaterialIcons name="qr-code-scanner" size={20} color="#ef4444" />
            <Text className="text-base text-black">Scan Member</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 4. Payment Method */}
        <TouchableOpacity className="flex-row items-center bg-gray-100 p-4 rounded-xl justify-between">
          <View className="flex-row items-center space-x-3">
            <FontAwesome5 name="credit-card" size={18} color="#ef4444" />
            <Text className="text-base text-black">Payment Method</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 5. General Settings */}
        <TouchableOpacity className="flex-row items-center bg-gray-100 p-4 rounded-xl justify-between">
          <View className="flex-row items-center space-x-3">
            <Feather name="settings" size={20} color="#ef4444" />
            <Text className="text-base text-black">General Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        {/* 6. Help Centre */}
        <TouchableOpacity className="flex-row items-center bg-gray-100 p-4 rounded-xl justify-between mb-4">
          <View className="flex-row items-center space-x-3">
            <Feather name="help-circle" size={20} color="#ef4444" />
            <Text className="text-base text-black">Help Centre</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <Text className="text-center text-gray-400 text-xs mt-4 mb-8">App version 1.0.0.1</Text>
    </ScrollView>
  );
}
