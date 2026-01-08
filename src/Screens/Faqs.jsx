import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import tw from "tailwind-react-native-classnames";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FAQS = [
  {
    category: "Membership & Business Listings",
    data: [
      {
        q: "I am a Social & Wellbeing Member, why can't I list my business?",
        a: 'To list your business and access the Business Directory, you need to upgrade to one of our Business Membership levels. Visit the "Upgrade Membership" section in the app to explore Business Member, Business Executive Member, and Chairman\'s Partner options, each offering different levels of business promotion and networking opportunities.',
      },
    ],
  },
  {
    category: "Membership Upgrades",
    data: [
      {
        q: "If I upgrade before my current membership expires, will I receive a refund for the remaining months?",
        a: "Yes, you will receive a pro-rata credit for your remaining membership period. Please contact us through the app's Contact section, and we'll calculate the difference and apply it to your upgraded membership.",
      },
    ],
  },
  {
    category: "Chat Groups",
    data: [
      {
        q: "Can I join some chat groups and not others?",
        a: "Absolutely! You have complete control over which chat groups you join. Simply select the groups that align with your interests—whether that's Business, Social activities like Golf or Wine Club, Wellbeing or your state-based group.",
      },
    ],
  },
  {
    category: "Payment Security",
    data: [
      {
        q: "Are my payment details secure when paying through the app?",
        a: "Yes, your security is our priority. We use industry-leading, PCI-compliant payment gateways such as Stripe to ensure all transactions are encrypted and your payment information is never stored on our servers.",
      },
    ],
  },
  {
    category: "Event Ticket Refunds",
    data: [
      {
        q: "I've purchased a ticket to an event but can't attend. Can I get a refund?",
        a: "Yes, refunds are available provided you notify us before the day of the event. Please submit your refund request through the Contact section as soon as possible. Same-day cancellations cannot be refunded due to catering and venue commitments.",
      },
    ],
  },
  {
    category: "Membership & Access",
    data: [
      {
        q: "What's the difference between Business Member and Business Executive Member?",
        a: "Business Executive Members receive premium placement in the Business Directory, priority event registration, additional guest passes and enhanced networking opportunities. Visit the Membership Levels section for a detailed comparison.",
      },
      {
        q: "Can I attend events in other states?",
        a: "Yes! As a GBS member, you're welcome to attend events in any state. Simply filter the Events page by location and register for events that interest you across VIC, NSW, QLD and SA.",
      },
      {
        q: "How do I bring a guest to an event?",
        a: "Guest passes are available based on your membership level. Business Members receive one guest pass annually, while Business Executive and Chairman's Partners receive additional passes. You can also purchase tickets for guests during event booking.",
      },
    ],
  },
  {
    category: "App Functionality",
    data: [
      {
        q: "How do I update my profile information?",
        a: 'Navigate to "My Profile" from the side menu, select "Edit Profile," and update your details including contact information, business details, profile photo and professional links. Changes are saved automatically.',
      },
      {
        q: "I'm not receiving chat notifications. What should I do?",
        a: "Check your app notification settings: Go to your device Settings > Notifications > GBS App and ensure notifications are enabled. Within the app, you can also customise which chat groups send you notifications under Settings > Notification Preferences.",
      },
      {
        q: "Can I search for specific members in the directory?",
        a: "Yes, the Member Directory includes search functionality. You can search by name, business, industry or location.",
      },
    ],
  },
  {
    category: "Events & Bookings",
    data: [
      {
        q: "How will I receive my event tickets?",
        a: "You won’t receive an event ticket; once you purchase a ticket you will receive an email notification and when attending an event we will have an attendee register listing Members and Guests or your host name.",
      },
      {
        q: "Can I transfer my event ticket to another member?",
        a: "Yes, contact us through the app's Contact section with the event details and the member's name you'd like to transfer the ticket to. Transfers must be completed at least 48 hours before the event.",
      },
      {
        q: "When do new events get posted?",
        a: "Events are posted regularly throughout the month. Enable push notifications for event announcements to be the first to know about upcoming experiences.",
      },
    ],
  },
  {
    category: "Business & Offers",
    data: [
      {
        q: "How do I add a special offer for GBS members?",
        a: 'Business Members can submit offers through the "My Business" section. Navigate to "Create Offer," fill in the offer details, terms, and expiry date. All offers are reviewed within 24 hours before being published to the membership.',
      },
      {
        q: "How do I redeem a member offer?",
        a: "Each offer includes specific redemption instructions. Contact details for each offer are provided in the offer description.",
      },
      {
        q: "Can I promote multiple businesses under one membership?",
        a: "Each membership covers one primary business listing. If you operate multiple businesses, please contact us to discuss options for additional listings or upgrading to a Chairman's Partner membership which includes enhanced promotional opportunities.",
      },
    ],
  },
  {
    category: "Technical Support",
    data: [
      {
        q: "I forgot my password. How do I reset it?",
        a: "On the sign-in screen, select \"Forgot Password\" and enter your registered email address. You'll receive a password reset link within minutes. If you don't receive the email, check your spam folder or contact support.",
      },
      {
        q: "The app isn't loading properly. What should I do?",
        a: "First, try closing and reopening the app. If issues persist, check that you're running the latest version in your app store. Still having trouble? Contact us through leon@goodblokessociety.com.au with your device type and a description of the issue.",
      },
      {
        q: "Can I use the app on multiple devices?",
        a: "Yes, simply sign in with your credentials on any device. Your profile and preferences will sync automatically across all devices.",
      },
    ],
  },
  {
    category: "Wellbeing & Chat Groups",
    data: [
      {
        q: "Are the Wellbeing chat discussions confidential?",
        a: "While we encourage open and supportive conversations, please remember that chat groups include multiple members. For confidential support or sensitive topics, we recommend contacting GBS on 1300 07 12 15 or use the private resources in the Wellbeing section or contacting our recommended professional services.",
      },
      {
        q: "Can I leave a chat group if it's not relevant to me?",
        a: "Yes, you can leave any chat group at any time through the Chat Settings menu. You're also welcome to rejoin groups whenever you choose.",
      },
    ],
  },
];

const FAQItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.95}
      style={tw`bg-white rounded-2xl mb-4 shadow-lg overflow-hidden border border-gray-200`}
    >
      <View style={tw`flex-row justify-between items-center p-5`}>
        <View style={tw`flex-row items-center flex-1 mr-4`}>
          <MaterialIcons name="help-outline" size={28} color="#e53935" />
          <Text style={tw`text-lg font-semibold text-gray-900 ml-3 flex-1`}>
            {item.q}
          </Text>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={26}
          color="#e53935"
        />
      </View>

      {open && (
        <View style={tw`px-5 pb-5 pt-2 border-t border-gray-100`}>
          <Text style={tw`text-base text-gray-700 leading-7`}>{item.a}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function FAQScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const filteredFAQS = FAQS.map((section) => ({
    ...section,
    data: section.data.filter(
      (f) =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.data.length > 0);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-1`}>
        {/* Premium Header */}
        <View style={tw`bg-red-600 px-5 pt-4 pb-8`}>
          <View style={tw`flex-row items-center justify-between`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={tw`text-3xl font-extrabold text-white`}>FAQs</Text>
            <View style={{ width: 28 }} />
          </View>
          <Text style={tw`text-lg text-white text-center mt-2 opacity-90`}>
            Find answers to common questions
          </Text>
        </View>

        {/* FAQ List */}
        <FlatList
          data={filteredFAQS}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={tw`px-5 pb-8`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={tw`items-center mt-20`}>
              <MaterialIcons name="search-off" size={80} color="#ccc" />
              <Text style={tw`text-xl text-gray-500 mt-4`}>
                No FAQs found for your search
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                <View
                  style={tw`w-10 h-10 bg-red-100 rounded-full items-center justify-center`}
                >
                  <MaterialIcons name="category" size={24} color="#e53935" />
                </View>
                <Text style={tw`text-lg font-bold text-gray-900 ml-3`}>
                  {item.category}
                </Text>
              </View>

              {item.data.map((faq, index) => (
                <FAQItem key={index} item={faq} />
              ))}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
