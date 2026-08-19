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
    link: "https://brunswickaces.com/products/gbs-london-dry-gin",
    image: require("../../assets/news1.jpeg"),
  },
  {
    id: "2",
    heading: "INTRODUCING GBS ALLIANCE MEMBERSHIP",
    title: "A Truly Elevated GBS Business Experience",
    detail:
      "Accelerate your business relationships by design with the Good Blokes Society Alliance—a premium networking program for ambitious business owners, C-suite executives, general managers, and emerging leaders who are committed to growth and making a broader impact within the GBS community.\n\nThe Alliance Difference: This isn't just networking—it's a structured workshop forum where a united power group of like-minded members from diverse industries commit to 7 half-day sessions per year (Feb-Dec). Meet with the same trusted group to share ideas, resources, learning, and growth strategies while tackling challenges and unlocking opportunities together.\n\nWhat's Included:\n• 7 Half-Day Sessions (7:30 AM – 12:00 PM) at premium venues with limited members for focused collaboration\n• Guest Speakers at 4 of 7 sessions covering AI, HR, Marketing, Budgeting, Leadership, and more\n• Mid-Year & End-of-Year Signature Dinners to connect, celebrate, and support all Alliance members\n• Premium Hospitality including breakfast and barista coffee throughout each session\n• Exclusive Benefits: Access to the national GBS business network, masterclasses, HR/Marketing/Finance support, member offers, and a business promotional video\n\nInvestment: $7,500  include GST per year\n\nContact Leon Davies: 0448 931 555 | leon@goodblokessociety.com.au",
    link: null,
    image: require("../../assets/wellbeing4.png"),
  },
  {
    id: "3",
    heading: "Run The Tan — Sunday 26th April",
    title:
      "The Tan to support Run For Mental Health —a cause at the heart of what we stand for—and we'd love you to be part of it.",
    detail: `
RUN THE TAN – SUNDAY 27TH APRIL 2026

Supporting Run For Mental Health

The Good Blokes Society is entering a team in Run The Tan — Melbourne's iconic charity run around the famous Tan Track — in support of Run For Mental Health Ltd, a cause that sits right at the heart of what GBS stands for.

WE NEED YOUR HELP

• Members to join the GBS team  
• Fundraising Target: $5,000  
• Date: Sunday, 27th April 2026  
• Location: The Tan, Melbourne  

HOW TO GET INVOLVED

1. Join the GBS Team  
   Walk or run The Tan with us on the day.

2. Make a Donation  
   Can't make it? Support the cause with a donation.

3. Create Your Own Team  
   Business owners: get your staff involved and nominate Run For Mental Health as your charity.

ABOUT RUN THE TAN

Run The Tan promotes healthy, active lifestyles while raising awareness and funds for mental health initiatives.
`,
    link: " https://runthetan26.grassrootz.com/run-for-mental-health/good-blokes-society",
    image: require("../../assets/news3.png"),
  },

  // {
  //   id: "4",
  //   heading: "SUPPORTING CRI DU CHAT — April 17th, Club Sunbury",
  //   title:
  //     "Our National Partners, Direct Couriers, led by Garry Yovich and Mick O'Dwyer, are hosting their annual charity fundraising day in support of Cri Du Chat Australasia — and the GBS will be entering a team!",
  //   detail:
  //     "Cri Du Chat is a rare genetic disorder affecting 1 in 50,000 births, and Cri Du Chat Australasia is a not-for-profit charity providing information, friendship, and support to families and friends of those affected The event is a fantastic day of lunch, drinks, prizes, and barefoot bowls at Club Sunbury on Friday April 17th from 10am–4pm. Entry options include team entries, individual players, and a range of sponsorship packages. We encourage all GBS members to support this wonderful cause — whether by entering a team, taking out a sponsorship, or making a donation. Every contribution makes a difference For further information, follow the link to the document or contact Mick O'Dwyer on 0423 331 730.",
  //   link: "https://goodblokessociety.com.au/wp-content/uploads/2026/03/Cri-Du-Chat-Fundraiser-2026-Final.pdf",
  //   image: require("../../assets/news4.png"),
  // },
  {
    id: "5",
    heading: "GBS Newsletter",
    title: "JUNE EDITION 2026",
    detail: `THE GOOD BLOKES SOCIETY | JUNE EDITION 2026

WELCOME TO JUNE
Thank you all for participating in recent events and bringing great value to the community.

UPCOMING EVENTS

Business & Wine Connect Lunch – Friday, 5th June
Hosted by George Samios at The Wine Room, Marvel Stadium. Premium wine presentation with 2-course lunch & drinks. $225pp

Signature Series: Ben Cousins & Andrew "Joey" Johns – Tuesday, 16th June
At Goldfields House Beverly Rooftop. Two legends in conversation. 6:00pm-10:00pm. $450pp (4-course sharing menu & premium beverages)

National Business Summit – Wednesday, 16th July
RACV Club Melbourne. Full day featuring keynote speakers, four specialist panel discussions, networking lunch, member workshops, and post-event cocktails at The George on Collins. 8:00am-7:30pm.

Panel Topics: Business Growth & Strategy | Leadership & Personal Development | Future of Business & Innovation | Wellbeing & High Performance

Tickets: Event Partner $2,750 | Business Partner $1,650 | Member $625

Grange Wine Lunch – Thursday, 17th July
At The George on Collins. Cap off the National Business Summit week with fine wines and exceptional food.

RECENT HIGHLIGHTS

GBS Masters 2026 – Congratulations to winners Peter Bradford and Damian Higgins!
Brisbane & Sydney Business Summits – Building incredible relationships and collaboration across the country.
Trades, Construction, Property & Transport Lunch – Outstanding hospitality and new member connections.

FEATURED: THE GBS APP IS HERE
Download now from the Apple Store. Android coming soon! Log in with your email address and mobile number as password.

MENTAL HEALTH & COMMUNITY SUPPORT
Watch for warning signs: persistent low mood, anxiety, sleep problems, withdrawing from people. Reach out to support services or talk to your GP.

Support Numbers:
• Lifeline: 13 11 14 (24/7)
• Beyond Blue: 1300 22 4636
• MensLine Australia: 1300 78 99 78

Remember: Real mateship means showing up. Asking for help isn't weakness.
`,
    link: "https://mailchi.mp/goodblokessociety.com.au/gbsnewsletter-june030626-18101348",
    image: require("../../assets/news5.png"),
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

        {news.title && (
          <Text style={tw`text-xl font-bold mb-3`}>{news.title}</Text>
        )}

        <Text
          style={tw`text-base text-gray-700 leading-6 mb-6 whitespace-pre-line`}
        >
          {news.detail}
        </Text>

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

        {newsId === "5" && (
          <View style={tw`bg-gray-100 p-4 rounded-lg`}>
            <Text style={tw`font-bold text-lg mb-2`}>
              Contact for GBS Newsletter
            </Text>
            <Text
              style={tw`text-blue-600`}
              onPress={() => Linking.openURL("tel:0448931555")}
            >
              Phone: 1300 07 12 15
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
