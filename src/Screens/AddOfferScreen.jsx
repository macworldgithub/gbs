import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from "react-native";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";
import { Picker } from "@react-native-picker/picker"; // ✅ Picker import

const CATEGORIES = [
  "Restaurant & Dining",
  "Professional Services",
  "Retail & Products",
  "Health & Wellness",
  "Trade Services",
  "Energy Suppliers",
  "Telecommunications",
  "Automotive",
  "Insurance",
  "Travel & Accommodation",
  "Entertainment & Events",
  "Technology & Software",
];

const AddOfferScreen = ({ navigation, route }) => {
  const { id: businessId } = route.params || {};

  const [form, setForm] = useState({
    image: "offer/12345/image/offer-promo.jpg",
    title: "",
    discount: "",
    offerType: "Member",
    category: "",
    expiryDate: "",
    description: "",
    termsAndConditions: [""],
    howToRedeem: "",
    contactPhone: "",
    contactEmail: "",
    locations: [""],
  });

  const [loading, setLoading] = useState(false);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!businessId) {
      Alert.alert("Error", "Business ID not found");
      return;
    }
    try {
      setLoading(true);
      const user = await getUserData();
      const token = user?.token;
      if (!token) {
        throw new Error("User not authenticated. Please log in again.");
      }
      const url = `${API_BASE_URL}/offer/${businessId}`;

      const payload = {
        business: businessId,
        image: form.image || "offer/default/image.jpg",
        title: form.title.trim(),
        discount: form.discount.trim(),
        offerType: form.offerType,
        category: form.category.trim(),
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
        description: form.description.trim(),
        termsAndConditions: (form.termsAndConditions || [])
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        howToRedeem: form.howToRedeem.trim(),
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
        locations: (form.locations || [])
          .map((l) => l.trim().toLowerCase())
          .filter((l) => l !== ""),
      };

      console.log("[AddOffer] URL:", url);
      console.log("[AddOffer] Payload:", payload);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const responseBody = await res.json();
      console.log("[AddOffer] Response:", responseBody);

      if (!res.ok) throw new Error(responseBody?.message || "Failed to add offer");

      Alert.alert("Success", "Offer added successfully", [
        { text: "OK", onPress: () => navigation.goBack({ refresh: true }) },
      ]);
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", err.message || "Failed to add offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`px-4 py-4 mt-14 flex-row items-center justify-between`}>
        <Text style={tw`text-xl font-bold text-gray-800`}>Add Offer</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tw`text-red-500 text-base`}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={{ paddingBottom: 24 }}>
        <LabeledInput label="Title" value={form.title} onChangeText={(t) => updateField("title", t)} />
        <LabeledInput label="Discount" value={form.discount} onChangeText={(t) => updateField("discount", t)} />

        {/* ✅ Category Dropdown */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>Category</Text>
        <View style={tw`border border-gray-300 rounded-lg mb-3`}>
          <Picker
            selectedValue={form.category}
            onValueChange={(itemValue) => updateField("category", itemValue)}
            style={Platform.OS === "ios" ? tw`h-40` : tw`h-12`}
          >
            <Picker.Item label="Select Category" value="" />
            {CATEGORIES.map((cat, idx) => (
              <Picker.Item key={idx} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        {/* Offer type toggle */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>Offer Type</Text>
        <View style={tw`flex-row mb-3`}>
          {["Member", "Partner"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => updateField("offerType", type)}
              style={tw`px-4 py-2 mr-2 rounded-full ${
                form.offerType === type ? "bg-red-500" : "bg-gray-100"
              }`}
            >
              <Text style={tw`${form.offerType === type ? "text-white" : "text-gray-700"}`}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <LabeledInput
          label="Expiry Date (YYYY-MM-DD)"
          value={form.expiryDate}
          onChangeText={(t) => updateField("expiryDate", t)}
          placeholder="2025-03-30"
        />

        <Text style={tw`text-sm text-gray-700 mb-1`}>Description</Text>
        <TextInput
          value={form.description}
          onChangeText={(t) => updateField("description", t)}
          style={tw`border border-gray-300 rounded-lg px-3 py-2 min-h-20`}
          multiline
        />

        <LabeledInput
          label="Locations (comma separated)"
          value={(form.locations || []).join(", ")}
          onChangeText={(t) => updateField("locations", t.split(",").map((s) => s.trim()))}
          placeholder="Sydney, Melbourne"
        />

        <LabeledInput label="Contact Phone" value={form.contactPhone} onChangeText={(t) => updateField("contactPhone", t)} />
        <LabeledInput label="Contact Email" value={form.contactEmail} onChangeText={(t) => updateField("contactEmail", t)} />

        <Text style={tw`text-sm text-gray-700 mb-1`}>Terms and Conditions (one per line)</Text>
        <TextInput
          value={(form.termsAndConditions || []).join("\n")}
          onChangeText={(t) => updateField("termsAndConditions", t.split("\n").map((s) => s.trim()))}
          style={tw`border border-gray-300 rounded-lg px-3 py-2 min-h-20`}
          multiline
        />

        <LabeledInput label="How to Redeem" value={form.howToRedeem} onChangeText={(t) => updateField("howToRedeem", t)} />

        <View style={tw`flex-row justify-end mt-4 mb-8`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`px-4 py-2 rounded border border-gray-300 mr-2`}>
            <Text style={tw`text-gray-700`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} disabled={loading} style={tw`px-4 py-2 rounded bg-red-500`}>
            <Text style={tw`text-white`}>{loading ? "Saving..." : "+ Save Offer"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const LabeledInput = ({ label, value, onChangeText, placeholder }) => (
  <View style={tw`mb-3`}>
    <Text style={tw`text-sm text-gray-700 mb-1`}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} style={tw`border border-gray-300 rounded-lg px-3 py-2`} />
  </View>
);

export default AddOfferScreen;
