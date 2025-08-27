import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";

export default function MyBusiness() {
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchBusinesses();
  }, []);

  if (loading) return <ActivityIndicator style={tw`mt-10`} size="large" color="red" />;
  if (error) return <Text style={tw`text-red-500 mt-10 text-center`}>{error}</Text>;

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>My Businesses</Text>
      {businesses.length === 0 ? (
        <Text style={tw`text-gray-500`}>No businesses found.</Text>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={tw`p-4 mb-3 border rounded-lg`}>
              <Text style={tw`text-lg font-semibold`}>{item.businessName}</Text>
              <Text style={tw`text-gray-600`}>{item.category}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
