import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import gift1 from "../../assets/gift1.png";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

const contactInfo = [
  {
    phone: "0416 050 212",
    email: "scott@bossmanmedia.com.au",
    visitLink: "https://bossmanmedia.com.au/contact-us/",
  },
  {
    phone: "0498 800 900",
    email: "angek@aussietel.com.au",
    visitLink: "https://www.aussietel.com.au/contact/",
  },
  {
    email: "info@menzclub.com.au",
    visitLink: "https://menzclub.com.au/",
  },
];

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

      {offers.map((offer, index) => (
        <TouchableOpacity
          key={offer._id}
          onPress={() => navigation.navigate("OfferDetails", { id: offer._id })}
        >
          <View style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-2`}>
            {/* Top Row: Title */}
            <View style={tw`flex-row justify-between items-start`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`flex-1`}>
                  <Text
                    style={tw`text-base font-bold text-gray-800`}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {offer.title}
                  </Text>
                </View>
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

            <Text
              style={[tw`text-sm text-gray-600 mt-2`, { flexWrap: "wrap" }]}
            >
              {offer.description}
            </Text>
            <Text
              style={tw`text-sm text-gray-700 mt-3 leading-6`}
              numberOfLines={4}
            >
              <Text style={tw`font-bold text-red-600`}>How to Redeem: </Text>
              {offer.howToRedeem}
            </Text>

            {contactInfo[index] && (
              <View style={tw`mt-3`}>
                {contactInfo[index].phone && (
                  <Text
                    style={tw`text-sm text-blue-600 `}
                    onPress={() =>
                      Linking.openURL(`tel:${contactInfo[index].phone}`)
                    }
                  >
                    Phone: {contactInfo[index].phone}
                  </Text>
                )}
                {contactInfo[index].email && (
                  <Text
                    style={tw`text-sm text-blue-600 `}
                    onPress={() =>
                      Linking.openURL(`mailto:${contactInfo[index].email}`)
                    }
                  >
                    Email: {contactInfo[index].email}
                  </Text>
                )}
                {/* {contactInfo[index].visitLink && (
                  <Text
                    style={tw`text-sm text-blue-600 `}
                    onPress={() =>
                      Linking.openURL(contactInfo[index].visitLink)
                    }
                  >
                    Visit link
                  </Text>
                )} */}
                {contactInfo[index].visitLink && (
                  <TouchableOpacity
                    style={tw`bg-red-500 px-4 py-2 mt-2 rounded-full items-center`}
                    onPress={() =>
                      Linking.openURL(contactInfo[index].visitLink)
                    }
                  >
                    <Text style={tw`text-white font-semibold`}>Redeem</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SavedOffers;
