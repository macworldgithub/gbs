import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { API_BASE_URL } from "../src/utils/config";
import { getUserData } from "../src/utils/storage";

// Predefined options
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

const AddBusinessModal = ({ visible, onClose, onBusinessAdded }) => {
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");
  const [services, setServices] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [industriesServed, setIndustriesServed] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [rating, setRating] = useState("0");
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setCompanyName("");
    setTitle("");
    setIndustry(null);
    setState(null);
    setCity("");
    setAbout("");
    setServices("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setIndustriesServed("");
    setLookingFor("");
    setRating("0");
    setSocialLinks([{ platform: "", url: "" }]);
  };

  const submitBusiness = async () => {
    if (!companyName || !title || !industry || !city || !about) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const userData = await getUserData();
      const token = userData?.token;
      if (!token) {
        Alert.alert("Error", "User not authenticated. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/business`,
        {
          companyName,
          title,
          industry,
          state,
          city,
          about,
          services: services.split(",").map((s) => s.trim()),
          phone,
          email,
          website,
          industriesServed: industriesServed ? industriesServed.split(",").map((s) => s.trim()) : [],
          lookingFor,
          rating: parseFloat(rating) || 0,
          socialLinks: socialLinks.filter((link) => link.platform && link.url),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Business added successfully!", [
        {
          text: "OK",
          onPress: () => {
            if (onBusinessAdded) onBusinessAdded(true);
            resetForm();
            onClose();
          },
        },
      ]);
    } catch (error) {
      console.error("Error adding business:", error.response?.data || error.message);
      Alert.alert("Error", `Failed to add business: ${error.response?.statusText || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  const addSocialLinkField = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <ScrollView
          style={[tw`bg-white w-11/12 rounded-2xl p-5`, { maxHeight: "85%" }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={tw`text-lg font-bold mb-4`}>Add Business</Text>

          <TextInput
            placeholder="Company Name"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={companyName}
            onChangeText={setCompanyName}
          />
          <TextInput
            placeholder="Title"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={title}
            onChangeText={setTitle}
          />

          <View style={tw`border border-gray-300 rounded-lg mb-3`}>
            <Picker
              selectedValue={industry}
              onValueChange={(itemValue) => setIndustry(itemValue)}
              style={tw`p-3`}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Select Industry" value={null} />
              {industries.map((ind) => (
                <Picker.Item key={ind} label={ind} value={ind} />
              ))}
            </Picker>
          </View>

          <View style={tw`border border-gray-300 rounded-lg mb-3`}>
            <Picker
              selectedValue={state}
              onValueChange={(itemValue) => setState(itemValue)}
              style={tw`p-3`}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Select State" value={null} />
              {states.map((st) => (
                <Picker.Item key={st} label={st} value={st} />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="City"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            placeholder="About"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={about}
            onChangeText={setAbout}
          />
          <TextInput
            placeholder="Services (comma separated)"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={services}
            onChangeText={setServices}
          />
          <TextInput
            placeholder="Phone"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            placeholder="Email"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Website"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={website}
            onChangeText={setWebsite}
          />

          <TextInput
            placeholder="Industries Served (comma separated)"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={industriesServed}
            onChangeText={setIndustriesServed}
          />
          <TextInput
            placeholder="Looking For"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={lookingFor}
            onChangeText={setLookingFor}
          />
          <TextInput
            placeholder="Rating (0-5)"
            keyboardType="numeric"
            style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-500`}
            value={rating}
            onChangeText={setRating}
          />

          <Text style={tw`font-bold mb-2`}>Social Links</Text>
          {socialLinks.map((link, index) => (
            <View key={index} style={tw`mb-2`}>
              <TextInput
                placeholder="Platform (e.g. LinkedIn)"
                style={tw`border border-gray-300 rounded-lg p-3 mb-1 text-gray-500`}
                value={link.platform}
                onChangeText={(text) => handleSocialLinkChange(index, "platform", text)}
              />
              <TextInput
                placeholder="URL"
                style={tw`border border-gray-300 rounded-lg p-3 text-gray-500`}
                value={link.url}
                onChangeText={(text) => handleSocialLinkChange(index, "url", text)}
              />
            </View>
          ))}
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-lg mb-3`}
            onPress={addSocialLinkField}
          >
            <Text style={tw`text-white text-center`}>+ Add Social Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-red-500 py-2 rounded-lg mb-2`}
            onPress={submitBusiness}
            disabled={loading}
          >
            <Text style={tw`text-white text-center font-bold`}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-gray-300 py-2 rounded-lg`}
            onPress={() => {
              resetForm();
              onClose();
            }}
          >
            <Text style={tw`text-center font-bold`}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddBusinessModal;