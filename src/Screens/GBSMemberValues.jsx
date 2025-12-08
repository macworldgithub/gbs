import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

export default function GBSMemberValues({ navigation }) {
  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-4 bg-white border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800 ml-4`}>
          GBS Member Values
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-5 pb-20`}>

        {/* Title */}
        <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>
          Good Blokes Society Member Values
        </Text>

        {/* Intro */}
        <Text style={tw`text-sm text-gray-700 leading-6 mb-4`}>
          The Good Blokes Society, formed in 2014, has grown from humble beginnings
          into a community that has created lifelong friendships, meaningful business
          connections and countless memories. It provides a space for men to support
          each other and promote men’s health in a positive and impactful way.
        </Text>

        <Text style={tw`text-sm text-gray-700 leading-6 mb-4`}>
          As our community welcomes new members, it is important we reinforce the
          shared values that make someone a “Good Bloke.” These values have been
          naturally embraced by our members, guiding how we behave, how we support
          one another and how we continue to enjoy the GBS experience together.
        </Text>

        <Text style={tw`text-sm text-gray-700 leading-6 mb-6`}>
          These values are simple, but they speak to who we are individually and as
          a collective. Let’s continue to enjoy our time together, have fun doing it,
          and always remember why we connect.
        </Text>

        {/* Values */}
        <Bullet>Do the right thing, always.</Bullet>
        <Bullet>Bring out the best in everyone.</Bullet>
        <Bullet>Be authentic.</Bullet>
        <Bullet>Be Accountable: Each of us is responsible for our words and our actions.</Bullet>
        <Bullet>Have integrity: We are trustworthy and act in good faith.</Bullet>
        <Bullet>
          Respect: Recognise that the thoughts, feelings and circumstances of others
          are as important as our own.
        </Bullet>
        <Bullet>Inclusion: Embrace all members, be present and welcoming.</Bullet>
        <Bullet>Teamwork: Support each other — sometimes one of us needs a little help.</Bullet>
        <Bullet>Fun: Let’s enjoy this community and have fun doing it.</Bullet>
        <Bullet>Make a little music.</Bullet>

        <View style={tw`h-14`} />
      </ScrollView>
    </View>
  );
}

const Bullet = ({ children }) => (
  <View style={tw`flex-row items-start mb-3`}>
    <Text style={tw`text-red-500 text-lg mr-2`}>•</Text>
    <Text style={tw`text-sm text-gray-700 flex-1 leading-6`}>
      {children}
    </Text>
  </View>
);
