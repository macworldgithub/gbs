import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // 👈 import Picker
import tw from "twrnc";
import axios from "axios";
import { API_BASE_URL } from "../src/utils/config";

const states = ["VIC", "NSW", "QLD", "SA", "WA"];
const industries = [
  "Professional Services",
  "Construction & Trades",
  "Technology & IT",
  "Health & Wellness",
  "Hospitality & Events",
  "Retail & E-commerce",
  "Manufacturing",
  "Financial Services",
  "Marketing & Media",
  "Auto Industry",
  "Other Services",
];

const AddBusinessModal = ({ visible, onClose, fetchBusinesses }) => {
  const [business, setBusiness] = useState({
    companyName: "",
    title: "",
    industry: "",
    state: "",
    city: "",
    about: "",
    services: "",
    industriesServed: "",
    lookingFor: "",
    phone: "",
    email: "",
    website: "",
    rating: "",
    socialLinks: "",
  });

  const handleChange = (key, value) => {
    setBusiness((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const ratingValue = business.rating ? parseFloat(business.rating) : 0;

      const payload = {
        companyName: business.companyName,
        title: business.title,
        industry: business.industry,
        state: business.state,
        city: business.city,
        about: business.about,
        services: business.services
          ? business.services.split(",").map((s) => s.trim())
          : [],
        industriesServed: business.industriesServed
          ? business.industriesServed.split(",").map((s) => s.trim())
          : [],
        lookingFor: business.lookingFor,
        phone: business.phone,
        email: business.email,
        website: business.website,
        rating: ratingValue,
        socialLinks: business.socialLinks
          ? business.socialLinks.split(",").map((link) => ({ url: link.trim() }))
          : [],
        gallery: [],
        testimonials: [],
        memberSince: new Date().toISOString(),
        specialOffers: [],
        isFeatured: false,
      };

      console.log("Submitting payload:", payload);

      const response = await axios.post(`${API_BASE_URL}/business`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      if (fetchBusinesses) fetchBusinesses();
      Alert.alert("Success", "Business created successfully!");
      onClose();

      setBusiness({
        companyName: "",
        title: "",
        industry: "",
        state: "",
        city: "",
        about: "",
        services: "",
        industriesServed: "",
        lookingFor: "",
        phone: "",
        email: "",
        website: "",
        rating: "",
        socialLinks: "",
      });
    } catch (error) {
      console.error(
        "Error adding business:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to add business");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white w-11/12 max-h-[90%] rounded-2xl p-5`}>
          <Text style={tw`text-lg font-bold mb-4`}>Add Business</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              placeholder="Company Name"
              style={tw`border p-2 rounded mb-3`}
              value={business.companyName}
              onChangeText={(val) => handleChange("companyName", val)}
            />
            <TextInput
              placeholder="Owner/Title"
              style={tw`border p-2 rounded mb-3`}
              value={business.title}
              onChangeText={(val) => handleChange("title", val)}
            />

            {/* Industry Dropdown */}
            <View style={tw`border rounded mb-3`}>
              <Picker
                selectedValue={business.industry}
                onValueChange={(val) => handleChange("industry", val)}
              >
                <Picker.Item label="Select Industry" value="" />
                {industries.map((ind, idx) => (
                  <Picker.Item key={idx} label={ind} value={ind} />
                ))}
              </Picker>
            </View>

            {/* State Dropdown */}
            <View style={tw`border rounded mb-3`}>
              <Picker
                selectedValue={business.state}
                onValueChange={(val) => handleChange("state", val)}
              >
                <Picker.Item label="Select State" value="" />
                {states.map((st, idx) => (
                  <Picker.Item key={idx} label={st} value={st} />
                ))}
              </Picker>
            </View>

            <TextInput
              placeholder="City"
              style={tw`border p-2 rounded mb-3`}
              value={business.city}
              onChangeText={(val) => handleChange("city", val)}
            />
            <TextInput
              placeholder="About"
              style={tw`border p-2 rounded mb-3`}
              value={business.about}
              onChangeText={(val) => handleChange("about", val)}
              multiline
            />
            <TextInput
              placeholder="Services (comma separated)"
              style={tw`border p-2 rounded mb-3`}
              value={business.services}
              onChangeText={(val) => handleChange("services", val)}
            />
            <TextInput
              placeholder="Industries Served (comma separated)"
              style={tw`border p-2 rounded mb-3`}
              value={business.industriesServed}
              onChangeText={(val) => handleChange("industriesServed", val)}
            />
            <TextInput
              placeholder="Looking For"
              style={tw`border p-2 rounded mb-3`}
              value={business.lookingFor}
              onChangeText={(val) => handleChange("lookingFor", val)}
            />
            <TextInput
              placeholder="Phone"
              style={tw`border p-2 rounded mb-3`}
              value={business.phone}
              onChangeText={(val) => handleChange("phone", val)}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Email"
              style={tw`border p-2 rounded mb-3`}
              value={business.email}
              onChangeText={(val) => handleChange("email", val)}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Website"
              style={tw`border p-2 rounded mb-3`}
              value={business.website}
              onChangeText={(val) => handleChange("website", val)}
            />
            <TextInput
              placeholder="Rating (0-5)"
              style={tw`border p-2 rounded mb-3`}
              value={business.rating}
              onChangeText={(val) => handleChange("rating", val)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Social Links (comma separated URLs)"
              style={tw`border p-2 rounded mb-5`}
              value={business.socialLinks}
              onChangeText={(val) => handleChange("socialLinks", val)}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={tw`bg-green-600 p-3 rounded-xl mb-3`}
              onPress={handleSubmit}
            >
              <Text style={tw`text-white text-center font-bold`}>Submit</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={tw`bg-gray-500 p-3 rounded-xl`}
              onPress={onClose}
            >
              <Text style={tw`text-white text-center font-bold`}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddBusinessModal;
