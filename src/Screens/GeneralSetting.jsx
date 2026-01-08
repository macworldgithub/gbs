import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "tailwind-react-native-classnames";

const GeneralSetting = () => {
  const navigation = useNavigation();

  const settings = [
    {
      title: "Term of Use",
      description: "",
      value: "",
      screen: "TermsOfUse",
    },
    {
      title: "Privacy Policy",
      description: "",
      value: "",
      screen: "PrivacyPolicy",
    },
  ];

  return (
    <View style={tw`flex-1 bg-white pt-10`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold ml-4`}>General Settings</Text>
      </View>

      {/* Settings List */}
      <ScrollView style={tw`p-4`}>
        {settings.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={tw`bg-white p-4 mb-3 border border-gray-300 rounded-xl`}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-base font-medium text-gray-800`}>
                {item.title}
              </Text>

              <View style={tw`flex-row items-center`}>
                {item.value !== "" && (
                  <Text style={tw`text-sm text-red-500 mr-2`}>
                    {item.value}
                  </Text>
                )}
                <Icon name="angle-right" size={16} color="#888" />
              </View>
            </View>

            {/* Description (only if exists) */}
            {item.description !== "" && (
              <Text style={tw`text-sm text-gray-500 mt-1`}>
                {item.description}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default GeneralSetting;
