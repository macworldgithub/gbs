import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const CollapsibleSection = ({ title, children, isFirst = false }) => {
  const [isExpanded, setIsExpanded] = useState(isFirst);
  const spinValue = useState(new Animated.Value(0))[0];

  const toggleSection = () => {
    Animated.timing(spinValue, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={tw`mb-4 border-b border-gray-100 pb-2`}>
      <TouchableOpacity
        onPress={toggleSection}
        style={tw`flex-row justify-between items-center py-3`}
        activeOpacity={0.7}
      >
        <Text style={tw`text-lg font-bold text-gray-800`}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={20} color="#4B5563" />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View
          style={[
            tw`overflow-hidden`,
            {
              opacity: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateY: spinValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={tw`pb-3`}>{children}</View>
        </Animated.View>
      )}
    </View>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <View
    style={tw`bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100`}
  >
    <View style={tw`flex-row items-center mb-2`}>
      <View style={tw`bg-blue-100 p-2 rounded-full mr-3`}>
        <Ionicons name={icon} size={20} color="#3B82F6" />
      </View>
      <Text style={tw`font-semibold text-gray-800`}>{title}</Text>
    </View>
    <Text style={tw`text-gray-600 text-sm pl-11`}>{description}</Text>
  </View>
);

const ContactButton = ({ icon, text, onPress, color = "blue" }) => (
  <TouchableOpacity
    onPress={onPress}
    style={tw`flex-row items-center p-3 bg-${color}-50 rounded-lg mb-2`}
    activeOpacity={0.7}
  >
    <Ionicons
      name={icon}
      size={20}
      color={tw.color(`${color}-500`)}
      style={tw`mr-3`}
    />
    <Text style={tw`text-${color}-700`}>{text}</Text>
  </TouchableOpacity>
);

const AboutUs = () => {
  // ✅ Add this line
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL("mailto:concierge@goodblokessociety.com.au");
  };

  const handleCallPress = () => {
    Linking.openURL("tel:1300071215");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`flex-row items-center bg-red-500 px-4 py-3`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}
          >
            <MaterialIcons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-white text-lg font-bold ml-20`}>About Us</Text>
        </View>

        <View style={tw`p-5`}>
          <View style={tw`bg-white rounded-xl shadow-sm p-5 mb-5`}>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>
              Welcome to GBS
            </Text>
            <Text style={tw`text-gray-600 leading-6`}>
              Welcome to the Good Blokes Society - a thriving community of
              like-minded people built on three core pillars: Business, Social &
              Wellbeing. We believe in the power of authentic connections,
              whether in business, friendship, or supporting each other's
              wellbeing. Join us for exclusive social events and be part of a
              community that celebrates camaraderie, supports ambition and
              champions physical & mental health.
            </Text>
          </View>

          <CollapsibleSection title="Our Story">
            <Text style={tw`text-gray-600 leading-6`}>
              In 2014, Shaun Wallis, Steve Heavey, and Robert Dipierdomenico
              started what began as casual Friday lunches. It grew into the Good
              Blokes Society - a community rooted in authentic camaraderie and
              meaningful connections. Today, our three pillars - Business,
              Social, and Wellbeing - define everything we do and create a
              sanctuary where people can network, have fun and support each
              other.
            </Text>
          </CollapsibleSection>

          <CollapsibleSection title="Our Vision">
            <Text style={tw`text-gray-600 leading-6`}>
              We're building a community that enhances both personal and
              professional life. Our three pillars - Business, Social, and
              Wellbeing - create a balanced approach where success, friendship
              and mental health go hand in hand.
            </Text>
          </CollapsibleSection>

          <CollapsibleSection title="What We Offer">
            <View style={tw`mt-2`}>
              <FeatureCard
                icon="business"
                title="Business"
                description="Create professional relationships that matter. Network, collaborate and build 
partnerships through our intimate business lunches and large-scale events."
              />
              <FeatureCard
                icon="calendar"
                title="Social"
                description="Build authentic friendships with like-minded members. Share a meal, play golf, enjoy 
the footy or races - celebrate the camaraderie that defines Good Blokes."
              />
              <FeatureCard
                icon="people"
                title="Wellbeing"
                description="We're committed to championing men's physical & mental health. Connect, learn and 
share openly as we support each other's wellbeing journeys."
              />
              <FeatureCard
                icon="pricetag"
                title="Exclusive Offers"
                description="Access special offers and discounts from fellow GBS Members."
              />
            </View>
          </CollapsibleSection>

          <CollapsibleSection title="Get In Touch">
            <Text style={tw`text-gray-600 mb-4 leading-6`}>
              Have questions or feedback? We'd love to hear from you! Reach out
              through any of the following channels:
            </Text>

            <ContactButton
              icon="mail"
              text="concierge@goodblokessociety.com.au"
              onPress={handleEmailPress}
              color="blue"
            />
            <ContactButton
              icon="call"
              text="1300 07 12 15"
              onPress={handleCallPress}
              color="green"
            />
            <ContactButton
              icon="location"
              text="627 Chapel St, South Yarra, VIC, 3141"
              onPress={() => {}}
              color="purple"
            />
          </CollapsibleSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;
