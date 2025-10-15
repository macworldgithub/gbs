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

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const userData = await getUserData();
        const token = userData?.token;
        if (!token) {
          setError("No token found, please login again.");
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    try {
      setSubmitting(true);
      const userData = await getUserData();
      const token = userData?.token;
      if (!token) {
        Alert.alert("Error", "No token found, please login again.");
        return;
      }

      const body = {
        role: role._id,
        startDate: new Date().toISOString(),
        months: 12,
        trial: false,
      };

      const res = await axios.patch(`${API_BASE_URL}/user-package`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("[UpgradePackage] PATCH response:", res.data);

      // Persist immediately to AsyncStorage
      const currentUser = await getUserData();
      const constructedPkg = res?.data?.activatedPackage ||
        res?.data?.userPackage || {
          role: { _id: role._id, name: role.name, label: role.label },
          startDate: body.startDate,
          endDate: new Date(
            new Date(body.startDate).setMonth(
              new Date(body.startDate).getMonth() + 12
            )
          ).toISOString(),
        };
      const mergedUser = currentUser
        ? { ...currentUser, activatedPackage: constructedPkg }
        : { activatedPackage: constructedPkg };
      await AsyncStorage.setItem("userData", JSON.stringify(mergedUser));
      await AsyncStorage.setItem(
        "currentPackage",
        JSON.stringify(constructedPkg)
      );

      setUpgradedLabel(role.label || "");
      setSuccessVisible(true);
    } catch (e) {
      console.log(
        "[UpgradePackage] upgrade error:",
        e.response?.data || e.message
      );
      Alert.alert("Error", "Failed to upgrade package. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                  <Text style={tw`text-xs text-gray-500 mt-1`}>
                    Months: 12 • Trial: false
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    tw`bg-red-500 px-4 py-2 rounded-lg`,
                    { alignSelf: "flex-start" },
                  ]}
                  onPress={() => upgradeToRole(role)}
                  disabled={submitting}
                >
                  <Text style={tw`text-white font-semibold`}>
                    {submitting ? "Please wait" : "Select"}
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
