// import React from 'react';
// import { View, Text, FlatList } from 'react-native';
// import tw from 'tailwind-react-native-classnames';

// const dummyOffers = [
//   { id: '1', title: '50% Off on Electronics', details: 'Valid till 30th Aug' },
//   { id: '2', title: 'Buy 1 Get 1 Free', details: 'Applicable on select items' },
//   { id: '3', title: 'Free Shipping', details: 'On orders above $50' },
// ];

// export default function AddOfferScreen() {
//   return (
//     <View style={tw`flex-1 bg-white p-4`}>
//       <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
//         Available Offers
//       </Text>

//       <FlatList
//         data={dummyOffers}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={tw`mb-4 p-4 bg-gray-100 rounded-lg`}>
//             <Text style={tw`text-lg font-semibold text-gray-900`}>{item.title}</Text>
//             <Text style={tw`text-sm text-gray-600`}>{item.details}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }


import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";

const AddOfferScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    businessId: "",
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
  const [businesses, setBusinesses] = useState([]);
  const [businessOpen, setBusinessOpen] = useState(false);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/business`);
        if (!res.ok) throw new Error("Failed to fetch businesses");
        const data = await res.json();
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (err) {
        Alert.alert("Error", "Failed to load businesses");
      }
    };
    fetchBusinesses();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

//   const handleSave = async () => {
//     if (!form.businessId) {
//       Alert.alert("Validation", "Please select a business");
//       return;
//     }
//     try {
//       setLoading(true);
//       const url = `${API_BASE_URL}/offer/${form.businessId}`;
//       const payload = {
//         ...form,
//         expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
//         locations: (form.locations || []).filter((l) => (l || "").trim() !== ""),
//         termsAndConditions: (form.termsAndConditions || []).filter((t) => (t || "").trim() !== ""),
//       };

//       console.log("[AddOffer] URL:", url);
//       console.log("[AddOffer] Payload:", payload);

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       console.log("[AddOffer] Response status:", res.status);
//       let responseBody = null;
//       try {
//         responseBody = await res.json();
//       } catch (e) {
//         // not JSON or empty
//       }
//       console.log("[AddOffer] Response body:", responseBody);

//       if (!res.ok) throw new Error("Failed to add offer");
//       Alert.alert("Success", "Offer added successfully", [
//         { text: "OK", onPress: () => navigation.goBack() },
//       ]);
//     } catch (err) {
//       Alert.alert("Error", "Failed to add offer");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleSave = async () => {
  if (!form.businessId) {
    Alert.alert("Validation", "Please select a business");
    return;
  }
  try {
    setLoading(true);
    const url = `${API_BASE_URL}/offer/${form.businessId}`;

    const payload = {
      business: form.businessId, // FIXED: Use 'business'
      image: form.image || "offer/default/image.jpg",
      title: form.title.trim(),
      discount: form.discount.trim(),
      offerType: form.offerType,
      category: form.category.trim(),
      expiryDate: form.expiryDate
        ? new Date(form.expiryDate).toISOString()
        : null,
      description: form.description.trim(),
      termsAndConditions: (form.termsAndConditions || [])
        .map((t) => t.trim())
        .filter((t) => t !== ""),
      howToRedeem: form.howToRedeem.trim(),
      contactPhone: form.contactPhone.trim(),
      contactEmail: form.contactEmail.trim(),
      locations: (form.locations || [])
        .map((l) => l.trim().toLowerCase()) // match CMS format
        .filter((l) => l !== "")
    };

    console.log("[AddOffer] URL:", url);
    console.log("[AddOffer] Payload:", payload);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const responseBody = await res.json();
    console.log("[AddOffer] Response:", responseBody);

    if (!res.ok) throw new Error(responseBody?.message || "Failed to add offer");

    Alert.alert("Success", "Offer added successfully", [
      { text: "OK", onPress: () => navigation.goBack() }
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
        {/* Business select dropdown */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>Business</Text>
        <View style={tw`mb-3`}>
          <TouchableOpacity
            onPress={() => setBusinessOpen((v) => !v)}
            style={tw`border border-gray-300 rounded-lg px-3 py-2 bg-white flex-row justify-between items-center`}
          >
            <Text style={tw`${form.businessId ? "text-gray-800" : "text-gray-500"}`}>
              {form.businessId
                ? (businesses.find((b) => b._id === form.businessId)?.companyName || "-- Select Business --")
                : "-- Select Business --"}
            </Text>
            <Text style={tw`text-gray-500`}>{businessOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {businessOpen && (
            <View style={tw`border border-gray-300 rounded-lg mt-1 bg-white`}>
              <ScrollView style={{ maxHeight: 220 }}>
                <TouchableOpacity
                  style={tw`px-3 py-2 border-b border-gray-200`}
                  onPress={() => {
                    updateField("businessId", "");
                    setBusinessOpen(false);
                  }}
                >
                  <Text style={tw`text-gray-600`}>-- Select Business --</Text>
                </TouchableOpacity>
                {businesses.map((b) => (
                  <TouchableOpacity
                    key={b._id}
                    style={tw`px-3 py-2 border-b border-gray-200`}
                    onPress={() => {
                      updateField("businessId", b._id);
                      setBusinessOpen(false);
                    }}
                  >
                    <Text style={tw`${form.businessId === b._id ? "text-red-600" : "text-gray-800"}`}>{b.companyName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <LabeledInput label="Title" value={form.title} onChangeText={(t) => updateField("title", t)} />
        <LabeledInput label="Discount" value={form.discount} onChangeText={(t) => updateField("discount", t)} />
        <LabeledInput label="Category" value={form.category} onChangeText={(t) => updateField("category", t)} />

        {/* Offer type toggle */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>Offer Type</Text>
        <View style={tw`flex-row mb-3`}>
          {(["Member", "Partner"]).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => updateField("offerType", type)}
              style={tw`px-4 py-2 mr-2 rounded-full ${form.offerType === type ? "bg-red-500" : "bg-gray-100"}`}
            >
              <Text style={tw`${form.offerType === type ? "text-white" : "text-gray-700"}`}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Expiry date (YYYY-MM-DD) */}
        <LabeledInput
          label="Expiry Date (YYYY-MM-DD)"
          value={form.expiryDate}
          onChangeText={(t) => updateField("expiryDate", t)}
          placeholder="2025-03-30"
        />

        {/* Description */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>Description</Text>
        <TextInput
          value={form.description}
          onChangeText={(t) => updateField("description", t)}
          style={tw`border border-gray-300 rounded-lg px-3 py-2 min-h-20`}
          multiline
        />

        {/* Locations (comma separated) */}
        <LabeledInput
          label="Locations (comma separated)"
          value={(form.locations || []).join(", ")}
          onChangeText={(t) => updateField("locations", t.split(",").map((s) => s.trim()))}
          placeholder="Sydney, Melbourne"
        />

        {/* Contact */}
        <LabeledInput label="Contact Phone" value={form.contactPhone} onChangeText={(t) => updateField("contactPhone", t)} />
        <LabeledInput label="Contact Email" value={form.contactEmail} onChangeText={(t) => updateField("contactEmail", t)} />

        {/* Terms */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>Terms and Conditions (one per line)</Text>
        <TextInput
          value={(form.termsAndConditions || []).join("\n")}
          onChangeText={(t) => updateField("termsAndConditions", t.split("\n").map((s) => s.trim()))}
          style={tw`border border-gray-300 rounded-lg px-3 py-2 min-h-20`}
          multiline
        />

        {/* How to redeem */}
        <LabeledInput label="How to Redeem" value={form.howToRedeem} onChangeText={(t) => updateField("howToRedeem", t)} />

        {/* Actions */}
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

const LabeledInput = ({ label, value, onChangeText, placeholder }) => {
  return (
    <View style={tw`mb-3`}>
      <Text style={tw`text-sm text-gray-700 mb-1`}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={tw`border border-gray-300 rounded-lg px-3 py-2`}
      />
    </View>
  );
};

export default AddOfferScreen;


