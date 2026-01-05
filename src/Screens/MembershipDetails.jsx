import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "tailwind-react-native-classnames";
import { style } from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";

const membershipContent = {
  "Wellbeing Membership": {
    intro:
      "The wellbeing membership will provide you with content to educate and inspire you to take care of your physical, mental, and emotional wellbeing.",
    benefits: [
      "Membership pin and hat (1st year only)",
      "Membership prices at all Good Blokes Society events",
      "Invitation to join the wellbeing community via the GBS App",
      "Communication, content and podcasts dedicated to your health and wellbeing",
      "Invitations to wellbeing and charity events",
      "Special offers and discounts promoted by business partners",
    ],
  },

  "Business Member": {
    intro:
      "The entry level business membership provides benefits and value to enhance your professional network.",
    benefits: [
      "Membership Gift Box (1st year only)",
      "Membership prices at all GBS events",
      "Access to GBS Members App with detailed business profile",
      "Business-to-business activation",
      "Access to free sports competitions",
      "Business events to connect with fellow members",
      "1 ticket to a GBS Marquee event",
      "Annual business connection event invitation",
      "The Drinks Edit VIP membership (Value $59.00)",
      "Communication, content & podcasts focused on business networking",
      "Offers & discounts from corporate partners",
      "Member newsletters",
      "You may promote offers or services to the membership",
      "Additional memberships available for $295 pp",
    ],
  },

  "Business Executive Member": {
    intro:
      "The executive membership offers deeper engagement within the GBS business community.",
    benefits: [
      "Membership prices at all GBS events",
      "Access to GBS Members App with detailed business profile",
      "Business-to-business activation",
      "Access to free sports competitions",
      "Business events to connect with members",
      "4 tickets to GBS Marquee events",
      "The Drinks Edit VIP membership (Value $59.00)",
      "Annual business connection event invitation",
      "Business relationship–focused podcasts & communication",
      "Offers and discounts from corporate partners",
      "Member newsletters",
      "Promote offers or services to the community",
      "5 facilitated business introductions",
      "Additional memberships available for $295 pp",
    ],
  },

  "Social Membership": {
    intro:
      "The social membership provides a premium social experience and allows you to connect with fellow GBS community members.",
    benefits: [
      "Membership Gift Box (1st year only)",
      "Membership prices at all GBS events",
      "Access to GBS App & social communities",
      "Access to free sports competitions",
      "Events with fellow social members",
      "Social profile on the GBS App",
      "Member communications & newsletters",
      "The Drinks Edit VIP membership (Value $59.00)",
      "Content & podcasts focused on social relationships",
      "Special offers & discounts for social members",
    ],
  },

  "Heartbeat Member": {
    intro:
      "Become a leader of the GBS business community. Heartbeat membership provides ultimate access and exclusive opportunities.",
    benefits: [
      "Membership Gift Box (1st year only)",
      "Membership prices at all GBS events",
      "Access to GBS App with detailed business profile",
      "Business-to-business activation",
      "Access to free sports competitions",
      "Business events to connect with members",
      "12 tickets to GBS Marquee events",
      "The Drinks Edit VIP membership (Value $59.00) + access to George Samios",
      "Annual business connection event invitation",
      "Business-focused communication & podcasts",
      "Offers & discounts from corporate partners",
      "Member newsletters",
      "Promote offers or services to the community",
      "10 facilitated business introductions",
      "1 tailored business event curated for your business",
      "Additional memberships available for $295 pp",
    ],
  },
};

export default function MembershipDetails({ route, navigation }) {
  const { label } = route.params;
  const data = membershipContent[label];

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`bg-red-500 pt-14 pb-4 px-4`}>
        <TouchableOpacity
          style={tw`absolute top-14 left-4 z-10`}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={tw`text-center text-white text-2xl font-bold`}>
          {label}
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-5 pb-20`}>
        <Text style={tw`text-base text-gray-700 leading-6 mb-4`}>
          {data.intro}
        </Text>

        <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
          Membership Includes:
        </Text>

        {data.benefits.map((b, i) => (
          <View key={i} style={tw`flex-row mb-2`}>
            <Text style={tw`text-red-500 text-lg mr-2`}>•</Text>
            <Text style={tw`text-sm text-gray-700 flex-1 leading-6`}>{b}</Text>
          </View>
        ))}

        <View style={tw`h-10`} />
      </ScrollView>
    </View>
  );
}
