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
  ScrollView,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ---------------- FAQ DATA ---------------- */

const FAQS = [
  {
    category: "Membership & Business Listings",
    data: [
      {
        q: "I am a Social & Wellbeing Member, why can't I list my business?",
        a: "To list your business and access the Business Directory, you need to upgrade to a Business Membership. Visit the Upgrade Membership section to explore Business Member, Business Executive Member, or Chairman's Partner options.",
      },
      {
        q: "If I upgrade before my current membership expires, will I receive a refund?",
        a: "Yes, you will receive a pro-rata credit for the remaining membership period. Contact us through the app and we’ll apply it to your upgrade.",
      },
    ],
  },
  {
    category: "Chat Group Selection",
    data: [
      {
        q: "Can I join some chat groups and not others?",
        a: "Absolutely! You can select only the chat groups that align with your interests, including Business, Social, Wellbeing, or state-based groups.",
      },
    ],
  },
  {
    category: "Payment Security",
    data: [
      {
        q: "Are my payment details secure when paying through the app?",
        a: "Yes. We use industry-leading, PCI-compliant payment gateways such as Stripe. All transactions are encrypted and your payment information is never stored on our servers.",
      },
    ],
  },
  {
    category: "Event Ticket Refunds",
    data: [
      {
        q: "I've purchased a ticket to an event but can't attend. Can I get a refund?",
        a: "Yes, refunds are available if you notify us before the day of the event. Same-day cancellations cannot be refunded due to catering and venue commitments.",
      },
    ],
  },
  {
    category: "Membership & Access",
    data: [
      {
        q: "What's the difference between Business Member and Business Executive Member?",
        a: "Business Executive Members receive premium directory placement, priority event registration, additional guest passes, and enhanced networking opportunities.",
      },
      {
        q: "Can I attend events in other states?",
        a: "Yes! GBS members can attend events in any state including VIC, NSW, QLD, and SA.",
      },
      {
        q: "How do I bring a guest to an event?",
        a: "Guest passes depend on your membership level. You can also purchase guest tickets during event booking.",
      },
    ],
  },
  {
    category: "App Functionality",
    data: [
      {
        q: "How do I update my profile information?",
        a: "Go to My Profile from the side menu, tap Edit Profile, and update your details. Changes are saved automatically.",
      },
      {
        q: "I'm not receiving chat notifications. What should I do?",
        a: "Check your device notification settings and ensure notifications are enabled for the GBS app. You can also customise notification preferences within the app.",
      },
      {
        q: "Can I search for specific members in the directory?",
        a: "Yes. You can search by name, business, industry, or location using the Member Directory search.",
      },
    ],
  },
  {
    category: "Events & Bookings",
    data: [
      {
        q: "How will I receive my event tickets?",
        a: "You will receive an email confirmation. At the event, attendees are checked in via the member and guest register.",
      },
      {
        q: "Can I transfer my event ticket to another member?",
        a: "Yes. Contact us through the app with the event details and the member’s name. Transfers must be completed at least 48 hours before the event.",
      },
      {
        q: "When do new events get posted?",
        a: "Events are posted regularly throughout the month. Enable push notifications to stay updated.",
      },
    ],
  },
  {
    category: "Business & Offers",
    data: [
      {
        q: "How do I add a special offer for GBS members?",
        a: "Business Members can submit offers through the My Business section. All offers are reviewed within 24 hours.",
      },
      {
        q: "How do I redeem a member offer?",
        a: "Each offer includes specific redemption instructions and contact details.",
      },
      {
        q: "Can I promote multiple businesses under one membership?",
        a: "Each membership covers one primary business. Contact us for additional listing options or Chairman’s Partner upgrades.",
      },
    ],
  },
  {
    category: "Technical Support",
    data: [
      {
        q: "I forgot my password. How do I reset it?",
        a: "Tap Forgot Password on the sign-in screen and follow the email instructions.",
      },
      {
        q: "The app isn't loading properly. What should I do?",
        a: "Restart the app and ensure you’re on the latest version. If the issue persists, contact leon@goodblokessociety.com.au.",
      },
      {
        q: "Can I use the app on multiple devices?",
        a: "Yes. Sign in on any device and your profile will sync automatically.",
      },
    ],
  },
  {
    category: "Wellbeing & Chat Groups",
    data: [
      {
        q: "Are the Wellbeing chat discussions confidential?",
        a: "Chat groups include multiple members. For confidential support, contact GBS on 1300 07 12 15 or use professional services.",
      },
      {
        q: "Can I leave a chat group if it’s not relevant?",
        a: "Yes, you can leave or rejoin any chat group at any time through Chat Settings.",
      },
    ],
  },
];

/* ---------------- FAQ ITEM ---------------- */

const FAQItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.8}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-gray-900 flex-1 pr-3">
          {item.q}
        </Text>
        <Text className="text-2xl text-gray-500">{open ? "−" : "+"}</Text>
      </View>

      {open && (
        <Text className="text-gray-600 text-sm leading-6 mt-3">{item.a}</Text>
      )}
    </TouchableOpacity>
  );
};

/* ---------------- SCREEN ---------------- */

export default function FAQScreen() {
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
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      <Text className="text-3xl font-bold text-gray-900 mb-4">FAQs</Text>

      <TextInput
        placeholder="Search FAQs..."
        value={search}
        onChangeText={setSearch}
        className="bg-white rounded-xl px-4 py-3 text-base mb-5 shadow-sm"
      />

      <FlatList
        data={filteredFAQS}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2 mt-4">
              {item.category}
            </Text>

            {item.data.map((faq, index) => (
              <FAQItem key={index} item={faq} />
            ))}
          </View>
        )}
      />
    </View>
  );
}
