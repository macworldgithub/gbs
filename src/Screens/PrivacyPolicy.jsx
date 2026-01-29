import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
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

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link: ", err)
    );
  };

  const SectionHeader = ({ number, title }) => {
    const isExpanded = expandedSections[number];
    return (
      <TouchableOpacity
        onPress={() => toggleSection(number)}
        style={tw`flex-row items-center justify-between bg-gray-50 rounded-2xl px-6 py-5 mb-4 shadow-md border border-gray-100`}
        activeOpacity={0.9}
      >
        <View style={tw`flex-row items-center flex-1`}>
          <View
            style={tw`w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-6`}
          >
            <Text style={tw`text-2xl font-extrabold text-red-600`}>
              {number}
            </Text>
          </View>
          <Text style={tw`text-sm font-semibold text-gray-900 flex-1 mr-6`}>
            {title}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={28}
          color="#e53935"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-1`}>
        {/* Header matching the screenshot exactly */}
        <View style={tw`bg-red-600 px-5 pt-12 pb-10`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`absolute top-12 left-5 z-10`}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-extrabold text-white text-center`}>
            PRIVACY POLICY
          </Text>
          <Text style={tw`text-xl font-bold text-white text-center mt-4`}>
            GOOD BLOKES SOCIETY APP
          </Text>
          <Text style={tw`text-md text-white text-center mt-4 opacity-90`}>
            Last Updated: January 2026
          </Text>
        </View>

        <ScrollView
          style={tw`flex-1 px-5 pt-6 pb-12`}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. INTRODUCTION */}
          <SectionHeader number="1" title="INTRODUCTION" />
          {expandedSections["1"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100  `}
            >
              <Text style={tw`text-base text-gray-700 leading-7 mb-4`}>
                Good Blokes Society ("GBS," "we," "us," or "our") is committed
                to protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose and safeguard your personal information
                when you use the GBS mobile application ("the App").
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                This Privacy Policy complies with the Privacy Act 1988 (Cth) and
                the Australian Privacy Principles (APPs).
              </Text>
            </View>
          )}

          {/* 2. INFORMATION WE COLLECT */}
          <SectionHeader number="2" title="INFORMATION WE COLLECT" />
          {expandedSections["2"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-lg font-bold text-red-600 mb-4`}>
                2.1 Information You Provide
              </Text>
              <Text style={tw`text-base text-gray-600 mb-4 leading-7`}>
                When you register for membership and use the App, we collect:
              </Text>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Account Information: Name, email address, phone number, date
                  of birth, location
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Membership Information: Membership tier, payment information,
                  membership status
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Profile Information: Business name (for Business members and
                  above), profession/role, hobbies, biography, profile photo
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Payment Information: Processed securely through PCI DSS Level
                  1 certified third-party payment processors; we do not store
                  complete credit card details
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-6`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  User Content: Posts on the Noticeboard, chat messages, event
                  RSVPs and other content you create within the App
                </Text>
              </View>

              <Text style={tw`text-lg font-bold text-red-600 mb-4`}>
                2.2 Information Collected Automatically
              </Text>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Device Information: Device type, operating system, unique
                  device identifiers
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Usage Data: App features used, pages viewed, time spent on
                  pages, interaction data
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Location Data: General location information (city/state level)
                  if you grant permission
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-6`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Log Data: IP address, access times, app crashes and
                  performance data
                </Text>
              </View>

              <Text style={tw`text-lg font-bold text-red-600 mb-4`}>
                2.3 Information from Third Parties
              </Text>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Payment Processors: Transaction confirmations and payment
                  status
                </Text>
              </View>
              <View style={tw`flex-row items-start mb-3`}>
                <MaterialIcons
                  name="circle"
                  size={10}
                  color="#e53935"
                  style={tw`mt-2`}
                />
                <Text style={tw`text-base text-gray-700 ml-4 flex-1`}>
                  Social Media: If you connect social media accounts, we may
                  receive basic profile information
                </Text>
              </View>
            </View>
          )}

          {/* 3. HOW WE USE YOUR INFORMATION */}
          <SectionHeader number="3" title="HOW WE USE YOUR INFORMATION" />
          {expandedSections["3"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                3.1 Membership Management
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Creating and managing your member account
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Processing membership payments and renewals
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Verifying your membership tier and access privileges
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-6`}>
                • Communicating membership updates and important notices
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                3.2 App Functionality
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Providing access to events, chat groups and exclusive offers
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Displaying member profiles and facilitating networking
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Managing the Noticeboard and member-to-member communications
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-6`}>
                • Personalising your app experience
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                3.3 Communications
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Sending event invitations and updates
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Sharing exclusive offers from GBS members
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Delivering announcements and community news
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                • Responding to your inquiries and support requests
              </Text>
            </View>
          )}

          {/* 4. HOW WE SHARE YOUR INFORMATION */}
          <SectionHeader number="4" title="HOW WE SHARE YOUR INFORMATION" />
          {expandedSections["4"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                4.1 Within the GBS Community
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Member Profiles: Your profile information (as you choose to
                provide it) is visible to other GBS members
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Business Information: Business members and above have their
                business name displayed on their profile
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Chat Groups: Messages in chat groups are visible to all group
                members
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-6`}>
                • Noticeboard Posts: Content posted on the Noticeboard is
                visible to all members
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                4.2 Service Providers
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                We share information with trusted third-party service providers
                who assist us with payment processing, cloud hosting, analytics,
                communications and event management. These providers are
                contractually obligated to protect your information.
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                4.3 Legal Requirements
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                We may disclose your information if required by law, court order
                or government authority or when necessary to comply with legal
                processes, enforce our Terms of Use, protect rights or
                investigate fraud.
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                4.4 Business Transfers
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                If GBS undergoes a merger, acquisition or sale of assets, your
                information may be transferred as part of that transaction. We
                will notify you and provide choices where required.
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                4.5 With Your Consent
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                We may share your information for other purposes with your
                explicit consent.
              </Text>
            </View>
          )}

          {/* 5. DATA SECURITY */}
          <SectionHeader number="5" title="DATA SECURITY" />
          {expandedSections["5"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                5.1 Security Measures
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Encrypted data transmission (SSL/TLS)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Secure authentication and access controls
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Regular security audits and monitoring
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • PCI DSS Level 1 compliant payment processing
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                • Restricted access to personal information on a need-to-know
                basis
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mt-4 mb-3`}>
                5.2 No Absolute Security
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                While we take reasonable steps to protect your information, no
                method of transmission or storage is 100% secure. We cannot
                guarantee absolute security of your information.
              </Text>
            </View>
          )}

          {/* 6. DATA RETENTION */}
          <SectionHeader number="6" title="DATA RETENTION" />
          {expandedSections["6"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                We retain your personal information for as long as your
                membership is active, as necessary to provide App services, as
                required by law or for legitimate business purposes, and to
                resolve disputes or enforce our agreements. When your membership
                ends, we will delete or anonymise your personal information
                unless retention is required by law.
              </Text>
            </View>
          )}

          {/* 7. YOUR RIGHTS AND CHOICES */}
          <SectionHeader number="7" title="YOUR RIGHTS AND CHOICES" />
          {expandedSections["7"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-lg font-bold text-red-600 mb-3`}>
                7.1 Access and Correction
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Request access to the personal information we hold about you
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Request correction of inaccurate or incomplete information
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                • Update your profile information directly within the App
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mt-4 mb-3`}>
                7.2 Deletion
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Request deletion of your account and personal information.
                Note: Some information may be retained as required by law or for
                legitimate business purposes.
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mt-4 mb-3`}>
                7.3 Opt-Out Options
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Unsubscribe from marketing communications (via email links or
                app settings)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Opt out of specific chat groups
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                • Disable push notifications in your device settings
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                • Restrict location data sharing in your device settings
              </Text>

              <Text style={tw`text-lg font-bold text-red-600 mt-4 mb-3`}>
                7.4 Complaints
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                If you believe we have mishandled your personal information,
                contact us directly or lodge a complaint with the Office of the
                Australian Information Commissioner (OAIC): www.oaic.gov.au
              </Text>
            </View>
          )}

          {/* 8. CHILDREN'S PRIVACY */}
          <SectionHeader number="8" title="CHILDREN'S PRIVACY" />
          {expandedSections["8"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 leading-7`}>
                The App is not intended for individuals under 18 years of age.
                We do not knowingly collect personal information from children.
                If we become aware that a child has provided personal
                information, we will delete it immediately.
              </Text>
            </View>
          )}

          {/* 9. THIRD-PARTY LINKS */}
          <SectionHeader number="9" title="THIRD-PARTY LINKS" />
          {expandedSections["9"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 leading-7`}>
                The App may contain links to third-party websites or services
                (e.g., TryBooking, payment processors). We are not responsible
                for the privacy practices of these third parties. We encourage
                you to review their privacy policies.
              </Text>
            </View>
          )}

          {/* 10. INTERNATIONAL DATA TRANSFERS */}
          <SectionHeader number="10" title="INTERNATIONAL DATA TRANSFERS" />
          {expandedSections["10"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 leading-7`}>
                Your information may be stored and processed in Australia and
                other countries where our service providers operate. We ensure
                appropriate safeguards are in place when transferring data
                internationally.
              </Text>
            </View>
          )}

          {/* 11. PUSH NOTIFICATIONS */}
          <SectionHeader number="11" title="PUSH NOTIFICATIONS" />
          {expandedSections["11"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                With your permission, we may send push notifications about
                upcoming events, new exclusive offers, important announcements,
                and chat messages and mentions.
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                You can disable push notifications in your device settings at
                any time.
              </Text>
            </View>
          )}

          {/* 12. CHANGES TO THIS PRIVACY POLICY */}
          <SectionHeader number="12" title="CHANGES TO THIS PRIVACY POLICY" />
          {expandedSections["12"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 leading-7`}>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of material changes through in-app notifications, email
                notifications, and an updated "Last Updated" date at the top of
                this policy. Continued use of the App after changes constitutes
                acceptance of the updated Privacy Policy.
              </Text>
            </View>
          )}

          {/* 13. CONTACT US */}
          <SectionHeader number="13" title="CONTACT US" />
          {expandedSections["13"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-12 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 mb-4 leading-7`}>
                If you have questions, concerns or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </Text>
              <Text style={tw`text-lg font-bold mb-4`}>
                Good Blokes Society
              </Text>
              <TouchableOpacity
                onPress={() => openLink("mailto:leon@goodblokessociety.com.au")}
                style={tw`flex-row items-center mb-3`}
              >
                <MaterialIcons name="email" size={24} color="#1e88e5" />
                <Text style={tw`text-base text-blue-600 underline ml-3`}>
                  leon@goodblokessociety.com.au
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openLink("https://goodblokessociety.com.au")}
                style={tw`flex-row items-center mb-3`}
              >
                <MaterialIcons name="language" size={24} color="#1e88e5" />
                <Text style={tw`text-base text-blue-600 underline ml-3`}>
                  https://goodblokessociety.com.au
                </Text>
              </TouchableOpacity>
              <View style={tw`flex-row items-center mb-6`}>
                <MaterialIcons name="phone" size={24} color="#1e88e5" />
                <Text style={tw`text-base text-gray-700 ml-3`}>
                  +61 448 931 555
                </Text>
              </View>

              <Text style={tw`text-lg font-bold mb-4`}>
                Privacy Officer Contact:
              </Text>
              <Text style={tw`text-base text-gray-700 mb-2`}>Leon Davies</Text>
              <TouchableOpacity
                onPress={() => openLink("mailto:leon@goodblokessociety.com.au")}
                style={tw`flex-row items-center mb-3`}
              >
                <MaterialIcons name="email" size={24} color="#1e88e5" />
                <Text style={tw`text-base text-blue-600 underline ml-3`}>
                  leon@goodblokessociety.com.au
                </Text>
              </TouchableOpacity>
              <View style={tw`flex-row items-center`}>
                <MaterialIcons name="phone" size={24} color="#1e88e5" />
                <Text style={tw`text-base text-gray-700 ml-3`}>
                  +61 448 931 555
                </Text>
              </View>
            </View>
          )}

          {/* 14. AUSTRALIAN PRIVACY PRINCIPLES COMPLIANCE */}
          <SectionHeader number="14" title="AUSTRALIAN PRIVACY PRINCIPLES" />
          {expandedSections["14"] && (
            <View
              style={tw`bg-white p-6 rounded-2xl shadow-md mb-12 border border-gray-100`}
            >
              <Text style={tw`text-base text-gray-700 leading-7 mb-3`}>
                This Privacy Policy is designed to comply with the Australian
                Privacy Principles (APPs) under the Privacy Act 1988 (Cth). We
                are committed to:
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-2`}>
                • Transparent management of personal information (APP 1)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-2`}>
                • Giving you the option to deal with us anonymously where
                practicable (APP 2)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-2`}>
                • Collecting personal information only when necessary (APP 3)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-2`}>
                • Handling unsolicited information appropriately (APP 4)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-2`}>
                • Notifying you about collection (APP 5)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-2`}>
                • Using and disclosing information appropriately (APPs 6–9)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7 mb-2`}>
                • Ensuring quality and security of information (APPs 10–11)
              </Text>
              <Text style={tw`text-base text-gray-700 leading-7`}>
                • Providing access to and correction of information (APPs 12–13)
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
