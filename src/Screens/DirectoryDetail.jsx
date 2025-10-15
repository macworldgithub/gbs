import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import moment from "moment";

export default function DirectoryDetail({ route, navigation }) {
  const { id } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [anniversary, setAnniversary] = useState(null);
  const [renewalDue, setRenewalDue] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/user/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load user");
      }
      setUser(data);
      // Calculate Anniversary Date
      let baseDate = data?.activatedPackage?.startDate || data?.createdAt;
      if (baseDate) {
        const anniversaryDate = moment(baseDate).add(12, "months");
        setAnniversary(anniversaryDate);

        // Check if within 30 days
        const daysLeft = anniversaryDate.diff(moment(), "days");
        if (daysLeft <= 30 && daysLeft >= 0) {
          setRenewalDue(true);
        }
      }
    } catch (e) {
      setError(e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  return (
    <View style={tw`flex-1 bg-white pt-12`}>
      <View style={tw`px-4 pb-2 flex-row items-center`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`pr-3 py-2`}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-black`}>Member Detail</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ed292e" style={tw`mt-10`} />
      ) : error ? (
        <View style={tw`px-4 mt-10`}>
          <Text style={tw`text-red-500`}>{error}</Text>
          <TouchableOpacity
            onPress={fetchUser}
            style={tw`mt-3 bg-red-500 px-4 py-2 rounded`}
          >
            <Text style={tw`text-white text-center`}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !user ? (
        <Text style={tw`text-center text-gray-500 mt-10`}>No user found.</Text>
      ) : (
        <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
          <View style={tw`items-center mt-4`}>
            <Image
              source={
                user.avatarUrl
                  ? { uri: user.avatarUrl }
                  : require("../../assets/user.jpg")
              }
              style={tw`w-28 h-28 rounded-full`}
            />
            <Text style={tw`text-xl font-bold text-black mt-3`}>
              {user.name}
            </Text>
            <Text style={tw`text-red-500 mt-1`}>{user.email}</Text>
            <Text style={tw`text-gray-600 mt-1`}>{user.phone || "N/A"}</Text>
            <Text style={tw`text-gray-500 mt-1`}>
              State: {user.state || "N/A"}
            </Text>
          </View>

          <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
            {anniversary && (
              <View style={tw`mt-3 `}>
                <Text style={tw`text-black font-semibold`}>
                  Member Anniversary Date:
                </Text>
                <Text style={tw`text-red-500`}>
                  {moment(anniversary).format("MMMM DD, YYYY")}
                </Text>
                {renewalDue && (
                  <Text style={tw`text-yellow-600 mt-1 font-medium`}>
                    Annual Renewal Due Soon!
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
            <Text style={tw`text-black font-semibold mb-2`}>
              Activated Package
            </Text>
            <Text style={tw`text-gray-700`}>
              {user?.activatedPackage?.role?.label || "Member"}
            </Text>
            {Array.isArray(user?.activatedPackage?.role?.permissions) && (
              <View style={tw`mt-3`}>
                <Text style={tw`text-black font-semibold mb-1`}>
                  Permissions:
                </Text>
                {user.activatedPackage.role.permissions.slice(0, 5).map((p) => (
                  <Text
                    key={p._id || p.permission?._id}
                    style={tw`text-gray-700`}
                  >
                    • {p.permission?.label || p.permission?.name}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {Array.isArray(user.trustedDevices) &&
            user.trustedDevices.length > 0 && (
              <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
                <Text style={tw`text-black font-semibold mb-2`}>
                  Trusted Devices
                </Text>
                {user.trustedDevices.map((d) => (
                  <View key={d._id} style={tw`mb-3`}>
                    <Text style={tw`text-gray-800`}>
                      {d.deviceName} ({d.platform})
                    </Text>
                    <Text style={tw`text-gray-500 text-xs`}>
                      ID: {d.deviceId}
                    </Text>
                  </View>
                ))}
              </View>
            )}
        </ScrollView>
      )}
    </View>
  );
}
