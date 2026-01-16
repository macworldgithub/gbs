import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { API_BASE_URL } from "../../src/utils/config";
import { getUserData } from "../../src/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import NoticeboardTab from "./Noticeboard";

const tabs = ["All", "Member Offers", "Noticeboard"];

const contactInfo = [
  {
    phone: "0416 050 212",
    email: "scott@bossmanmedia.com.au",
    visitLink: "https://linkedin.com/company/bossmanmelb?originalSubdomain=au",
  },
  {
    phone: "0498 800 900",
    email: "angek@aussietel.com.au",
    visitLink: "https://www.aussietel.com.au/",
  },
  {
    email: "info@menzclub.com.au",
    visitLink: "https://menzclub.com.au/",
  },
];

const Offers = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState({});
  const [unsaving, setUnsaving] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserData();
      setUserId(userData?._id || null);
    };
    loadUser();
  }, []);

  const getFriendlyOfferMessage = (error) => {
    const backendMessage = error?.response?.data?.message;
    const statusCode = error?.response?.status;

    if (statusCode === 404 && backendMessage) return backendMessage;
    if (statusCode === 401)
      return "Your session has expired. Please log in again.";
    if (!error?.response)
      return "We couldn't connect to the server. Please check your internet.";
    return "No offers are available for you at the moment.";
  };

  const fetchOffers = async (tab) => {
    try {
      setLoading(true);
      setError(null);

      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        setError("No token found, please login again.");
        return;
      }

      let url = `${API_BASE_URL}/offer/search`;
      if (tab === "Member Offers") {
        url += "?offerType=Member";
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffers(res.data.offers ?? []);
    } catch (err) {
      const friendlyMessage = getFriendlyOfferMessage(err);
      setError(friendlyMessage);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "Noticeboard") {
      fetchOffers(activeTab);
    } else {
      setLoading(false);
      setError(null);
    }
  }, [activeTab]);

  const saveOffer = async (offerId) => {
    try {
      const isSaved = offers
        .find((o) => o._id === offerId)
        ?.savedBy?.includes(userId);

      const action = isSaved ? "unsave" : "save";
      const setAction = isSaved ? setUnsaving : setSaving;
      setAction((prev) => ({ ...prev, [offerId]: true }));

      const userData = await getUserData();
      const token = userData?.token;

      const url = `${API_BASE_URL}/offer/${offerId}/${action}`;
      await axios({
        method: action === "save" ? "post" : "delete",
        url,
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffers((prev) =>
        prev.map((offer) =>
          offer._id === offerId
            ? {
                ...offer,
                savedBy: isSaved
                  ? offer.savedBy.filter((id) => id !== userId)
                  : [...(offer.savedBy || []), userId],
              }
            : offer
        )
      );
    } catch {
      Alert.alert("Error", "Could not update offer");
    } finally {
      setSaving((prev) => ({ ...prev, [offerId]: false }));
      setUnsaving((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mt-14 mb-1 `}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800 mr-28`}>
          Exclusive offers
        </Text>
      </View>

      <Text style={tw`text-sm text-gray-600 mb-4`}>
        Member Benefits & Business Collaboration
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
              style={tw`text-sm font-medium ${
                activeTab === tab ? "text-white" : "text-gray-700"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "Noticeboard" ? (
        <NoticeboardTab />
      ) : (
        <>
          {loading && (
            <Text style={tw`text-center text-gray-500 mt-8`}>
              Loading offers...
            </Text>
          )}

          {error && !loading && (
            <View style={tw`mt-12 items-center px-6`}>
              <Text style={tw`text-base text-gray-700 text-center`}>
                {error}
              </Text>
            </View>
          )}

          {offers.map((offer, index) => (
            <TouchableOpacity
              key={offer._id}
              onPress={() =>
                navigation.navigate("OfferDetails", { id: offer._id })
              }
              activeOpacity={0.95}
            >
              <View
                style={tw`bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm`}
              >
                {/* Top Row: Title + Save Button */}
                <View style={tw`flex-row items-start justify-between mb-3`}>
                  <View style={tw`flex-1 mr-3`}>
                    <Text
                      style={tw`text-lg font-bold text-gray-900`}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {offer.title}
                    </Text>
                    {offer.discount && (
                      <Text style={tw`text-red-600 font-bold text-base mt-1`}>
                        {offer.discount}
                      </Text>
                    )}
                  </View>

                  {/* Save Button */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      saveOffer(offer._id);
                    }}
                    disabled={saving[offer._id] || unsaving[offer._id]}
                  >
                    <Ionicons
                      name={
                        offer.savedBy?.includes(userId)
                          ? "bookmark"
                          : "bookmark-outline"
                      }
                      size={26}
                      color={
                        offer.savedBy?.includes(userId) ? "#dc2626" : "#6b7280"
                      }
                    />
                  </TouchableOpacity>
                </View>

                {/* Business Name */}
                <Text style={tw`text-base text-gray-800 mt-1`}>
                  {offer.business?.companyName || "Good Blokes Society"}
                </Text>

                {/* Type + Category */}
                <View style={tw`flex-row items-center gap-3 mt-2`}>
                  <Text
                    style={tw`text-xs px-3 py-1.5 rounded-full font-medium ${
                      offer.offerType === "Member"
                        ? "bg-red-100 text-red-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {offer.offerType}
                  </Text>
                  <Text style={tw`text-sm text-gray-600`}>
                    {offer.category}
                  </Text>
                </View>

                {/* Description */}
                <Text
                  style={tw`text-sm text-gray-700 mt-3 leading-6`}
                  numberOfLines={4}
                >
                  {offer.description}
                </Text>

                {/* Contact Info */}
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
        </>
      )}
    </ScrollView>
  );
};

export default Offers;
