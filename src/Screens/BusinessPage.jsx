import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../src/utils/config";
import { getUserData } from "../../src/utils/storage";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Alert,
  Modal,
} from "react-native";
import AddBusinessModal from "../../components/AddBusinessModal";
import tw from "tailwind-react-native-classnames";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

const API_URL = `${API_BASE_URL}/business/search`;

const BusinessPage = ({ navigation }) => {
  const [businessListings, setBusinessListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [noPackage, setNoPackage] = useState(false);
  const [packagesModalVisible, setPackagesModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [showFeatured, setShowFeatured] = useState(false);

  useEffect(() => {
    if (isFocused) {
      // Log current package from storage when page gains focus
      (async () => {
        try {
          const stored = await AsyncStorage.getItem("currentPackage");
          if (stored) {
            console.log(
              "[BusinessPage] currentPackage (focus):",
              JSON.parse(stored)
            );
          } else {
            console.log("[BusinessPage] currentPackage (focus): none");
          }
        } catch (e) {
          console.log("[BusinessPage] Error reading currentPackage:", e);
        }
      })();
      fetchBusinesses();
    }
  }, [isFocused]);

  // Listen for focus events to refresh when coming back from other screens
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Force refresh user data and check package status when screen comes into focus
      refreshUserData().then(() => {
        fetchBusinesses();
      });
    });

    return unsubscribe;
  }, [navigation]);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        setError("No token found, please login again.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter only Business and Top Tier Business roles
      const businessRoles = response.data.filter(
        (role) => role.name === "business" || role.name === "top_tier_business"
      );

      setRoles(businessRoles);
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response?.data || error.message
      );
      setError("Failed to fetch package options");
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch featured businesses
  const fetchFeaturedBusinesses = async () => {
    try {
      setLoading(true);
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        setError("No token found, please login again.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/business/featured`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeaturedBusinesses(response.data || []);
      setShowFeatured(true);
    } catch (error) {
      console.error(
        "Error fetching featured businesses:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to fetch featured businesses");
    } finally {
      setLoading(false);
    }
  };

  // Handle package selection and API call
  const handlePackageSelection = (role) => {
    setPackagesModalVisible(false);
    setSelectedPackage(null);

    navigation.navigate("StripeCheckout", {
      roleId: role._id,
      label: role.label,
      months: 12,
      trial: false,
      startDate: new Date().toISOString(),
    });
  };

  // Refresh user data from server (via /user?id=<userId>)
  const refreshUserData = async () => {
    try {
      const userData = await getUserData();
      const token = userData?.token;
      const userId = userData?._id;

      if (!token || !userId) {
        return null;
      }

      // Fetch fresh user data from server using query param id
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id: userId },
      });

      if (response.data) {
        // Update stored user data
        const updatedUserData = { ...userData, ...response.data };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
        return updatedUserData;
      }

      return userData;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  };

  // Check if user has an active package
  const checkUserPackage = async () => {
    try {
      // First try to refresh user data to get the latest package information
      let userData = await refreshUserData();
      if (!userData) {
        userData = await getUserData();
      }

      const token = userData?.token;

      if (!token) {
        setError("No token found, please login again.");
        return false;
      }

      // Check if user has an activated package
      if (!userData.activatedPackage) {
        console.log("No activated package found in user data");
        setNoPackage(true);
        setBusinessListings([]);
        setLoading(false); // Ensure loading is set to false
        return false;
      }

      // Check if package has required fields
      if (
        !userData.activatedPackage.role ||
        !userData.activatedPackage.endDate
      ) {
        console.log(
          "Package missing required fields:",
          userData.activatedPackage
        );
        setNoPackage(true);
        setBusinessListings([]);
        setLoading(false); // Ensure loading is set to false
        return false;
      }

      // Additional check: verify package is still active
      const currentDate = new Date();
      const packageEndDate = new Date(userData.activatedPackage.endDate);

      if (currentDate > packageEndDate) {
        console.log(
          "Package has expired. Current date:",
          currentDate,
          "Package end date:",
          packageEndDate
        );
        setNoPackage(true);
        setBusinessListings([]);
        setLoading(false); // Ensure loading is set to false
        return false;
      }

      console.log(
        "User has active package:",
        userData.activatedPackage.role.label
      );
      return true;
    } catch (error) {
      console.error("Error checking user package:", error);
      setError("Failed to verify package status");
      return false;
    }
  };

  // 🔍 Fetch Businesses (with search + filters)
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoPackage(false);
      setShowFeatured(false);

      // Always refresh user data first to get the latest package status
      await refreshUserData();

      // Check if user has an active package before making the API call
      const hasActivePackage = await checkUserPackage();
      if (!hasActivePackage) {
        setLoading(false);
        return;
      }

      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        setError("No token found, please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          keyword: search,
          state: selectedState === "All" ? "" : selectedState,
          page,
          limit,
        },
      });

      console.log("Business search response:", response.data);

      if (response.data?.message?.toLowerCase().includes("no active package")) {
        setNoPackage(true);
        setBusinessListings([]);
        return;
      }

      // reference API returns `{ businesses: [...] }`
      setBusinessListings(response.data.businesses || []);
    } catch (error) {
      console.error(
        "Error fetching businesses:",
        error.response?.data || error.message
      );

      if (
        error.response?.data?.message
          ?.toLowerCase()
          .includes("no active package")
      ) {
        setNoPackage(true);
      } else {
        setError("Failed to fetch business listings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [search, selectedState, page, limit]);

  // Action Menu Modal Component
  const ActionMenuModal = ({
    visible,
    onClose,
    onAddBusiness,
    onFeaturedBusiness,
  }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white rounded-2xl p-4 w-3/4`}>
            <TouchableOpacity
              style={tw`border border-red-500 rounded-lg py-2 mb-2 items-center`}
              onPress={() => {
                onAddBusiness();
                onClose();
              }}
            >
              <Text style={tw`text-gray-700 font-medium`}>Add Business</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`border border-red-500 rounded-lg py-2 mb-2 items-center`}
              onPress={() => {
                onFeaturedBusiness();
                onClose();
              }}
            >
              <Text style={tw`text-gray-700 font-medium`}>
                Featured Business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-red-500 rounded-lg py-2 items-center`}
              onPress={onClose}
            >
              <Text style={tw`text-white font-medium`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-200 px-4 py-4`}>
      {/* Section Title */}
      <View style={tw`pt-14`}>
        <View style={tw`flex-row justify-between items-cente mt-8`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-gray-800 mb-1 mr-36 `}>
            Business
          </Text>

          {/* Three Dots Menu Button */}
          <TouchableOpacity onPress={() => setActionMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Action Menu Modal */}
        <ActionMenuModal
          visible={actionMenuVisible}
          onClose={() => setActionMenuVisible(false)}
          onAddBusiness={() => setModalVisible(true)}
          onFeaturedBusiness={fetchFeaturedBusinesses}
        />

        {/* Add Business Modal */}
        <AddBusinessModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onBusinessAdded={fetchBusinesses}
        />

        <Text style={tw`text-sm text-gray-600 mb-4`}>
          Connect with business professionals, access industry insights, and
          explore partnership opportunities.
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={tw`bg-gray-100 rounded-lg px-4 py-2 mb-4 border border-red-500`}
      >
        <TextInput
          placeholder="Search business...."
          style={tw`text-gray-700`}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Location Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mb-4`}
      >
        {["All", "VIC", "NSW", "QLD", "SA", "WA"].map((location) => (
          <TouchableOpacity
            key={location}
            style={tw`px-4 py-2 mr-2 rounded-md ${selectedState === location ? "bg-red-500" : "bg-gray-100"}`}
            onPress={() => setSelectedState(location)}
          >
            <Text
              style={tw`${selectedState === location ? "text-white" : "text-gray-700"}`}
            >
              {location}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Show Featured Businesses Title if applicable */}
      {showFeatured && (
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
          Featured Businesses
        </Text>
      )}

      {/* Loading/Error State */}
      {loading && <Text style={tw`text-center text-gray-500`}>Loading...</Text>}

      {!loading && noPackage && (
        <View style={tw`mt-20 items-center`}>
          <MaterialIcons name="block" size={48} color="#DC2626" />
          <Text style={tw`text-lg font-bold text-gray-800 mt-2`}>
            No Active Package Found
          </Text>
          <Text style={tw`text-sm text-gray-600 mt-1 text-center px-6`}>
            You don't have an active package. Please purchase a package to view
            business listings.
          </Text>

          <TouchableOpacity
            style={tw`mt-4 bg-red-500 px-6 py-2 rounded-lg`}
            onPress={() => {
              setPackagesModalVisible(true);
              fetchRoles(); // Fetch roles when modal opens
            }}
          >
            <Text style={tw`text-white font-bold`}>View Packages</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={tw`text-center text-red-500`}>{error}</Text>}

      {/* Business Listings - Show either featured or regular businesses */}
      {(showFeatured ? featuredBusinesses : businessListings).map(
        (business) => (
          <TouchableOpacity
            key={business._id}
            style={tw`bg-white rounded-lg p-4 mb-4`}
            onPress={() =>
              navigation.navigate("BusinessDetail", { id: business._id })
            }
          >
            {/* Company Info */}
            <View style={tw`flex-row items-center mb-2`}>
              <Image
                source={
                  business.logo
                    ? { uri: business.logo }
                    : require("../../assets/profile.png")
                }
                style={tw`w-12 h-12 rounded-full mr-3`}
              />
              <View>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  {business.companyName}
                </Text>
                <Text style={tw`text-xs text-gray-500`}>
                  by {business.user?.name}
                </Text>
              </View>
            </View>

            {/* Rating & Location */}
            <View style={tw`flex-row items-center`}>
              <MaterialIcons name="star" size={16} color="#F59E0B" />
              <Text style={tw`text-xs text-gray-700 ml-1`}>
                {business.rating}
              </Text>
              <Text style={tw`text-xs text-gray-500 ml-2`}>
                {business.city}, {business.state}
              </Text>
            </View>

            {/* About */}
            <Text style={tw`text-sm text-gray-600 mb-3`}>{business.about}</Text>

            {/* Services */}
            <View style={tw`flex-row flex-wrap mb-3`}>
              {business.services &&
                business.services.map((service) => (
                  <View
                    key={service}
                    style={tw`bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2`}
                  >
                    <Text style={tw`text-xs text-gray-700`}>{service}</Text>
                  </View>
                ))}
            </View>

            {/* Social Links */}
            {business.socialLinks && business.socialLinks.length > 0 && (
              <View style={tw`flex-row flex-wrap mb-3`}>
                {business.socialLinks.map((link) => {
                  let iconName;
                  let iconType = "FontAwesome5";

                  switch (link.platform?.toLowerCase()) {
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
                      key={link._id || link.url}
                      style={tw`mr-3 mb-2`}
                      onPress={() => Linking.openURL(link.url)}
                    >
                      {iconType === "FontAwesome5" ? (
                        <FontAwesome5
                          name={iconName}
                          size={20}
                          color="#DC2626"
                        />
                      ) : (
                        <MaterialIcons
                          name={iconName}
                          size={20}
                          color="#DC2626"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {business.gallery && business.gallery.length > 0 && (
              <View style={tw`mb-3`}>
                <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                  Gallery
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {business.gallery.slice(0, 2).map((img, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: img }}
                      style={tw`w-20 h-20 rounded-lg mr-2`}
                    />
                  ))}
                  {business.gallery.length > 2 && (
                    <TouchableOpacity
                      style={tw`w-20 h-20 rounded-lg mr-2 justify-center items-center`}
                      onPress={() =>
                        navigation.navigate("BusinessDetail", {
                          id: business._id,
                        })
                      }
                    >
                      <Text style={tw`text-blue-600 font-medium underline`}>
                        View More
                      </Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            )}
            {/* Action Buttons */}
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`flex-1 bg-red-500 rounded-lg py-2 mr-2 items-center`}
                onPress={(e) => {
                  e.stopPropagation();
                  if (business.phone) {
                    Linking.openURL(`tel:${business.phone}`);
                  } else {
                    Alert.alert("No phone number available");
                  }
                }}
              >
                <Text style={tw`text-white font-medium`}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-red-500 rounded-lg py-2 mr-2 items-center`}
                onPress={(e) => {
                  e.stopPropagation();
                  if (business.email) {
                    Linking.openURL(`mailto:${business.email}`);
                  } else {
                    Alert.alert("No email available");
                  }
                }}
              >
                <Text style={tw`text-white font-medium`}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-red-500 rounded-lg py-2 items-center`}
                onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate("BusinessDetail", { id: business._id });
                }}
              >
                <Text style={tw`text-white font-medium`}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )
      )}

      {packagesModalVisible && (
        <Modal
          visible={packagesModalVisible}
          animationType="fade"
          transparent={true} // 👈 Important: so it won't take full screen solid white
        >
          <View
            style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}
          >
            <View style={tw`bg-white rounded-2xl w-11/12 max-w-md p-6`}>
              {/* Header */}
              <Text
                style={tw`text-lg font-bold text-gray-800 mb-4 text-center`}
              >
                Upgrade Your Business
              </Text>

              {/* Selected Package Display */}
              {selectedPackage && (
                <Text style={tw`text-sm text-green-600 mb-4 text-center`}>
                  Selected Package: {selectedPackage.label}
                </Text>
              )}

              {/* Loading State */}
              {packageLoading && (
                <Text style={tw`text-sm text-blue-600 mb-4 text-center`}>
                  Processing package selection...
                </Text>
              )}

              {/* Package Selection Buttons */}
              {rolesLoading ? (
                <Text style={tw`text-center text-gray-500`}>
                  Loading packages...
                </Text>
              ) : roles.length === 0 ? (
                <Text style={tw`text-center text-gray-500`}>
                  No package options available.
                </Text>
              ) : (
                roles.map((role) => (
                  <TouchableOpacity
                    key={role._id}
                    style={tw`rounded-lg p-3 mb-3 ${
                      selectedPackage?._id === role._id
                        ? "bg-red-500"
                        : "bg-gray-200"
                    }`}
                    onPress={() => handlePackageSelection(role)}
                    disabled={packageLoading}
                  >
                    <Text
                      style={tw`font-medium text-center ${
                        selectedPackage?._id === role._id
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))
              )}

              {/* Close Button */}
              <TouchableOpacity
                style={tw`mt-4`}
                onPress={() => {
                  setPackagesModalVisible(false);
                  setSelectedPackage(null);
                }}
              >
                <Text style={tw`text-red-500 text-center font-medium`}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default BusinessPage;
