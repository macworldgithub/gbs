import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const membershipContent = {
  "Social & Wellbeing Membership": {
    intro:
      "This membership is designed to support your overall wellbeing while connecting you with the Good Blokes Society community through premium experiences",
    details:
      "You'll receive valuable content to educate and inspire you to take care of your physical, mental, and emotional health, alongside opportunities to engage with fellow members through exclusive events and online competitions",
    benefits: [
      "Membership Gift Box (1st year only)",
      "Membership prices at all GBS events",
      "Access to free sports competitions",
      "Events to connect with fellow social members",
      "Members communication and newsletter",
      "The Drinks Edit VIP membership (Value $59.00)",
      "Communication, content and podcasts dedicated to creating social relationships",
      "Special offers and discounts will be promoted to social & wellbeing members from our business partners",
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
  "GBS Alliance": {
    intro:
      "We’re excited to announcethe GBS Alliance—a premium business networking program for ambitious leaders ready to elevate their business and amplify their impact.",
    details:
      "Through seven structured half-day sessionsannually, join a team-oriented group of likeminded business owners and executives. Access expert speakers, peer accountability, signature dinners and exclusive member benefits—all designed to drive measurable business growth.",
    benefits: [
      "7 Half-Day Sessions (Mar - Dec)",
      "Hosted at premium venues each month",
      "Set day of the week for consistency",
      "7:30 AM – 12:00 PM",
      "Limited members per session for deep, focused collaboration",
      "Same group meets to build trust and continuity",
      "Peer-to-peer accountability and support",
      "4 of 7 sessions hosted by guest speakers providing expertise in AI, HR, Marketing, Budgeting, Leadership, and more",
      "Signature dinners to connect, celebrate, recognise and support all Alliance members",
      "Breakfast available for attendees",
      "Professional networking environment",
      "Access to the national network of GBS business community",
      "Business masterclasses and workshops by design",
      "HR, Marketing, Finance & Compliance support services",
      "Member-to-member product and service offers",
      "Business promotional video",
    ],
  },
};

export default function MembershipDetails({ route, navigation }) {
  const { label } = route.params || {};
  const data = membershipContent[label];

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`bg-red-600 pt-14 pb-6 px-4`}>
        <TouchableOpacity
          style={tw`absolute top-14 left-4 z-10`}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={tw`text-center text-white text-3xl font-extrabold mt-4`}>
          {label || "Membership Details"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-6 pb-20`}>
        {/* If details exist */}
        {data ? (
          <>
            <Text style={tw`text-base text-gray-700 leading-7 mb-6`}>
              {data.intro}
            </Text>
            <Text style={tw`text-base text-gray-700 leading-7 mb-6`}>
              {data.details}
            </Text>

            <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>
              Membership Includes:
            </Text>

            {data.benefits.map((benefit, index) => (
              <View key={index} style={tw`flex-row items-start mb-4`}>
                <MaterialIcons name="check-circle" size={22} color="#dc2626" />
                <Text style={tw`text-base text-gray-700 ml-3 flex-1 leading-6`}>
                  {benefit}
                </Text>
              </View>
            ))}
          </>
        ) : (
          /* User-friendly message when no details available */
          <View style={tw`items-center py-20`}>
            <MaterialIcons name="info-outline" size={80} color="#9ca3af" />
            <Text style={tw`text-2xl font-bold text-gray-800 mt-6 text-center`}>
              Details Coming Soon
            </Text>
            <Text
              style={tw`text-base text-gray-600 mt-4 text-center px-8 leading-6`}
            >
              We're currently updating the detailed information for the{" "}
              <Text style={tw`font-semibold`}>{label}</Text> membership.
            </Text>
            <Text
              style={tw`text-base text-gray-600 mt-3 text-center px-8 leading-6`}
            >
              Please check back soon or contact support for more information.
            </Text>

            <TouchableOpacity
              style={tw`mt-8 bg-red-600 px-8 py-4 rounded-full`}
              onPress={() => navigation.goBack()}
            >
              <Text style={tw`text-white font-bold text-lg`}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
