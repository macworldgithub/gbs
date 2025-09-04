import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../../src/utils/config";
import { getUserData } from "../../src/utils/storage";
import OfferCard from "./OfferCard";
const BusinessDetail = ({ route, navigation }) => {
  const { id } = route.params;
  const [business, setBusiness] = useState(null);
  const [offers, setOffers] = useState([]); // State for offers
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true); // Separate loading state for offers

  const fetchBusinessDetail = async () => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch business details
      const res = await axios.get(`${API_BASE_URL}/business/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBusiness(res.data);
    } catch (err) {
      console.error(
        "Business detail error:",
        err.response?.data || err.message
      );
      Alert.alert("Error", "Failed to fetch business details");
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.get(`${API_BASE_URL}/offer/business/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("[Offers for Business]", id, res.data); // Debug log
      setOffers(res.data); // Set offers from API response
    } catch (err) {
      console.error("Offers fetch error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to fetch offers");
    } finally {
      setOffersLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetail();
    fetchOffers(); // Fetch offers when component mounts
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`text-lg text-gray-600`}>Loading...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center px-4`}>
        <Text style={tw`text-lg text-gray-600 text-center mb-4`}>
          No details found
        </Text>
        <TouchableOpacity
          style={tw`bg-red-500 px-6 py-3 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white font-medium`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }


  const handleDeleteGalleryImage = async (imageUrl) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const userData = await getUserData();
              const token = userData?.token;

              if (!token) {
                Alert.alert("Error", "No authentication token found");
                return;
              }

              // Extract the file key from the image URL
              const urlParts = imageUrl.split('/');
              const fileKey = urlParts[urlParts.length - 1];

              // Make the API call to delete the image
              const response = await fetch(
                `${API_BASE_URL}/business/${id}/gallery`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    action: "remove",
                    fileKey: fileKey
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to delete image");
              }

              // Refresh the business details to show updated gallery
              fetchBusinessDetail();
              Alert.alert("Success", "Image deleted successfully!");
            } catch (error) {
              console.error("Delete image error:", error);
              Alert.alert("Error", "Failed to delete image");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`bg-white border-b border-gray-200 pt-14 pb-4 px-4`}>
        <TouchableOpacity
          style={tw`absolute top-14 left-4 z-10`}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#DC2626" />
        </TouchableOpacity>
        <Text style={tw`text-center text-lg font-bold text-gray-800`}>
          Business Details
        </Text>
      </View>

      <ScrollView style={tw`flex-1 px-4 py-4`}>
        {/* Company Info */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center mb-4`}>
            {business.logo ? (
              <Image
                source={{ uri: business.logo }}
                style={tw`w-16 h-16 rounded-xl mr-4`}
              />
            ) : (
              <View
                style={tw`w-16 h-16 rounded-xl mr-4 bg-gray-200 justify-center items-center`}
              >
                <MaterialIcons name="business" size={24} color="#6B7280" />
              </View>
            )}

            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>
                {business.companyName}
              </Text>
              <Text style={tw`text-sm text-gray-500`}>
                by {business.user?.name}
              </Text>
            </View>
          </View>

          {/* Rating & Location */}
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`flex-row items-center mr-4`}>
              <MaterialIcons name="star" size={16} color="#F59E0B" />
              <Text style={tw`text-sm text-gray-700 ml-1`}>
                {business.rating || "N/A"}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <MaterialIcons name="location-on" size={16} color="#6B7280" />
              <Text style={tw`text-sm text-gray-700 ml-1`}>
                {business.city}, {business.state}
              </Text>
            </View>
          </View>

          {/* About */}
          <Text style={tw`text-base text-gray-700 leading-6`}>
            {business.about}
          </Text>
        </View>

        {/* Services */}
        {business.services && business.services.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
              Services
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {business.services.map((service, index) => (
                <View
                  key={index}
                  style={tw`bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2`}
                >
                  <Text style={tw`text-sm text-gray-700`}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Industries Served */}
        {business.industriesServed && business.industriesServed.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
              Industries Served
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {business.industriesServed.map((industry, index) => (
                <View
                  key={index}
                  style={tw`bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2`}
                >
                  <Text style={tw`text-sm text-gray-700`}>{industry}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Looking For */}
        {business.lookingFor && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
              Looking For
            </Text>
            <Text style={tw`text-base text-gray-700 leading-6`}>
              {business.lookingFor}
            </Text>
          </View>
        )}

        {/* Members */}
       <View style={tw`mb-6`}>
  <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
    Members
  </Text>
  {business.members.map((member, index) => (
    <View
      key={member._id || index}
      style={tw`flex-row items-center justify-between mb-3`}
    >
      {/* Left side: avatar + name */}
      <View style={tw`flex-row items-center`}>
        <Image
          source={
            member.avatarUrl
              ? { uri: member.avatarUrl }
              : require("../../assets/profile.png") // fallback image
          }
          style={tw`w-10 h-10 rounded-full mr-3`}
        />
        <Text style={tw`text-base text-gray-700`}>{member.name}</Text>
      </View>

      {/* Right side: three dots */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Member Options",
            `Choose action for ${member.name}`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  try {
                    const userData = await getUserData();
                    const token = userData?.token;
                    if (!token) {
                      Alert.alert("Error", "No authentication token found");
                      return;
                    }

                    const response = await fetch(
                      `${API_BASE_URL}/business/${business._id}/members/${member._id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed to delete member");
                    }

                    // Refresh members list
                    fetchBusinessDetail();
                    Alert.alert("Success", "Member deleted successfully!");
                  } catch (error) {
                    console.error("Delete member error:", error);
                    Alert.alert("Error", "Failed to delete member");
                  }
                },
              },
            ]
          );
        }}
      >
        <Entypo name="dots-three-vertical" size={18} color="gray" />
      </TouchableOpacity>
    </View>
  ))}
</View>



        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Offers</Text>
          {offersLoading ? (
            <Text style={tw`text-sm text-gray-600`}>Loading offers...</Text>
          ) : offers.length > 0 ? (
            offers.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                onOfferUpdated={fetchOffers} // refresh after update
                onOfferDeleted={(deletedId) =>
                  setOffers((prev) => prev.filter((o) => o._id !== deletedId))
                }
              />
            ))
          ) : (
            <Text style={tw`text-sm text-gray-600`}>No offers available</Text>
          )}
        </View>

        {/* Social Links */}
        {business.socialLinks && business.socialLinks.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
              Social Links
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {business.socialLinks.map((link) => {
                let iconName;
                let iconType = "FontAwesome5";

                switch (link.platform.toLowerCase()) {
                  case "linkedin":
                    iconName = "linkedin";
                    break;
                  case "facebook":
                    iconName = "facebook";
                    break;
                  case "instagram":
                    iconName = "instagram";
                    break;
                  case "twitter":
                    iconName = "twitter";
                    break;
                  case "youtube":
                    iconName = "youtube";
                    break;
                  default:
                    iconName = "link";
                    iconType = "MaterialIcons";
                }

                return (
                  <TouchableOpacity
                    key={link._id}
                    style={tw`mr-4 mb-2`}
                    onPress={() => Linking.openURL(link.url)}
                  >
                    {iconType === "FontAwesome5" ? (
                      <FontAwesome5 name={iconName} size={24} color="#DC2626" />
                    ) : (
                      <MaterialIcons
                        name={iconName}
                        size={24}
                        color="#DC2626"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Contact Actions */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Contact</Text>
          <View style={tw`flex-row mb-4`}>
            <TouchableOpacity
              style={tw`flex-1 bg-red-500 rounded-lg py-3 items-center mr-3`}
              onPress={() => {
                if (business.phone) {
                  Linking.openURL(`tel:${business.phone}`);
                } else {
                  Alert.alert(
                    "No phone available",
                    "This business doesn't have a phone number listed."
                  );
                }
              }}
            >
              <Text style={tw`text-white font-medium`}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-1 bg-red-500 rounded-lg py-3 items-center`}
              onPress={() => {
                if (business.email) {
                  Linking.openURL(`mailto:${business.email}`);
                } else {
                  Alert.alert(
                    "No email available",
                    "This business doesn't have an email listed."
                  );
                }
              }}
            >
              <Text style={tw`text-white font-medium`}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* Website Link */}
          {business.website && (
            <TouchableOpacity
              style={tw`bg-gray-100 rounded-lg p-3 items-center`}
              onPress={() => Linking.openURL(business.website)}
            >
              <Text style={tw`text-blue-600 font-medium`}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Gallery */}
        {business.gallery && business.gallery.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {business.gallery.map((imgUrl, index) => (
                <View key={index} style={tw`relative mr-3`}>
                  <Image
                    source={{ uri: imgUrl }}
                    style={tw`w-64 h-40 rounded-lg`}
                    resizeMode="cover"
                  />
                  {/* Three dots menu button */}
                  <TouchableOpacity
                    style={tw`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1`}
                    onPress={() => handleDeleteGalleryImage(imgUrl)}
                  >
                    <MaterialIcons name="more-vert" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Testimonials */}
        {business.testimonials && business.testimonials.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
              Testimonials
            </Text>
            {business.testimonials.map((testimonial, index) => (
              <View key={testimonial._id || index} style={tw`mb-4 last:mb-0`}>
                <Text style={tw`text-gray-700 italic text-base leading-6 mb-2`}>
                  "{testimonial.text}"
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                  — {testimonial.from}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BusinessDetail;
