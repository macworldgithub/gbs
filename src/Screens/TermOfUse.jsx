import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";

const TermsOfUse = () => {
  const navigation = useNavigation();

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link: ", err)
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1`}>
        {/* Fixed Header */}
        <View style={tw`px-5 pt-4 pb-4 bg-white`}>
          <View style={tw`flex-row items-center justify-between`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <View style={{ width: 28 }} /> {/* Spacer for centering */}
          </View>
          <Text
            style={tw`text-2xl font-extrabold text-center mt-4 text-red-600`}
          >
            GOOD BLOKES SOCIETY APP - TERMS OF USE
          </Text>
          <Text style={tw`text-base text-center text-gray-600 mt-2`}>
            Last Updated: January 2026
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={tw`flex-1 px-6 pt-6`}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1 */}
          <Text style={tw`text-xl font-black text-black mb-3`}>
            1. ACCEPTANCE OF TERMS
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            By downloading, accessing, or using the Good Blokes Society (GBS)
            mobile application ("the App"), you agree to be bound by these Terms
            of Use. If you do not agree to these terms, please do not use the
            App.
          </Text>

          {/* Section 2 */}
          <Text style={tw`text-xl font-black text-black mb-3`}>
            2. ABOUT GBS
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            The Good Blokes Society is a membership-based community, built on
            three core pillars: Business, Social and Wellbeing. The App provides
            members with access to events, exclusive offers, networking
            opportunities and community features.
          </Text>

          {/* Section 3 */}
          <Text style={tw`text-xl font-black text-black mb-3`}>
            3. ELIGIBILITY AND ACCOUNT REGISTRATION
          </Text>
          <Text style={tw`text-base font-bold mb-2`}>3.1</Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            You must be 18 years or older to use the App and become a GBS
            member.
          </Text>
          <Text style={tw`text-base font-bold mb-2`}>3.2</Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            You must provide accurate, current and complete information during
            registration.
          </Text>
          <Text style={tw`text-base font-bold mb-2`}>3.3</Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            You are responsible for maintaining the confidentiality of your
            account credentials.
          </Text>
          <Text style={tw`text-base font-bold mb-2`}>3.4</Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            You agree to notify us immediately of any unauthorized use of your
            account.
          </Text>

          {/* Section 4 - Membership Tiers in Card Style */}
          <Text style={tw`text-xl font-black text-black mb-3`}>
            4. MEMBERSHIP AND PAYMENTS
          </Text>
          <Text style={tw`text-base font-bold mb-3`}>
            4.1 Membership Tiers:
          </Text>
          <View style={tw`mb-6`}>
            <View
              style={tw`bg-gray-100 p-4 rounded-lg mb-3 border-l-4 border-red-600`}
            >
              <Text style={tw`text-base font-semibold`}>
                Social & Wellbeing Membership
              </Text>
              <Text style={tw`text-base text-gray-700`}>
                $495.00 per annum or $45.00 per month (direct debit)
              </Text>
            </View>
            <View
              style={tw`bg-gray-100 p-4 rounded-lg mb-3 border-l-4 border-red-600`}
            >
              <Text style={tw`text-base font-semibold`}>
                Business Membership
              </Text>
              <Text style={tw`text-base text-gray-700`}>
                $1,650.00 per annum
              </Text>
            </View>
            <View
              style={tw`bg-gray-100 p-4 rounded-lg mb-3 border-l-4 border-red-600`}
            >
              <Text style={tw`text-base font-semibold`}>
                Business Executive Membership
              </Text>
              <Text style={tw`text-base text-gray-700`}>
                $3,450.00 per annum
              </Text>
            </View>
            <View
              style={tw`bg-gray-100 p-4 rounded-lg mb-3 border-l-4 border-red-600`}
            >
              <Text style={tw`text-base font-semibold`}>
                Alliance Membership
              </Text>
              <Text style={tw`text-base text-gray-700`}>
                $7,500.00 per annum
              </Text>
            </View>
            <View
              style={tw`bg-gray-100 p-4 rounded-lg mb-8 border-l-4 border-red-600`}
            >
              <Text style={tw`text-base font-semibold`}>
                Custom Corporate Memberships
              </Text>
              <Text style={tw`text-base text-gray-700`}>
                Available by arrangement
              </Text>
            </View>
          </View>

          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            4.2 Payment Processing: All payments are processed through secure,
            PCI DSS Level 1 certified third-party payment processors. We do not
            store your complete payment card details on our servers.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            4.3 Recurring Payments: By selecting a membership with recurring
            payments, you authorise us to charge your selected payment method
            automatically at each renewal period until you cancel.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            4.4 Refunds and Cancellations: Membership fees are non-refundable
            except as required by Australian Consumer Law. You may cancel your
            membership at any time by contacting us, with cancellation effective
            at the end of your current billing period.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            4.5 Membership Upgrades: You may upgrade your membership at any
            time. Payment for the upgraded membership tier is required
            immediately, any value left on your previous membership will be
            reimbursed, your upgraded membership will reflect on your profile
            immediately upon successful payment.
          </Text>

          {/* Remaining Sections (similar enhancements) */}
          <Text style={tw`text-xl font-black text-black mb-3`}>
            5. CODE OF CONDUCT AND MEMBER VALUES
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            5.1 All members must adhere to the GBS Code of Conduct and Member
            Values, which you acknowledged and agreed to upon signup.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            5.2 Members are expected to treat all other members with respect,
            professionalism and courtesy.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            5.3 Harassment, discrimination, inappropriate behaviour, or
            violation of the Code of Conduct may result in immediate membership
            termination without refund.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            6. USER CONTENT AND CONDUCT
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            6.1 User-Generated Content: You may post content on the Noticeboard,
            in chat groups and on your member profile. You retain ownership of
            your content but grant GBS a non-exclusive, worldwide license to
            use, display and distribute your content within the App.
          </Text>
          <Text style={tw`text-base font-bold mb-2`}>
            6.2 Prohibited Content: You may not post content that is:
          </Text>
          <Text style={tw`text-base text-gray-700 mb-2 ml-5`}>
            • Illegal, harmful, threatening, abusive, or offensive
          </Text>
          <Text style={tw`text-base text-gray-700 mb-2 ml-5`}>
            • Infringes on intellectual property rights
          </Text>
          <Text style={tw`text-base text-gray-700 mb-2 ml-5`}>
            • Contains spam, advertising, or promotional material (unless in
            designated areas)
          </Text>
          <Text style={tw`text-base text-gray-700 mb-2 ml-5`}>
            • Contains malware or malicious code
          </Text>
          <Text style={tw`text-base text-gray-700 mb-4 ml-5`}>
            • Violates privacy or misrepresents identity
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            6.3 Content Moderation: GBS reserves the right to remove any content
            that violates these terms or is deemed inappropriate, without
            notice.
          </Text>

          {/* Continue similarly for other sections to save space – copy the pattern */}
          <Text style={tw`text-xl font-black text-black mb-3`}>
            7. CHAT GROUPS AND COMMUNICATIONS
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            7.1 The App includes group chat functionality for member
            communication.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            7.2 Members may opt in/out of specific interest-based chat groups.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            7.3 All communications must comply with the Code of Conduct.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            8. EVENTS AND BOOKINGS
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            8.1 Event information, including dates, locations and pricing, is
            subject to change.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            8.2 Event bookings are managed through third-party booking systems
            (e.g., TryBooking). Separate terms and conditions may apply.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            8.3 GBS is not responsible for issues arising from third-party
            booking platforms.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            9. EXCLUSIVE OFFERS
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            9.1 Exclusive offers from GBS members are provided as a membership
            benefit.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            9.2 GBS is not responsible for the quality, delivery, or fulfillment
            of goods or services offered by members.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            9.3 Transactions for exclusive offers are between members; GBS is
            not a party to these transactions.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            10. INTELLECTUAL PROPERTY
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            10.1 All content, logos, trademarks and materials within the App are
            owned by GBS or licensed to GBS.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            10.2 You may not copy, reproduce, distribute, or create derivative
            works without express written permission.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            11. PRIVACY AND DATA PROTECTION
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            11.1 Your use of the App is subject to our Privacy Policy, which
            explains how we collect, use and protect your personal information.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            11.2 By using the App, you consent to the collection and use of your
            information as described in the Privacy Policy.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            12. LIMITATION OF LIABILITY
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            12.1 GBS provides the App "as is" without warranties of any kind.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            12.2 GBS is not liable for any indirect, incidental, or
            consequential damages arising from your use of the App.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            12.3 Our total liability to you for any claims arising from the App
            shall not exceed the amount you paid for membership in the 12 months
            prior to the claim.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            12.4 Nothing in these terms excludes or limits liability that cannot
            be excluded or limited under Australian Consumer Law.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            13. INDEMNIFICATION
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            You agree to indemnify and hold harmless GBS, its officers,
            directors, employees and agents from any claims, damages, or
            expenses arising from your use of the App, your violation of these
            terms, or your violation of any rights of another party.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            14. TERMINATION
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            14.1 GBS may suspend or terminate your account and access to the App
            at any time for violation of these terms.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-3 leading-7`}>
            14.2 Upon termination, your right to use the App ceases immediately.
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            14.3 Provisions that by their nature should survive termination
            (including payment obligations, intellectual property rights and
            limitation of liability) will continue after termination.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            15. MODIFICATIONS TO TERMS
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            GBS reserves the right to modify these Terms of Use at any time. We
            will notify you of material changes through the App or via email.
            Continued use of the App after changes constitutes acceptance of the
            modified terms.
          </Text>

          <Text style={tw`text-xl font-black text-black mb-3`}>
            16. GOVERNING LAW
          </Text>
          <Text style={tw`text-base text-gray-700 mb-8 leading-7`}>
            These Terms of Use are governed by the laws of Victoria, Australia.
            Any disputes arising from these terms shall be subject to the
            exclusive jurisdiction of the courts of Victoria.
          </Text>

          {/* Contact Section */}
          <Text style={tw`text-xl font-black text-black mb-3`}>
            17. CONTACT INFORMATION
          </Text>
          <Text style={tw`text-base text-gray-700 mb-4`}>
            For questions about these Terms of Use, please contact:
          </Text>
          <Text style={tw`text-lg font-bold mb-3`}>Good Blokes Society</Text>
          <TouchableOpacity
            onPress={() => openLink("mailto:leon@goodblokessociety.com.au")}
          >
            <Text style={tw`text-base text-blue-600 underline mb-3`}>
              Email: leon@goodblokessociety.com.au
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openLink("https://goodblokessociety.com.au")}
          >
            <Text style={tw`text-base text-blue-600 underline mb-12`}>
              Website: https://goodblokessociety.com.au
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TermsOfUse;
