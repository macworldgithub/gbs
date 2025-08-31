import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage"; 
import { MaterialIcons } from "@expo/vector-icons";

const OfferDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOfferDetail = async () => {
    try {
      setLoading(true);

      const userData = await getUserData();
      const token = userData?.token; 

      const response = await axios.get(`${API_BASE_URL}/offer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffer(response.data);
    } catch (err) {
      console.error("Offer detail error:", err.response?.data || err.message);
      setError("Failed to fetch offer details");
      Alert.alert("Error", "Failed to fetch offer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>{error}</Text>
      </View>
    );
  }

  if (!offer) return null;

  return (
    <View style={tw`flex-1 bg-white mt-8`}>
      {/* Top Header */}
      <View style={tw`flex-row items-center bg-red-500 px-4 py-3 mt-8`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-lg font-bold`}>Offer Details</Text>
      </View>

      <ScrollView style={tw`flex-1 p-4`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>{offer.title}</Text>

        {offer.discount && (
          <Text style={tw`text-red-600 text-xl font-bold mb-4`}>
            {offer.discount}
          </Text>
        )}

        <Text style={tw`text-gray-700 text-base mb-4`}>{offer.description}</Text>

        <View style={tw`mb-4 bg-gray-50 p-3 rounded-lg shadow-sm`}>
          <Text style={tw`text-sm text-gray-500`}>Type: {offer.offerType}</Text>
          <Text style={tw`text-sm text-gray-500`}>Category: {offer.category}</Text>
          <Text style={tw`text-sm text-gray-500`}>
            Expires: {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : "-"}
          </Text>
        </View>

        {offer.termsAndConditions?.length > 0 && (
          <View style={tw`bg-gray-100 p-3 rounded-lg shadow-sm mb-4`}>
            <Text style={tw`font-bold text-gray-700 mb-2`}>Terms & Conditions</Text>
            {offer.termsAndConditions.map((term, idx) => (
              <Text key={idx} style={tw`text-xs text-gray-600`}>• {term}</Text>
            ))}
          </View>
        )}

        {offer.howToRedeem && (
          <View style={tw`bg-gray-100 p-3 rounded-lg shadow-sm mb-4`}>
            <Text style={tw`font-bold text-gray-700 mb-2`}>How to Redeem</Text>
            <Text style={tw`text-xs text-gray-600`}>{offer.howToRedeem}</Text>
          </View>
        )}

        <View style={tw`flex-row justify-between mt-4`}>
          {offer.contactPhone && (
            <TouchableOpacity
              style={tw`flex-1 bg-red-500 py-3 rounded-lg mr-2`}
              onPress={() => Linking.openURL(`tel:${offer.contactPhone}`)}
            >
              <Text style={tw`text-white text-center font-bold`}>Call</Text>
            </TouchableOpacity>
          )}
          {offer.contactEmail && (
            <TouchableOpacity
              style={tw`flex-1 bg-red-500 py-3 rounded-lg mr-2`}
              onPress={() => Linking.openURL(`mailto:${offer.contactEmail}`)}
            >
              <Text style={tw`text-white text-center font-bold`}>Email</Text>
            </TouchableOpacity>
          )}
          {offer.website && (
            <TouchableOpacity
              style={tw`flex-1 bg-red-500 py-3 rounded-lg`}
              onPress={() => Linking.openURL(offer.website)}
            >
              <Text style={tw`text-white text-center font-bold`}>Visit</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferDetails;
