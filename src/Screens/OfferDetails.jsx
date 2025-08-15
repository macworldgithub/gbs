// src/screens/OfferDetails/index.js
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";


const OfferDetails = ({ route }) => {
  const { id } = route.params;
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/offer/${id}`)
      .then((res) => {
        setOffer(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch offer details");
        setLoading(false);
      });
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

  if (!offer) {
    return null;
  }

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>{offer.title}</Text>
      <Text style={tw`text-red-600 font-bold text-lg mb-2`}>{offer.discount}</Text>
      <Text style={tw`text-sm text-gray-600 mb-4`}>{offer.description}</Text>

      <View style={tw`mb-3`}>
        <Text style={tw`text-sm text-gray-500`}>Type: {offer.offerType}</Text>
        <Text style={tw`text-sm text-gray-500`}>Category: {offer.category}</Text>
        <Text style={tw`text-sm text-gray-500`}>
          Expires: {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : "-"}
        </Text>
      </View>

      {offer.termsAndConditions?.length > 0 && (
        <View style={tw`bg-gray-100 p-3 rounded mb-3`}>
          <Text style={tw`font-bold text-gray-700 mb-2`}>Terms & Conditions</Text>
          {offer.termsAndConditions.map((term, idx) => (
            <Text key={idx} style={tw`text-xs text-gray-500`}>• {term}</Text>
          ))}
        </View>
      )}

      {offer.howToRedeem && (
        <View style={tw`bg-gray-100 p-3 rounded mb-3`}>
          <Text style={tw`font-bold text-gray-700 mb-2`}>How to Redeem</Text>
          <Text style={tw`text-xs text-gray-500`}>{offer.howToRedeem}</Text>
        </View>
      )}

      {offer.contactPhone && (
        <Text style={tw`text-sm text-gray-500 mb-1`}>📞 {offer.contactPhone}</Text>
      )}
      {offer.contactEmail && (
        <Text style={tw`text-sm text-gray-500 mb-1`}>📧 {offer.contactEmail}</Text>
      )}

      {offer.locations?.length > 0 && (
        <Text style={tw`text-sm text-gray-500`}>📍 {offer.locations.join(", ")}</Text>
      )}
    </ScrollView>
  );
};

export default OfferDetails;
