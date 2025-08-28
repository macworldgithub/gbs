import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../src/utils/config";
import { getUserData } from "../../src/utils/storage";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import AddBusinessModal from "../../components/AddBusinessModal";
import tw from "tailwind-react-native-classnames";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

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

useEffect(() => {
  if (isFocused) {
    fetchBusinesses();
  }
}, [isFocused]);


  // 🔍 Fetch Businesses (with search + filters)
  const fetchBusinesses = async () => {
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

      // reference API returns `{ businesses: [...] }`
      setBusinessListings(response.data.businesses || []);
    } catch (error) {
      console.error("Error fetching businesses:", error.response?.data || error.message);
      setError("Failed to fetch business listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [search, selectedState, page, limit]);

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Section Title */}
      <View style={tw`pt-14`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>Business</Text>

          {/* Add Business */}
          <TouchableOpacity
            style={tw`bg-red-500 px-4 py-2 rounded-lg`}
            onPress={() => setModalVisible(true)}
          >
            <Text style={tw`text-white font-bold`}>Add Business</Text>
          </TouchableOpacity>
        </View>

        {/* Add Modal */}
        <AddBusinessModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onBusinessAdded={fetchBusinesses}
        />

        <Text style={tw`text-sm text-gray-600 mb-4`}>
          Connect with business professionals, access industry insights, and explore partnership opportunities.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={tw`bg-gray-100 rounded-lg px-4 py-2 mb-4 border border-red-500`}>
        <TextInput
          placeholder="Search business...."
          style={tw`text-gray-700`}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Location Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
        {["All", "VIC", "NSW", "QLD", "SA", "WA"].map((location) => (
          <TouchableOpacity
            key={location}
            style={tw`px-4 py-2 mr-2 rounded-md ${selectedState === location ? "bg-red-500" : "bg-gray-100"}`}
            onPress={() => setSelectedState(location)}
          >
            <Text style={tw`${selectedState === location ? "text-white" : "text-gray-700"}`}>
              {location}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loading/Error State */}
      {loading && <Text style={tw`text-center text-gray-500`}>Loading...</Text>}
      {error && <Text style={tw`text-center text-red-500`}>{error}</Text>}

      {/* Business Listings */}
      {businessListings.map((business) => (
        <TouchableOpacity
          key={business._id}
          style={tw`bg-gray-50 rounded-lg p-4 mb-4`}
          onPress={() => navigation.navigate("BusinessDetail", { id: business._id })}
        >
          {/* Company Info */}
          <View style={tw`flex-row justify-between items-start mb-2`}>
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
            <Text style={tw`text-xs text-gray-700 ml-1`}>{business.rating}</Text>
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
                <View key={service} style={tw`bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2`}>
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
                  case "linkedin": iconName = "linkedin"; break;
                  case "facebook": iconName = "facebook"; break;
                  case "instagram": iconName = "instagram"; break;
                  case "twitter": iconName = "twitter"; break;
                  case "youtube": iconName = "youtube"; break;
                  default: iconName = "link"; iconType = "MaterialIcons";
                }

                return (
                  <TouchableOpacity
                    key={link._id || link.url}
                    style={tw`mr-3 mb-2`}
                    onPress={() => Linking.openURL(link.url)}
                  >
                    {iconType === "FontAwesome5" ? (
                      <FontAwesome5 name={iconName} size={20} color="#DC2626" />
                    ) : (
                      <MaterialIcons name={iconName} size={20} color="#DC2626" />
                    )}
                  </TouchableOpacity>
                );
              })}
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
      ))}
    </ScrollView>
  );
};

export default BusinessPage;
