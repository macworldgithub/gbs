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

const tabs = ["All", "Noticeboard"];

const businessContactMap = {
  bossman: {
    phone: "0416 050 212",
    email: "scott@bossmanmedia.com.au",
    visitLink: "https://bossmanmedia.com.au/contact-us/",
  },
  aussietel: {
    phone: "0498 800 900",
    email: "angek@aussietel.com.au",
    visitLink: "https://www.aussietel.com.au/contact/",
  },
  menzclub: {
    email: "info@menzclub.com.au",
    visitLink: "https://menzclub.com.au/",
  },
};

const getContactInfo = (businessName) => {
  if (!businessName) return null;
  const lowerName = businessName.toLowerCase();
  if (lowerName.includes("bossman")) return businessContactMap.bossman;
  if (lowerName.includes("aussietel")) return businessContactMap.aussietel;
  if (lowerName.includes("menzclub")) return businessContactMap.menzclub;
  return null;
};

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

    // If server explicitly returned a message for not-found, show it
    if (statusCode === 404 && backendMessage) return backendMessage;

    // Session expired
    if (statusCode === 401)
      return "Your session has expired. Please log in again.";

    // Permission / forbidden — show a friendly Urdu message explaining top-tier requirement
    if (statusCode === 403) {
      // Show a formal English message explaining the Top Tier requirement
      return "You do not have a Top Tier Business package. Exclusive offers are available only to Top Tier members — please upgrade your package to view them.";
    }

    // No response object — likely network error
    if (!error?.response)
      return "We couldn't connect to the server. Please check your internet.";

    // Fallback
    return backendMessage || "No offers are available for you at the moment.";
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
            : offer,
        ),
      );
    } catch {
      Alert.alert("Error", "Could not update offer");
    } finally {
      setSaving((prev) => ({ ...prev, [offerId]: false }));
      setUnsaving((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  const renderClickableHowToRedeem = (text) => {
    if (!text) return null;

    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const phoneRegex = /(?:\+?61|0)[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}/g;

    const parts = [];
    let lastIndex = 0;

    const allMatches = [];

    // Find all emails
    let match;
    while ((match = emailRegex.exec(text)) !== null) {
      allMatches.push({ type: "email", text: match[0], index: match.index });
    }

    // Find all phones
    while ((match = phoneRegex.exec(text)) !== null) {
      allMatches.push({ type: "phone", text: match[0], index: match.index });
    }

    // Sort by position
    allMatches.sort((a, b) => a.index - b.index);

    allMatches.forEach(({ type, text: matchText, index }) => {
      // Add text before the match
      if (index > lastIndex) {
        parts.push(
          <Text
            key={`text-${parts.length}`}
            style={tw`text-sm text-gray-700 leading-6`}
          >
            {text.slice(lastIndex, index)}
          </Text>,
        );
      }

      // Add line break + clickable contact on new line
      parts.push(<Text key={`break-${parts.length}`}>{"\n"}</Text>);

      parts.push(
        <Text
          key={`link-${parts.length}`}
          style={tw`text-sm text-blue-600 font-medium`}
          onPress={() => {
            if (type === "email") {
              Linking.openURL(`mailto:${matchText}`);
            } else {
              const cleanPhone = matchText.replace(/[\s-]/g, "");
              Linking.openURL(`tel:${cleanPhone}`);
            }
          }}
        >
          {type === "phone" ? "Phone: " : "Email: "}
          {matchText}
        </Text>,
      );

      lastIndex = index + matchText.length;
    });

    // Remaining text
    if (lastIndex < text.length) {
      parts.push(
        <Text key={`text-end`} style={tw`text-sm text-gray-700 leading-6`}>
          {text.slice(lastIndex)}
        </Text>,
      );
    }

    return parts;
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

          {!loading && !error && offers.length === 0 && (
            <View style={tw`mt-12 items-center px-6`}>
              <Text style={tw`text-base text-gray-700 text-center`}>
                No offers are available for you at the moment.
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
                <Text style={tw`text-base text-gray-800 mt-1 font-bold`}>
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
                {/* Description */}
                <Text
                  style={tw`text-sm text-gray-700 mt-3 leading-6`}
                  numberOfLines={4}
                >
                  {offer.description}
                </Text>

                {/* How to Redeem */}
                <Text
                  style={tw`text-sm text-gray-700 mt-3 leading-6`}
                  numberOfLines={10} // Increased
                >
                  <Text style={tw`font-bold text-red-600`}>
                    How to Redeem:{" "}
                  </Text>
                  {renderClickableHowToRedeem(offer.howToRedeem)}
                </Text>

                {/* Contact Info */}
                {getContactInfo(offer.business?.companyName) && (
                  <View style={tw`mt-3`}>
                    {/* {getContactInfo(offer.business?.companyName)?.phone && (
                      <Text
                        style={tw`text-sm text-blue-600 `}
                        onPress={() =>
                          Linking.openURL(
                            `tel:${getContactInfo(offer.business?.companyName)?.phone}`,
                          )
                        }
                      >
                        Phone:{" "}
                        {getContactInfo(offer.business?.companyName)?.phone}
                      </Text>
                    )} */}
                    {/* {getContactInfo(offer.business?.companyName)?.email && (
                      <Text
                        style={tw`text-sm text-blue-600 `}
                        onPress={() =>
                          Linking.openURL(
                            `mailto:${getContactInfo(offer.business?.companyName)?.email}`,
                          )
                        }
                      >
                        Email:{" "}
                        {getContactInfo(offer.business?.companyName)?.email}
                      </Text>
                    )} */}
                    {getContactInfo(offer.business?.companyName)?.visitLink && (
                      <TouchableOpacity
                        style={tw`bg-red-500 px-4 py-2 mt-2 rounded-full items-center`}
                        onPress={() =>
                          Linking.openURL(
                            getContactInfo(offer.business?.companyName)
                              ?.visitLink,
                          )
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
