import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const businessListings = [
  {
    id: 1,
    name: "Elite Legal Solutions",
    by: "John Smith",
    rating: 4.8,
    location: "Melbourne, VIC",
    description: "Corporate law specialists serving GBS members for over 10 years.",
    services: ["Corporate Law", "Contract Review", "Business Formation"],
  },
  {
    id: 2,
    name: "Elite Legal Solutions",
    by: "John Smith",
    rating: 4.8,
    location: "Melbourne, VIC",
    description: "Corporate law specialists serving GBS members for over 10 years.",
    services: ["Corporate Law", "Contract Review", "Business Formation"],
  },
];

const BusinessPage = () => {
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
         {/* <Ionicons name="search" size={18} color="#999" /> */}
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

      {/* Business Listings */}
      {businessListings.map((business) => (
        <View key={business.id} style={tw`bg-gray-50 rounded-lg p-4 mb-4`}>
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <View>
              <Text style={tw`text-lg font-bold text-gray-800`}>{business.name}</Text>
              <Text style={tw`text-xs text-gray-500`}>by {business.by}</Text>
            </View>
          </View>
           <View style={tw`flex-row items-center`}>
              <MaterialIcons name="star" size={16} color="#F59E0B" />
              <Text style={tw`text-xs text-gray-700 ml-1`}>{business.rating}</Text>
              <Text style={tw`text-xs text-gray-500 ml-2`}>{business.location}</Text>
            </View>
          <Text style={tw`text-sm text-gray-600 mb-3`}>{business.description}</Text>
          <View style={tw`flex-row flex-wrap mb-4`}>
            {business.services.map((service, index) => (
              <View key={index} style={tw`bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 `}>
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