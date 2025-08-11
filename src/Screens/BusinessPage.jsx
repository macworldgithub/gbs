import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../src/utils/config";
const API_URL = `${API_BASE_URL}/business`;
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import tw from 'tailwind-react-native-classnames';
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
const BusinessPage = () => {
  const [businessListings, setBusinessListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        setBusinessListings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch business listings');
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Section Title */}
      <View style={tw`pt-14`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>Business</Text>
        <Text style={tw`text-sm text-gray-600 mb-4`}>
          Connect with business professionals, access industry insights, and
          explore partnership opportunities.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={tw`bg-gray-100 rounded-lg px-4 py-2 mb-4 border border-red-500`}>
        <TextInput
          placeholder="Search business...."
          style={tw`text-gray-700`}
        />
      </View>

      {/* Location Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
        {["All", "VIC", "NSW", "QLD", "SA"].map((location) => (
          <TouchableOpacity
            key={location}
            style={tw`px-4 py-2 mr-2 rounded-md ${location === "All" ? "bg-red-500" : "bg-gray-100"}`}
          >
            <Text style={tw`${location === "All" ? "text-white" : "text-gray-700"}`}>
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
        <View key={business._id} style={tw`bg-gray-50 rounded-lg p-4 mb-4`}>
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <View>
              <Text style={tw`text-lg font-bold text-gray-800`}>{business.companyName}</Text>
              <Text style={tw`text-xs text-gray-500`}>by {business.user?.name}</Text>
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            <MaterialIcons name="star" size={16} color="#F59E0B" />
            <Text style={tw`text-xs text-gray-700 ml-1`}>{business.rating}</Text>
            <Text style={tw`text-xs text-gray-500 ml-2`}>{business.city}, {business.state}</Text>
          </View>
          <Text style={tw`text-sm text-gray-600 mb-3`}>{business.about}</Text>
          <View style={tw`flex-row flex-wrap mb-4`}>
            {business.services && business.services.map((service) => (
              <View key={service} style={tw`bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2`}>
                <Text style={tw`text-xs text-gray-700`}>{service}</Text>
              </View>
            ))}
          </View>
          <View style={tw`flex-row justify-between`}>
            <TouchableOpacity style={tw`flex-1 bg-red-500 rounded-lg py-2 mr-2 items-center`}>
              <Text style={tw`text-white font-medium`}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-1 bg-red-500 border border-gray-300 rounded-lg py-2 mr-2 items-center`}>
              <Text style={tw`text-white font-medium`}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-1 bg-red-500 border border-gray-300 rounded-lg py-2 items-center`}>
              <Text style={tw`text-white font-medium`}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default BusinessPage;