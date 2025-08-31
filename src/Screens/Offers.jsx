import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { API_BASE_URL } from "../../src/utils/config";
import { getUserData } from "../../src/utils/storage"; // <-- Added
import gift1 from "../../assets/gift1.png";

const tabs = ["All", "Member Offers", "Partner Deals"];

const Offers = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async (tab) => {
    try {
      setLoading(true);
      setError(null);

      // Get user token
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        setError("No token found, please login again.");
        setLoading(false);
        return;
      }

      let url = `${API_BASE_URL}/offer/search`;
      if (tab === "Member Offers") {
        url += `?offerType=Member`;
      } else if (tab === "Partner Deals") {
        url += `?offerType=Partner`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }, // <-- Added Authorization header
      });

      setOffers(res.data.offers || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(activeTab);
  }, [activeTab]);

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mt-14 mb-1`}>
        <Text style={tw`text-xl font-bold text-gray-800`}>Exclusive offers</Text>
        <TouchableOpacity
          style={tw`bg-red-500 py-2 px-4 rounded-lg`}
          onPress={() => navigation.navigate("AddOffer")}
        >
          <Text style={tw`text-white text-base font-semibold`}>+ Add Offer</Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`text-sm text-gray-600 mb-4`}>
        Member Benefits & Partner Deals
      </Text>

      {/* Tabs */}
      <View style={tw`flex-row mb-4`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw`px-4 py-2 mr-2 rounded-full ${
              activeTab === tab ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            <Text
              style={tw`text-sm ${
                activeTab === tab ? "text-white" : "text-gray-700"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading/Error */}
      {loading && <Text style={tw`text-center text-gray-500`}>Loading...</Text>}
      {error && <Text style={tw`text-center text-red-500`}>{error}</Text>}

      {/* No Offers */}
      {!loading && offers.length === 0 && !error && (
        <Text style={tw`text-center text-gray-500 mt-6`}>
          No offers available for "{activeTab}" right now. Please check back later!
        </Text>
      )}

      {/* Offers List */}
      {offers.map((offer) => (
        <TouchableOpacity
          key={offer._id}
          onPress={() => navigation.navigate("OfferDetails", { id: offer._id })}
        >
          <View style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-4`}>
            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-row justify-start`}>
                <View style={tw`bg-red-500 mr-2`}>
                  <Image source={gift1} />
                </View>
                <Text style={tw`text-base font-bold text-gray-800`}>
                  {offer.title}
                </Text>
              </View>
              <Text style={tw`text-red-600 font-bold text-sm`}>
                {offer.discount}
              </Text>
            </View>

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
              <Text style={tw`text-xs text-gray-500 ml-2`}>{offer.category}</Text>
            </View>

            <Text style={tw`text-sm text-gray-600 mt-2`}>
              {offer.description}
            </Text>

            {/* <View style={tw`flex-row justify-between items-center mt-3`}>
              <Text style={tw`text-xs text-gray-500`}>
                Expires:{" "}
                {offer.expiryDate
                  ? new Date(offer.expiryDate).toLocaleDateString()
                  : "-"}
              </Text>
              <TouchableOpacity style={tw`bg-red-500 px-4 py-2 rounded`}>
                <Text style={tw`text-white text-sm`}>Redeem</Text>
              </TouchableOpacity>
            </View> */}

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

export default Offers;
