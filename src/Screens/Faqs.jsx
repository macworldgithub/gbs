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
  // Your FAQS data array remains exactly the same
  {
    category: "Membership & Business Listings",
    data: [
      {
        q: "I am a Social & Wellbeing Member, why can't I list my business?",
        a: "To list your business and access the Business Directory, you need to upgrade to a Business Membership. Visit the Upgrade Membership section to explore Business Member, Business Executive Member, or Alliance options.",
      },
      {
        q: "If I upgrade before my current membership expires, will I receive a refund?",
        a: "Yes, you will receive a pro-rata credit for the remaining membership period. Contact us through the app and we’ll apply it to your upgrade.",
      },
    ],
  },
  // ... (all other categories unchanged)
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
                <Text style={tw`text-xl font-bold text-gray-900 ml-3`}>
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
