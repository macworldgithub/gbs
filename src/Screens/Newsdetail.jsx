import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

const newsData = [
  {
    id: "1",
    heading: "🍸 NEW GBS GIN AVAILABLE NOW",
    title:
      "The GBS Legends London Dry Gin Bold. Australian. Unapologetically Good.",
    detail:
      "A collaboration between GBS and Brunswick Aces celebrating mateship, grit, and good humour. This isn't just gin—it's pure GBS spirit in a bottle.\n\nOrder now: Price: $99.95 Pickup: Brunswick Aces, Brunswick East Delivery: FREE in VIC | Small charge interstate",
    link: null,
    link: "https://brunswickaces.com/products/gbs-london-dry-gin",
    image: require("../../assets/news1.jpeg"),
  },
  {
    id: "2",
    heading: "INTRODUCING GBS ALLIANCE MEMBERSHIP",
    title: "A Truly Elevated GBS Business Experience",
    detail:
      "Accelerate your business relationships by design with the Good Blokes Society Alliance—a premium networking program for ambitious business owners, C-suite executives, general managers, and emerging leaders who are committed to growth and making a broader impact within the GBS community.\n\nThe Alliance Difference: This isn't just networking—it's a structured workshop forum where a united power group of like-minded members from diverse industries commit to 7 half-day sessions per year (Feb-Dec). Meet with the same trusted group to share ideas, resources, learning, and growth strategies while tackling challenges and unlocking opportunities together.\n\nWhat's Included:\n• 7 Half-Day Sessions (7:30 AM – 12:00 PM) at premium venues with limited members for focused collaboration\n• Guest Speakers at 4 of 7 sessions covering AI, HR, Marketing, Budgeting, Leadership, and more\n• Mid-Year & End-of-Year Signature Dinners to connect, celebrate, and support all Alliance members\n• Premium Hospitality including breakfast and barista coffee throughout each session\n• Exclusive Benefits: Access to the national GBS business network, masterclasses, HR/Marketing/Finance support, member offers, and a business promotional video\n\nInvestment: $7,500 + GST per year\n\nContact Leon Davies: 0448 931 555 | leon@goodblokessociety.com.au",
    link: null,
    image: require("../../assets/wellbeing4.png"),
  },
];

export default function NewsDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { newsId } = route.params;
  const news = newsData.find((item) => item.id === newsId);

  if (!news) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text>News not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Custom Header: Back Arrow (Left) + News Detail (Center) */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-extrabold text-red-600`}>News Detail</Text>

        {/* Right side empty for balance (optional logo ya text yahan daal sakte ho) */}
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={tw`px-4 pt-6 pb-8`}>
        <Text style={tw`text-2xl font-extrabold mb-4 text-center`}>
          {news.heading}
        </Text>

        <Image
          source={news.image}
          style={{
            width: "100%",
            height: 300,
            borderRadius: 12,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />

        {news.title && (
          <Text style={tw`text-xl font-bold mb-3`}>{news.title}</Text>
        )}

        <Text
          style={tw`text-base text-gray-700 leading-6 mb-6 whitespace-pre-line`}
        >
          {news.detail}
        </Text>

        {news.link && (
          <TouchableOpacity
            onPress={() => Linking.openURL(news.link)}
            style={tw`bg-red-500 py-3 px-6 rounded-lg mb-6`}
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>
              Visit Link
            </Text>
          </TouchableOpacity>
        )}

        {/* Special contact for id "2" */}
        {newsId === "2" && (
          <View style={tw`bg-gray-100 p-4 rounded-lg`}>
            <Text style={tw`font-bold text-lg mb-2`}>
              Contact for Alliance Membership
            </Text>
            <Text
              style={tw`text-blue-600`}
              onPress={() => Linking.openURL("tel:0448931555")}
            >
              Phone: 0448 931 555
            </Text>
            <Text
              style={tw`text-blue-600`}
              onPress={() =>
                Linking.openURL("mailto:leon@goodblokessociety.com.au")
              }
            >
              Email: leon@goodblokessociety.com.au
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
