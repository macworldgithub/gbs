import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import EditBusinessModal from "../../components/EditBusinessModal";
import axios from "axios";

export default function MyBusiness() {
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const navigation = useNavigation();

  const fetchBusinesses = async () => {
    try {
      const userData = await getUserData();

      if (!userData || !userData.token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/business/my-businesses`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }

      const data = await response.json();
      setBusinesses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);



  if (loading) return <ActivityIndicator style={tw`mt-10`} size="large" color="red" />;
  if (error) return <Text style={tw`text-red-500 mt-10 text-center`}>{error}</Text>;

  const deleteBusiness = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this business?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const userData = await getUserData();
            const token = userData?.token;

            if (!token) {
              Alert.alert("Error", "No token found, please login again.");
              return;
            }

            await axios.delete(`${API_BASE_URL}/business/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Success", "Business deleted successfully");
            fetchBusinesses();
          } catch (error) {
            console.error("Error deleting business:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to delete business");
          }
        },
      },
    ]);
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mt-8 mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>My Businesses</Text>
        <View style={{ width: 24 }} />
      </View>

      {businesses.length === 0 ? (
        <Text style={tw`text-gray-500 text-center mt-10`}>No businesses found.</Text>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item._id}
              style={tw`bg-gray-50 rounded-lg p-4 mb-4`}
              onPress={() => navigation.navigate("BusinessDetail", { id: item._id })}
            >
              {/* Company Info */}
              <View style={tw`flex-row justify-between items-start mb-2`}>
                <View>
                  <Text style={tw`text-lg font-bold text-gray-800`}>
                    {item.companyName}
                  </Text>
                  <Text style={tw`text-xs text-gray-500`}>by {item.user?.name}</Text>
                </View>

                {/* Edit / Delete */}
                <View style={tw`flex-row`}>
                  <TouchableOpacity
                    style={tw`mr-3`}
                    onPress={() => {
                      setSelectedBusiness(item);
                      setEditModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="edit" size={20} color="#2563EB" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteBusiness(item._id)}>
                    <MaterialIcons name="delete" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <EditBusinessModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                business={selectedBusiness}
                onBusinessUpdated={fetchBusinesses}
              />



              {/* Rating & Location */}
              <View style={tw`flex-row items-center`}>
                <MaterialIcons name="star" size={16} color="#F59E0B" />
                <Text style={tw`text-xs text-gray-700 ml-1`}>{item.rating}</Text>
                <Text style={tw`text-xs text-gray-500 ml-2`}>
                  {item.city}, {item.state}
                </Text>
              </View>

              {/* About */}
              <Text style={tw`text-sm text-gray-600 mb-3`}>{item.about}</Text>

              {/* Services */}
              <View style={tw`flex-row flex-wrap mb-3`}>
                {item.services &&
                  item.services.map((service) => (
                    <View
                      key={service}
                      style={tw`bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2`}
                    >
                      <Text style={tw`text-xs text-gray-700`}>{service}</Text>
                    </View>
                  ))}
              </View>

              {/* Social Links */}
              {item.socialLinks && item.socialLinks.length > 0 && (
                <View style={tw`flex-row flex-wrap mb-3`}>
                  {item.socialLinks.map((link) => {
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
                    item.phone
                      ? Linking.openURL(`tel:${item.phone}`)
                      : Alert.alert("No phone number available");
                  }}
                >
                  <Text style={tw`text-white font-medium`}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 bg-red-500 rounded-lg py-2 mr-2 items-center`}
                  onPress={(e) => {
                    e.stopPropagation();
                    item.email
                      ? Linking.openURL(`mailto:${item.email}`)
                      : Alert.alert("No email available");
                  }}
                >
                  <Text style={tw`text-white font-medium`}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 bg-red-500 rounded-lg py-2 items-center`}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate("BusinessDetail", { id: item._id });
                  }}
                >
                  
                  <Text style={tw`text-white font-medium`}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
