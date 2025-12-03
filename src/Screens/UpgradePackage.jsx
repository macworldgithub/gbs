import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";
import { MaterialIcons } from "@expo/vector-icons";

const UpgradePackage = ({ navigation }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [upgradedLabel, setUpgradedLabel] = useState("");
  const [currentRoleId, setCurrentRoleId] = useState(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        let userData = await getUserData();
        const currentId = userData?.activatedPackage?.role?._id;
        setCurrentRoleId(currentId);
        console.log("Current Role:", currentId);
        const token = userData?.token;
        if (!token) {
          setError("No token found, please login again.");
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("2222", res.data?.[0]?._id);
        setRoles(res.data || []);
      } catch (e) {
        console.log(
          "[UpgradePackage] roles error:",
          e.response?.data || e.message
        );
        setError("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  const upgradeToRole = async (role) => {
    navigation.navigate("StripeCheckout", {
      roleId: role._id,
      startDate: new Date().toISOString(),
      months: 12,
      trial: false,
    });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`bg-white border-b border-gray-200 pt-14 pb-4 px-4  bg-red-500 `}
      >
        <TouchableOpacity
          style={tw`absolute top-14 left-4 z-10`}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-center text-white text-2xl font-bold`}>
          Upgrade Memberships
        </Text>
        <Text style={tw`text-center text-white text-xs mt-1`}>
          Choose a package to unlock Business features
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={tw`flex-1 px-4 py-4`}>
        {loading && (
          <View style={tw`py-8 items-center`}>
            <ActivityIndicator color="#DC2626" size="small" />
            <Text style={tw`text-gray-500 mt-2`}>Loading roles...</Text>
          </View>
        )}
        {error && <Text style={tw`text-red-500`}>{error}</Text>}

        {!loading && roles.length === 0 && (
          <Text style={tw`text-gray-500`}>No roles available.</Text>
        )}

        {!loading &&
          roles.map((role) => (
            <View
              key={role._id}
              style={[
                tw`bg-white rounded-xl p-4 mb-3 border border-red-200`,
                { overflow: "hidden" },
              ]}
            >
              <View style={tw`flex-row justify-between`}>
                <View style={[tw`pr-3`, { flex: 1 }]}>
                  <Text style={tw`text-base font-bold text-gray-800`}>
                    {role.label}
                  </Text>
                  {role.price !== undefined && (
                    <Text style={tw`text-sm text-red-500 font-semibold mt-1`}>
                      Price:${role.price}
                    </Text>
                  )}
                  <Text style={tw`text-xs text-gray-500 mt-1`}>
                    Months: 12 • Trial: false
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    tw`px-4 py-2 rounded-lg`,
                    currentRoleId === role._id
                      ? tw`bg-gray-400`
                      : tw`bg-red-500`,
                    { alignSelf: "flex-start" },
                  ]}
                  disabled={submitting || currentRoleId === role._id}
                  onPress={() => upgradeToRole(role)}
                >
                  <Text style={tw`text-white font-semibold`}>
                    {currentRoleId === role._id
                      ? "Current Plan"
                      : submitting
                      ? "Please wait"
                      : "Select"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View
          style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}
        >
          <View style={tw`bg-white w-11/12 max-w-md rounded-2xl p-6`}>
            <Text style={tw`text-lg font-bold text-gray-900 text-center`}>
              Package Upgraded
            </Text>
            <Text style={tw`text-sm text-gray-600 text-center mt-2`}>
              Package upgraded successfully as{" "}
              {upgradedLabel || "selected package"}.
            </Text>
            <View style={tw`flex-row mt-5`}>
              <TouchableOpacity
                style={tw`flex-1 bg-red-500 py-2 rounded-lg mr-2`}
                onPress={() => {
                  setSuccessVisible(false);
                  navigation.navigate("BusinessPage");
                }}
              >
                <Text style={tw`text-white text-center font-semibold`}>
                  Go to Business
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-100 py-2 rounded-lg`}
                onPress={() => {
                  setSuccessVisible(false);
                  navigation.goBack();
                }}
              >
                <Text style={tw`text-gray-800 text-center font-semibold`}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UpgradePackage;
