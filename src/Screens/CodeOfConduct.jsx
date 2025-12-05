import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

export default function CodeOfConduct({ navigation }) {
  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-4 bg-white border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800 ml-4`}>
          Code of Conduct
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-5 pb-20`}>
        {/* Title */}
        <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>
          Good Blokes Society Member Code of Conduct
        </Text>

        {/* Section */}
        <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
          About The GBS
        </Text>
        <Text style={tw`text-sm text-gray-700 leading-6 mb-4`}>
          The Good Blokes Society (“The GBS”) is a gated membership community
          built to foster meaningful social and business connections, support
          men’s health, and provide value through events, collaboration and
          community engagement.
        </Text>

        {/* Objectives */}
        <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
          Our Objectives
        </Text>

        <Bullet>
          To promote a wide range of social benefits including events and
          digital connection via WhatsApp, Instagram, LinkedIn and Facebook.
        </Bullet>
        <Bullet>
          To provide members with a friendly, value-driven organisation that
          encourages involvement in activities.
        </Bullet>
        <Bullet>
          To co-operate with and potentially support organisations aligned with
          the GBS mission.
        </Bullet>
        <Bullet>
          To raise, collect and utilise funds for furthering GBS initiatives.
        </Bullet>
        <Bullet>
          To promote positive connection between men on both business and social
          levels, with a strong emphasis on men’s mental health.
        </Bullet>

        {/* Members Rights */}
        <Text style={tw`text-lg font-semibold text-gray-800 mt-6 mb-2`}>
          Members Have a Right To:
        </Text>

        <Bullet>
          Be treated fairly, equally and with respect by the GBS and all members.
        </Bullet>
        <Bullet>
          Socialise in an environment free from harassment or discrimination.
        </Bullet>
        <Bullet>
          Privacy and confidentiality of personal information within the limits
          of member-to-member connection.
        </Bullet>
        <Bullet>
          Be informed and actively involved in GBS events and offerings.
        </Bullet>
        <Bullet>
          Voice opinions or suggestions respectfully to GBS Management.
        </Bullet>

        {/* Member Responsibilities */}
        <Text style={tw`text-lg font-semibold text-gray-800 mt-6 mb-2`}>
          Members Must:
        </Text>

        <Bullet>
          Treat all members, guests and venue staff with courtesy and respect.
        </Bullet>
        <Bullet>
          Behave responsibly and avoid conduct that may harm the reputation of
          the GBS or its events.
        </Bullet>
        <Bullet>Not engage in physical or verbal harassment.</Bullet>
        <Bullet>
          Report inappropriate behaviour to GBS Management promptly.
        </Bullet>
        <Bullet>
          Pay all event or membership fees committed to unless otherwise arranged.
        </Bullet>
        <Bullet>
          Keep contact details updated with the GBS Membership Officer.
        </Bullet>
        <Bullet>
          Promote goodwill, connection and professionalism within the GBS community.
        </Bullet>

        {/* Breaches */}
        <Text style={tw`text-lg font-semibold text-gray-800 mt-6 mb-2`}>
          Breaches of This Code
        </Text>

        <Bullet>
          Members acting against this Code may be asked to leave events with no
          refund issued.
        </Bullet>
        <Bullet>
          Inappropriate behaviour on GBS social platforms may result in removal
          from all GBS online groups.
        </Bullet>
        <Bullet>
          Serious breaches may lead to reprimand, suspension or revocation of
          membership following fair investigation.
        </Bullet>

        <View style={tw`h-14`} />
      </ScrollView>
    </View>
  );
}

/* Bullet Component for Clean UI */
const Bullet = ({ children }) => (
  <View style={tw`flex-row items-start mb-2`}>
    <Text style={tw`text-red-500 text-lg mr-2`}>•</Text>
    <Text style={tw`text-sm text-gray-700 flex-1 leading-6`}>{children}</Text>
  </View>
);
