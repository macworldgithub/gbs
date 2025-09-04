import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import gift1 from "../../assets/gift1.png";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

const SavedOffers = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = await getUserData();
        const token = userData?.token;

        if (!token) {
          setError("No token found, please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/offer/saved`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("✅ Saved Offers Response:", data);

        // Handle if API sends offers in an object
        if (Array.isArray(data)) {
          setOffers(data);
        } else if (Array.isArray(data.offers)) {
          setOffers(data.offers);
        } else {
          setOffers([]);
        }
      } catch (err) {
        console.log("❌ Error fetching saved offers:", err);
        setError("Failed to load saved offers");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOffers();
  }, []);

  return (
    <ScrollView style={{ padding: 20, marginTop: 20, marginBottom: 40 }}>
      {/* Header with back button */}
      <View style={tw`flex-row items-center justify-between mt-8 mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Saved Offers</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && <ActivityIndicator size="large" color="red" />}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

      {!loading && offers.length === 0 && (
        <Text style={{ marginTop: 20, color: "gray" }}>
          No saved offers found
        </Text>
      )}

      {offers.map((offer) => (
        <TouchableOpacity
          key={offer._id}
          onPress={() => navigation.navigate("OfferDetails", { id: offer._id })}
        >
          <View style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-2`}>
            {/* Top Row: Title */}
            <View style={tw`flex-row justify-between items-start`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-red-500 mr-2`}>
                  <Image source={gift1} />
                </View>
                <Text style={tw`text-base font-bold text-gray-800`}>
                  {offer.title}
                </Text>
              </View>
            </View>

            <Text style={tw`text-red-600 font-bold text-sm mt-1`}>
              {offer.discount}
            </Text>

            <Text style={tw`text-sm text-gray-800 mt-1`}>
              {offer.business?.companyName || ""}
            </Text>

            <View style={tw`flex-row items-center mt-1`}>
              <Text
                style={tw`text-xs px-2 py-1 rounded-full ${
                  offer.offerType === "Member"
                    ? "bg-red-100 text-red-600"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {offer.offerType}
              </Text>
              <Text style={tw`text-xs text-gray-500 ml-2`}>
                {offer.category}
              </Text>
            </View>

            <Text style={tw`text-sm text-gray-600 mt-2`}>
              {offer.description}
            </Text>

            {offer.termsAndConditions?.length > 0 && (
              <View style={tw`bg-gray-100 p-2 rounded mt-3`}>
                {offer.termsAndConditions.map((term, idx) => (
                  <Text key={idx} style={tw`text-xs text-gray-500`}>
                    • {term}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SavedOffers;
