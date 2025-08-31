import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../src/utils/config";
import { getUserData } from "../src/utils/storage";
import tw from "tailwind-react-native-classnames";

const EditBusinessModal = ({ visible, onClose, business, onBusinessUpdated }) => {
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [services, setServices] = useState("");
  const [phone, setPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);

  useEffect(() => {
    if (business) {
      setCompanyName(business.companyName || "");
      setTitle(business.title || "");
      setAbout(business.about || "");
      setServices(business.services ? business.services.join(", ") : "");
      setPhone(business.phone || "");
      setSocialLinks(business.socialLinks?.length ? business.socialLinks : [{ platform: "", url: "" }]);
    }
  }, [business]);

  const handleUpdate = async () => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        Alert.alert("Error", "No token found, please login again.");
        return;
      }

      const payload = {
        companyName,
        title,
        about,
        services: services.split(",").map((s) => s.trim()),
        phone,
        socialLinks,
      };

      await axios.patch(`${API_BASE_URL}/business/${business._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Business updated successfully!");
      onBusinessUpdated(); // refresh list
      onClose();
    } catch (error) {
      console.error("Error updating business:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update business");
    }
  };

  const handleSocialChange = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black bg-opacity-40 justify-center`}>
        <View style={tw`bg-white rounded-xl p-5 mx-4`}>
          <Text style={tw`text-lg font-bold mb-3 text-gray-800`}>
            Edit Business
          </Text>

          <ScrollView>
            <TextInput
              placeholder="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              style={tw`border p-2 rounded mb-3`}
            />
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={tw`border p-2 rounded mb-3`}
            />
            <TextInput
              placeholder="About"
              value={about}
              onChangeText={setAbout}
              style={tw`border p-2 rounded mb-3`}
              multiline
            />
            <TextInput
              placeholder="Services (comma separated)"
              value={services}
              onChangeText={setServices}
              style={tw`border p-2 rounded mb-3`}
            />
            <TextInput
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              style={tw`border p-2 rounded mb-3`}
            />

            <Text style={tw`font-semibold text-gray-700 mb-2`}>
              Social Links
            </Text>
            {socialLinks.map((link, index) => (
              <View key={index} style={tw`mb-3`}>
                <TextInput
                  placeholder="Platform (e.g. LinkedIn)"
                  value={link.platform}
                  onChangeText={(val) => handleSocialChange(index, "platform", val)}
                  style={tw`border p-2 rounded mb-2`}
                />
                <TextInput
                  placeholder="URL"
                  value={link.url}
                  onChangeText={(val) => handleSocialChange(index, "url", val)}
                  style={tw`border p-2 rounded`}
                />
              </View>
            ))}
          </ScrollView>

          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity
              style={tw`bg-gray-400 px-4 py-2 rounded-lg`}
              onPress={onClose}
            >
              <Text style={tw`text-white font-bold`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-red-500 px-4 py-2 rounded-lg`}
              onPress={handleUpdate}
            >
              <Text style={tw`text-white font-bold`}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditBusinessModal;
