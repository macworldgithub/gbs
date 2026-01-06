import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { API_BASE_URL } from "../../src/utils/config";
import { getUserData } from "../../src/utils/storage";
import gift1 from "../../assets/gift1.png";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

const tabs = ["All", "Member Offers", "Noticeboard"];

const Offers = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState({});
  const [unsaving, setUnsaving] = useState({});
  const [userId, setUserId] = useState(null);
  const [noticeInput, setNoticeInput] = useState("");

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

    // 404 but valid response (like "no active package")
    if (statusCode === 404 && backendMessage) {
      return backendMessage;
    }

    // Token / auth issues
    if (statusCode === 401) {
      return "Your session has expired. Please log in again.";
    }

    // Network issue
    if (!error?.response) {
      return "We couldn’t connect to the server. Please check your internet.";
    }

    // Fallback
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
      console.error("Fetch offers error:", err?.response?.data || err.message);

      const friendlyMessage = getFriendlyOfferMessage(err);
      setError(friendlyMessage);
      setOffers([]); // important to clear old data
    } finally {
      setLoading(false);
    }
  };

  const saveOffer = async (offerId) => {
    try {
      const isSaved = offers
        .find((offer) => offer._id === offerId)
        ?.savedBy?.includes(userId);
      const action = isSaved ? "unsave" : "save";
      const setAction = isSaved ? setUnsaving : setSaving;
      setAction((prev) => ({ ...prev, [offerId]: true }));

      const userData = await getUserData();
      const token = userData?.token;

      if (!token || !userId) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      // ✅ Updated API URLs (no userId in path)
      const url = `${API_BASE_URL}/offer/${offerId}/${action}`;
      console.log(`Performing ${action} offer:`, url);

      const res = await axios({
        method: action === "save" ? "post" : "delete",
        url: url,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`${action} Offer Response:`, res.status, res.data);

      if (res.status === 200 || res.status === 201) {
        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer._id === offerId
              ? {
                  ...offer,
                  savedBy:
                    action === "save"
                      ? [...(offer.savedBy || []), userId]
                      : offer.savedBy.filter((id) => id !== userId),
                }
              : offer
          )
        );

        if (action === "save") {
          Alert.alert("Success", "This offer is saved");
        } else {
          Alert.alert("Success", "This offer is unsaved");
        }
      } else {
        Alert.alert("Error", `Failed to ${action} offer`);
      }
    } catch (err) {
      console.error(
        `Error ${isSaved ? "unsaving" : "saving"} offer:`,
        err.response?.status,
        err.response?.data || err.message
      );
      Alert.alert("Error", `Could not ${isSaved ? "unsave" : "save"} offer`);
    } finally {
      setSaving((prev) => ({ ...prev, [offerId]: false }));
      setUnsaving((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  // useEffect(() => {
  //   fetchOffers(activeTab);
  // }, [activeTab]);
  useEffect(() => {
    if (activeTab !== "Noticeboard") {
      fetchOffers(activeTab);
    } else {
      setError(null);
      setLoading(false);
    }
  }, [activeTab]);

  const submitNotice = async () => {
    if (!noticeInput.trim()) {
      Alert.alert("Error", "Please type something before submitting.");
      return;
    }

    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/notification`,
        {
          title: "New Noticeboard Request",
          message: noticeInput.trim(),
          SendToAll: true, // ← This sends to EVERYONE
          area: null,
          roles: [],
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Your noticeboard post has been submitted!");
      setNoticeInput("");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to submit post. Please try again.");
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mt-14 mb-1`}>
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
      {/* {error && <Text style={tw`text-center text-red-500`}>{error}</Text>}
       */}
      {error && activeTab !== "Noticeboard" && !loading && (
        <View style={tw`mt-6 items-center`}>
          <Text style={tw`text-gray-700 text-base text-center`}>{error}</Text>
          <Text style={tw`text-gray-400 text-sm mt-1 text-center`}>
            You’ll see offers here once they become available.
          </Text>
        </View>
      )}

      {/* No Offers */}
      {/* NOTICEBOARD VIEW */}
      {activeTab === "Noticeboard" ? (
        <View style={tw`mt-4`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>
            Welcome to the GBS Noticeboard
          </Text>

          <Text style={tw`text-sm text-gray-600 mb-4`}>
            Looking for a trusted service, product, or business collaboration?
            Post your request here and tap into the expertise and connections of
            the GBS community. This is your space for member-to-member support
            and collaboration.
          </Text>

          {/* Text Input */}
          <View style={tw`border border-gray-300 rounded-lg p-3 mb-4`}>
            <Text style={tw`text-sm text-gray-500 mb-1`}>Your Message</Text>
            <TextInput
              multiline
              numberOfLines={5}
              style={tw`text-base text-gray-800`}
              placeholder="Type your request here..."
              value={noticeInput}
              onChangeText={setNoticeInput}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={tw`bg-red-500 py-3 rounded-lg`}
            onPress={submitNotice}
          >
            <Text style={tw`text-center text-white font-bold text-base`}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* REGULAR OFFER LIST */}
          {!loading && offers.length === 0 && !error && (
            <Text style={tw`text-center text-gray-500 mt-6`}>
              No offers available for "{activeTab}" right now.
            </Text>
          )}

          {offers.map((offer) => (
            <TouchableOpacity
              key={offer._id}
              onPress={() =>
                navigation.navigate("OfferDetails", { id: offer._id })
              }
            >
              <View
                style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-4`}
              >
                {/* Top Row: Title + Save Icon */}
                <View style={tw`flex-row justify-between items-start`}>
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-red-500 mr-2`}>
                      <Image source={gift1} />
                    </View>
                    <Text style={tw`text-base font-bold text-gray-800`}>
                      {offer.title}
                    </Text>
                  </View>

                  {/* Save/Unsave Icon */}
                  <TouchableOpacity onPress={() => saveOffer(offer._id)}>
                    <Icon
                      name={
                        offer.savedBy?.includes(userId)
                          ? "bookmark"
                          : "bookmark-outline"
                      }
                      size={22}
                      color={offer.savedBy?.includes(userId) ? "red" : "gray"}
                      disabled={saving[offer._id] || unsaving[offer._id]}
                    />
                  </TouchableOpacity>
                </View>

                {/* Discount under Title */}
                <Text style={tw`text-red-600 font-bold text-sm mt-1`}>
                  {offer.discount}
                </Text>

                {/* Company Name */}
                <Text style={tw`text-sm text-gray-800 mt-1`}>
                  {offer.business?.companyName || ""}
                </Text>

                {/* Offer Type + Category */}
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

                {/* Description */}
                <Text style={tw`text-sm text-gray-600 mt-2`}>
                  {offer.description}
                </Text>

                {/* Terms & Conditions */}
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
        </>
      )}
    </ScrollView>
  );
};

export default Offers;
