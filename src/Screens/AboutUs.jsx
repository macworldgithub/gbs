import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
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
  const handleEmailPress = () => {
    Linking.openURL("mailto:support@gbsapp.com");
  };

  const handleCallPress = () => {
    Linking.openURL("tel:1234567890");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={tw`bg-white shadow-sm`}>
          <View style={tw`p-5`}>
            <Text
              style={tw`text-2xl font-bold text-center text-white bg-red-500 p-3 rounded-lg`}
            >
              About GBS
            </Text>
            <Text style={tw`text-center text-gray-500 mt-2`}>
              Connecting Communities, Empowering Businesses
            </Text>
          </View>
        </View> */}
        <View style={tw`flex-row items-center bg-red-500 px-4 py-3`}>
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity> */}
          <Text style={tw`text-white text-lg font-bold ml-28`}>About Us</Text>
        </View>

        <View style={tw`p-5`}>
          <View style={tw`bg-white rounded-xl shadow-sm p-5 mb-5`}>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>
              Welcome to GBS
            </Text>
            <Text style={tw`text-gray-600 leading-6`}>
              Your premier destination for connecting with local businesses and
              discovering exciting events in your community. We're dedicated to
              creating meaningful connections that benefit everyone.
            </Text>
          </View>

          <CollapsibleSection title="Our Story" isFirst={true}>
            <Text style={tw`text-gray-600 leading-6`}>
              Founded with a vision to bridge the gap between local businesses
              and their communities, GBS has grown into a platform that empowers
              both businesses and customers to connect in meaningful ways.
            </Text>
          </CollapsibleSection>

          <CollapsibleSection title="Our Vision">
            <Text style={tw`text-gray-600 leading-6`}>
              We envision a world where local businesses thrive and communities
              grow stronger through meaningful interactions and shared
              experiences. Our platform is designed to make these connections
              seamless and rewarding for everyone involved.
            </Text>
          </CollapsibleSection>

          <CollapsibleSection title="What We Offer">
            <View style={tw`mt-2`}>
              <FeatureCard
                icon="business"
                title="Local Business Discovery"
                description="Find and connect with trusted local businesses in your area."
              />
              <FeatureCard
                icon="calendar"
                title="Event Management"
                description="Stay updated with upcoming events and never miss what's happening around you."
              />
              <FeatureCard
                icon="people"
                title="Community Building"
                description="Connect with like-minded individuals and grow your network."
              />
              <FeatureCard
                icon="pricetag"
                title="Exclusive Deals"
                description="Access special offers and discounts from local businesses."
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
              text="627 Chapel St, 
South Yarra, VIC, 3141"
              onPress={() => {}}
              color="purple"
            />

            {/* <View style={tw`mt-4 flex-row justify-center space-x-4`}>
              <TouchableOpacity style={tw`bg-blue-100 p-3 rounded-full`}>
                <Ionicons name="logo-facebook" size={24} color="#3B5998" />
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-blue-100 p-3 rounded-full`}>
                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-blue-100 p-3 rounded-full`}>
                <Ionicons name="logo-instagram" size={24} color="#E1306C" />
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-blue-100 p-3 rounded-full`}>
                <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
              </TouchableOpacity>
            </View> */}
          </CollapsibleSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;
