import React, { useState, useRef, useEffect } from "react";
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
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  Users,
  Shield,
  Calendar,
  Smartphone,
  Briefcase,
  Settings,
  Heart,
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ---------------- FAQ DATA ---------------- */
const FAQS = [
  {
    category: "Membership & Business Listings",
    icon: Users,
    color: "#6366f1",
    data: [
      {
        q: "I am a Social & Wellbeing Member, why can't I list my business?",
        a: "To list your business and access the Business Directory, you need to upgrade to a Business Membership. Visit the Upgrade Membership section to explore Business Member, Business Executive Member, or Chairman's Partner options.",
      },
      {
        q: "If I upgrade before my current membership expires, will I receive a refund?",
        a: "Yes, you will receive a pro-rata credit for the remaining membership period. Contact us through the app and we'll apply it to your upgrade.",
      },
    ],
  },
  {
    category: "Chat Group Selection",
    icon: Users,
    color: "#8b5cf6",
    data: [
      {
        q: "Can I join some chat groups and not others?",
        a: "Absolutely! You can select only the chat groups that align with your interests, including Business, Social, Wellbeing, or state-based groups.",
      },
    ],
  },
  {
    category: "Payment Security",
    icon: Shield,
    color: "#10b981",
    data: [
      {
        q: "Are my payment details secure when paying through the app?",
        a: "Yes. We use industry-leading, PCI-compliant payment gateways such as Stripe. All transactions are encrypted and your payment information is never stored on our servers.",
      },
    ],
  },
  {
    category: "Event Ticket Refunds",
    icon: Calendar,
    color: "#f59e0b",
    data: [
      {
        q: "I've purchased a ticket to an event but can't attend. Can I get a refund?",
        a: "Yes, refunds are available if you notify us before the day of the event. Same-day cancellations cannot be refunded due to catering and venue commitments.",
      },
    ],
  },
  {
    category: "Membership & Access",
    icon: BookOpen,
    color: "#3b82f6",
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
    icon: Smartphone,
    color: "#ec4899",
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
    icon: Calendar,
    color: "#ef4444",
    data: [
      {
        q: "How will I receive my event tickets?",
        a: "You will receive an email confirmation. At the event, attendees are checked in via the member and guest register.",
      },
      {
        q: "Can I transfer my event ticket to another member?",
        a: "Yes. Contact us through the app with the event details and the member's name. Transfers must be completed at least 48 hours before the event.",
      },
      {
        q: "When do new events get posted?",
        a: "Events are posted regularly throughout the month. Enable push notifications to stay updated.",
      },
    ],
  },
  {
    category: "Business & Offers",
    icon: Briefcase,
    color: "#14b8a6",
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
        a: "Each membership covers one primary business. Contact us for additional listing options or Chairman's Partner upgrades.",
      },
    ],
  },
  {
    category: "Technical Support",
    icon: Settings,
    color: "#64748b",
    data: [
      {
        q: "I forgot my password. How do I reset it?",
        a: "Tap Forgot Password on the sign-in screen and follow the email instructions.",
      },
      {
        q: "The app isn't loading properly. What should I do?",
        a: "Restart the app and ensure you're on the latest version. If the issue persists, contact leon@goodblokessociety.com.au.",
      },
      {
        q: "Can I use the app on multiple devices?",
        a: "Yes. Sign in on any device and your profile will sync automatically.",
      },
    ],
  },
  {
    category: "Wellbeing & Chat Groups",
    icon: Heart,
    color: "#f97316",
    data: [
      {
        q: "Are the Wellbeing chat discussions confidential?",
        a: "Chat groups include multiple members. For confidential support, contact GBS on 1300 07 12 15 or use professional services.",
      },
      {
        q: "Can I leave a chat group if it's not relevant?",
        a: "Yes, you can leave or rejoin any chat group at any time through Chat Settings.",
      },
    ],
  },
];

/* ---------------- ANIMATED FAQ ITEM ---------------- */
const FAQItem = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: open ? 0 : 1,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: open ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: open ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setOpen(!open);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const answerHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust based on content
  });

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.9}
      style={{
        transform: [{ scale: open ? 1.02 : 1 }],
      }}
      className="mb-4"
    >
      <LinearGradient
        colors={
          open
            ? ["rgba(99, 102, 241, 0.1)", "rgba(79, 70, 229, 0.05)"]
            : ["white", "white"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl overflow-hidden border border-gray-100"
        style={{
          shadowColor: open ? "#6366f1" : "#000",
          shadowOffset: { width: 0, height: open ? 8 : 4 },
          shadowOpacity: open ? 0.2 : 0.08,
          shadowRadius: open ? 16 : 12,
          elevation: open ? 12 : 6,
        }}
      >
        <View className="flex-row items-center p-6">
          <View
            className="w-12 h-12 rounded-2xl mr-4 items-center justify-center"
            style={{ backgroundColor: open ? item.color : `${item.color}20` }}
          >
            <item.icon size={24} color={open ? "white" : item.color} />
          </View>

          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">
              {item.q}
            </Text>
            <Text className="text-sm text-gray-500">{item.category}</Text>
          </View>

          <Animated.View style={{ transform: [{ rotate }] }}>
            <ChevronDown size={24} color="#6b7280" />
          </Animated.View>
        </View>

        <Animated.View style={{ maxHeight: answerHeight, overflow: "hidden" }}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
            className="px-6 pb-6"
          >
            <View className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
            <Text className="text-base text-gray-600 leading-7">{item.a}</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

/* ---------------- CATEGORY FILTER CHIPS ---------------- */
const CategoryChip = ({ category, icon: Icon, color, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
        className={`px-4 py-3 rounded-full mr-3 flex-row items-center ${
          isSelected ? "border-2" : "border"
        }`}
        style={{
          backgroundColor: isSelected ? `${color}15` : "white",
          borderColor: isSelected ? color : "#e5e7eb",
        }}
      >
        <Icon
          size={18}
          color={isSelected ? color : "#9ca3af"}
          className="mr-2"
        />
        <Text
          className="text-sm font-medium"
          style={{ color: isSelected ? color : "#6b7280" }}
        >
          {category}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ---------------- MAIN SCREEN ---------------- */
export default function FAQScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedCategories, setExpandedCategories] = useState({});
  const searchOpacity = useRef(new Animated.Value(1)).current;
  const headerScale = useRef(new Animated.Value(1)).current;

  const categories = [
    { label: "All", icon: HelpCircle, color: "#6366f1" },
    ...FAQS.map((f) => ({
      label: f.category,
      icon: f.icon,
      color: f.color,
    })),
  ];

  const toggleCategory = (category) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredFAQS = FAQS.filter(
    (section) =>
      selectedCategory === "All" || section.category === selectedCategory
  )
    .map((section) => ({
      ...section,
      data: section.data.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.data.length > 0);

  useEffect(() => {
    // Header animation on scroll
    Animated.timing(headerScale, {
      toValue: search ? 0.95 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [search]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        <LinearGradient
          colors={["#6366f1", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-12 pb-6 px-5 rounded-b-3xl"
          style={{
            shadowColor: "#6366f1",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          <Animated.View style={{ transform: [{ scale: headerScale }] }}>
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mr-3">
                <HelpCircle size={28} color="white" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-white">
                  Help Center
                </Text>
                <Text className="text-white/80">Find answers quickly</Text>
              </View>
            </View>

            <View className="relative">
              <View className="absolute left-4 top-4 z-10">
                <Search size={22} color="#9ca3af" />
              </View>
              <TextInput
                placeholder="Search questions..."
                value={search}
                onChangeText={setSearch}
                className="bg-white/95 rounded-2xl px-12 py-4 text-base"
                placeholderTextColor="#9ca3af"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 15,
                  elevation: 10,
                }}
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  className="absolute right-4 top-4"
                >
                  <Text className="text-indigo-600 font-bold">Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </LinearGradient>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Categories Filter */}
          <View className="py-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Browse by Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pb-2"
            >
              {categories.map((cat, index) => (
                <CategoryChip
                  key={index}
                  category={cat.label}
                  icon={cat.icon}
                  color={cat.color}
                  isSelected={selectedCategory === cat.label}
                  onPress={() => setSelectedCategory(cat.label)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Results */}
          {filteredFAQS.length === 0 ? (
            <View className="items-center justify-center py-16">
              <View className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 items-center justify-center mb-6">
                <Search size={48} color="#8b5cf6" />
              </View>
              <Text className="text-2xl font-bold text-gray-700 mb-2">
                No results found
              </Text>
              <Text className="text-gray-500 text-center">
                Try searching with different keywords or browse categories
              </Text>
            </View>
          ) : (
            <View>
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">
                  {search ? "Search Results" : "Popular Questions"}
                </Text>
                <Text className="text-gray-500">
                  {filteredFAQS.reduce(
                    (acc, section) => acc + section.data.length,
                    0
                  )}{" "}
                  questions
                </Text>
              </View>

              {filteredFAQS.map((section, sectionIndex) => (
                <View key={sectionIndex} className="mb-8">
                  <TouchableOpacity
                    onPress={() => toggleCategory(section.category)}
                    className="flex-row justify-between items-center mb-4 p-3 bg-white rounded-xl border border-gray-100"
                    activeOpacity={0.7}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-10 h-10 rounded-xl mr-3 items-center justify-center"
                        style={{ backgroundColor: `${section.color}15` }}
                      >
                        <section.icon size={20} color={section.color} />
                      </View>
                      <View>
                        <Text className="text-lg font-bold text-gray-800">
                          {section.category}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {section.data.length} questions
                        </Text>
                      </View>
                    </View>
                    <ChevronDown
                      size={20}
                      color="#6b7280"
                      style={{
                        transform: [
                          {
                            rotate: expandedCategories[section.category]
                              ? "180deg"
                              : "0deg",
                          },
                        ],
                      }}
                    />
                  </TouchableOpacity>

                  {(expandedCategories[section.category] ||
                    selectedCategory !== "All") && (
                    <Animated.View entering={FadeInUp.duration(500)}>
                      {section.data.map((faq, index) => (
                        <FAQItem
                          key={index}
                          item={{
                            ...faq,
                            category: section.category,
                            color: section.color,
                          }}
                          index={index}
                        />
                      ))}
                    </Animated.View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Contact Support CTA */}
          <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-3xl p-6 mt-4"
            style={{
              shadowColor: "#6366f1",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 15,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center mr-4">
                <HelpCircle size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-white">
                  Still need help?
                </Text>
                <Text className="text-white/90">
                  Our support team is here for you
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-white rounded-2xl py-4 items-center"
              activeOpacity={0.9}
              onPress={() => {
                /* Navigate to contact */
              }}
            >
              <Text className="text-indigo-600 font-bold text-lg">
                Contact Support
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
