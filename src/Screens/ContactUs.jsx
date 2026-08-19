import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const PHONE_DISPLAY = "0448 931 555";
// const PHONE_NUMBER = "1300071215";
const PHONE_NUMBER = "0448931555"; // +61 for Australia

export default function ContactUs({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCall = async () => {
    const url = `tel:${PHONE_NUMBER}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
    else Alert.alert("Unavailable", "Calling is not supported on this device.");
  };

  const handleSMS = async () => {
    const url = `sms:${PHONE_NUMBER}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
    else Alert.alert("Unavailable", "SMS is not supported on this device.");
  };

  const handleEmail = async () => {
    const subject = encodeURIComponent(`Contact from ${name || "Guest"}`);
    const body = encodeURIComponent(
      `${message}\n\nReply to: ${email || "(not provided)"}`,
    );
    const url = `mailto:?subject=${subject}&body=${body}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
    else Alert.alert("Unavailable", "Email is not supported on this device.");
  };

  const handleSubmit = async () => {
    try {
      if (!name?.trim()) {
        Alert.alert("Validation", "Please enter your name.");
        return;
      }
      if (!message?.trim()) {
        Alert.alert("Validation", "Please enter your message.");
        return;
      }

      setSubmitting(true);
      const payload = {
        name: name.trim(),
        email: email?.trim() || undefined,
        message: message.trim(),
      };
      console.log("[ContactUs] Submitting payload:", payload);

      const res = await axios.post(`${API_BASE_URL}/user/contact`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Example success response (SMTP accepted list)
      const data = res?.data || {};
      console.log("[ContactUs] API response:", data);
      const accepted = Array.isArray(data.accepted) ? data.accepted : [];
      const responseMsg = data.response || "Message sent successfully.";

      if (accepted.length > 0) {
        setName("");
        setEmail("");
        setMessage("");
        Alert.alert("Success", "Message sent successfully!");
      } else {
        setName("");
        setEmail("");
        setMessage("");
        Alert.alert("Sent", responseMsg);
      }
    } catch (e) {
      const err = e?.response?.data || e;
      const msg = err?.message || "Failed to send message.";
      console.error("[ContactUs] API error:", err);
      Alert.alert(
        "Error",
        typeof msg === "string" ? msg : "Failed to send message.",
      );
    } finally {
      console.log("[ContactUs] Submit finished");
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView style={tw`flex-1`} scrollEnabled={true}>
        <View style={tw`flex-row items-center bg-red-500 px-4 py-3 mt-12`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-white text-lg font-bold`}>Contact Us</Text>
        </View>

        <View style={tw`p-5`}>
          <View style={tw`bg-gray-100 rounded-xl p-4 mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-900 mb-1`}>
              We'd love to help
            </Text>
            <Text style={tw`text-gray-600`}>
              Get in touch using any of the options below.
            </Text>
          </View>

          <View style={tw`bg-white rounded-xl p-4 border border-gray-200 mb-5`}>
            <Text style={tw`text-lg font-bold text-gray-900 mb-2`}>Phone</Text>
            <Text style={tw`text-gray-700 mb-4`}>{PHONE_DISPLAY}</Text>
            <View style={tw`flex-row`}>
              <TouchableOpacity
                onPress={handleCall}
                style={tw`bg-red-500 rounded-lg px-4 py-3 mr-3`}
              >
                <Text style={tw`text-white font-bold`}>Call Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSMS}
                style={tw`bg-gray-800 rounded-lg px-4 py-3`}
              >
                <Text style={tw`text-white font-bold`}>Text via SMS</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`bg-white rounded-xl p-4 border border-gray-200 mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-900 mb-3`}>
              Send us a message
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3  text-black`}
              placeholder="Your name"
              placeholderTextColor="#000"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3 text-black`}
              placeholder="Your email "
              placeholderTextColor="#000"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3 h-28 text-black`}
              placeholder="How can we help?"
              placeholderTextColor="#000"
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={handleSubmit}
              style={tw`bg-red-500 rounded-lg px-4 py-3`}
            >
              <Text style={tw`text-white font-bold text-center`}>
                {submitting ? "Sending..." : "Send Message"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`items-center mb-10`}>
            <Text style={tw`text-gray-500`}>
              Response hours: 9am – 5pm (Mon–Fri)
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
