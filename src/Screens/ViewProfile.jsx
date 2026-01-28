import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import tw from "twrnc";
import { getUserData } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const BASE_URL = "https://gbs.westsidecarcare.com.au/user";

export default function ViewProfile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [anniversary, setAnniversary] = useState(null);
  const [renewalDue, setRenewalDue] = useState(false);

  // ✅ New states for editable fields
  const [shortBio, setShortBio] = useState("");
  const [hobbiesInput, setHobbiesInput] = useState(""); // Comma-separated input
  const [location, setLocation] = useState(""); // String location
  const [updating, setUpdating] = useState(false);

  // ✅ Extracted fetchProfile function to component scope
  const fetchProfile = async () => {
    try {
      console.log("🔍 Starting to fetch profile...");
      setLoading(true);
      setError(null);

      const storedUser = await getUserData();
      console.log("📦 Retrieved stored user:", storedUser);
      if (!storedUser || !storedUser._id) {
        console.warn("No user found in storage");
        setLoading(false);
        return;
      }

      // ✅ Always use storedUser for base display to preserve original data
      setUser(storedUser);

      const res = await fetch(`${BASE_URL}/${storedUser._id}`);
      const data = await res.json();
      console.log(" Fetched profile data:", data);

      if (res.ok) {
        setProfile(data);
        // ✅ Initialize editable fields from profile if valid, else from user
        setShortBio(
          data?.shortBio && data.shortBio !== "string"
            ? data.shortBio
            : user?.shortBio || "",
        );
        const hobbies = data?.hobbies || user?.hobbies || [];
        setHobbiesInput(Array.isArray(hobbies) ? hobbies.join(", ") : hobbies);
        setLocation(
          data?.location && data.location !== "string"
            ? data.location
            : user?.location || "",
        );
        // ✅ Set anniversary if available and valid
        if (data?.anniversaryDate && data.anniversaryDate !== "string") {
          setAnniversary(data.anniversaryDate);
        }
        // ✅ Log display fields for debugging (using original user data)
        console.log(" Display Name (original):", storedUser?.name || "N/A");
        console.log(" Display Phone (original):", storedUser?.phone || "N/A");
        console.log(
          " Display InterestedIn (original):",
          storedUser?.interestedIn || "N/A",
        );
      } else {
        console.error("Error fetching profile:", data);
        setError(data?.message || "Failed to load profile");
      }
    } catch (error) {
      console.error(" Error fetching user profile:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ New function to handle update - only for membership level
  const handleUpdateMembership = async () => {
    try {
      console.log(" Starting membership update...");
      setUpdating(true);
      setError(null);

      if (!user?._id) {
        console.error(" No user ID available for update");
        setError("No user ID available");
        return;
      }

      // ✅ Prepare hobbies array from comma-separated input
      const hobbies = hobbiesInput
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0 && h !== "string");

      const updateData = {
        shortBio: shortBio.trim() || undefined, // Avoid empty string
        hobbies: hobbies.length > 0 ? hobbies : undefined,
        location: location.trim() || undefined,
      };

      // ✅ Remove undefined fields
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key],
      );

      if (Object.keys(updateData).length === 0) {
        console.log("ℹ No changes to update");
        return;
      }

      console.log(" Sending update payload:", updateData);

      const res = await fetch(`${BASE_URL}/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await res.json();
      console.log(" Received update response:", responseData);

      if (res.ok) {
        console.log(" Update successful, refetching profile...");
        // ✅ Refetch, but display will still prioritize original user data
        await fetchProfile();
      } else {
        console.error(" Update failed:", responseData);
        setError(responseData?.message || "Failed to update membership");
      }
    } catch (err) {
      console.error(" Update error:", err);
      setError(err.message || "Something went wrong during update");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Helper to get display value - prioritize user (original), avoid "string"
  const getDisplayValue = (field, fallback = "N/A") => {
    let value = user?.[field] ?? fallback;
    // ✅ If somehow "string" from bad data, fallback
    if (value === "string") {
      value = fallback;
    }
    console.log(` Displaying ${field}:`, value);
    return value;
  };

  // ✅ Helper for interestedIn display - handle array or string, filter "string"
  const getInterestedInDisplay = () => {
    let interestedIn = user?.interestedIn ?? [];
    console.log(" Raw InterestedIn:", interestedIn);

    // If it's a string, split by comma
    if (typeof interestedIn === "string") {
      interestedIn = interestedIn
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item && item !== "string");
      console.log(" Converted string to array:", interestedIn);
    }

    // Ensure it's an array and filter out "string"
    if (!Array.isArray(interestedIn)) {
      interestedIn = [];
    } else {
      interestedIn = interestedIn.filter(
        (it) =>
          it &&
          (typeof it === "string" ? it !== "string" : true) &&
          (it.label || it.name || it) !== "string",
      );
    }

    return interestedIn;
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="red" />
        <Text style={tw`text-gray-500 mt-2`}>Loading Profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-gray-500`}>Profile not found.</Text>
      </View>
    );
  }

  const displayName = getDisplayValue("name");
  const displayEmail = getDisplayValue("email");
  const displayPhone = getDisplayValue("phone");
  const displayState = getDisplayValue("state");

  const interestedInList = getInterestedInDisplay();

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
            onPress={fetchProfile}
            style={tw`mt-3 bg-red-500 px-4 py-2 rounded`}
          >
            <Text style={tw`text-white text-center`}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
          <View style={tw`items-center mt-4`}>
            <Image
              source={
                user?.avatarUrl
                  ? { uri: user.avatarUrl }
                  : require("../../assets/user.jpg")
              }
              style={tw`w-28 h-28 rounded-full`}
            />
            <Text style={tw`text-xl font-bold text-black mt-3`}>
              {displayName}
            </Text>
            <Text style={tw`text-red-500 mt-1`}>{displayEmail}</Text>
            <Text style={tw`text-gray-600 mt-1`}>{displayPhone}</Text>
            <Text style={tw`text-gray-500 mt-1`}>State: {displayState}</Text>
          </View>

          {/* Anniversary / Member info card: include Member since */}
          <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
            {/* Member since (from createdAt) */}
            {user?.createdAt ? (
              <View style={tw`mb-3`}>
                <Text style={tw`text-black font-semibold`}>Member since</Text>
                <Text style={tw`text-gray-700`}>
                  {moment(user.createdAt).format("MMMM DD, YYYY")}
                </Text>
              </View>
            ) : null}

            {/* Anniversary date and renewal notice */}
            {anniversary ? (
              <View style={tw`mt-2`}>
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
            ) : null}
          </View>

          <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
            <Text style={tw`text-black font-semibold mb-2`}>
              Activated Package
            </Text>
            <Text style={tw`text-gray-700 font-bold`}>
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

          {/* Business & Interested In card */}
          {(user?.business?.name || interestedInList.length > 0) && (
            <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
              {user?.business?.name ? (
                <View style={tw`mb-3`}>
                  <Text style={tw`text-black font-semibold`}>Business</Text>
                  <Text style={tw`text-gray-700`}>{user.business.name}</Text>
                </View>
              ) : null}

              {interestedInList.length > 0 && (
                <View style={tw`mb-3`}>
                  <Text style={tw`text-black font-semibold`}>
                    Interested In
                  </Text>
                  {interestedInList.map((it, idx) => (
                    <Text key={it._id || idx} style={tw`text-gray-700`}>
                      • {it.label || it.name || it}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ✅ New Membership Level Section - Editable with Update API */}
          <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
            <Text style={tw`text-black font-semibold mb-3 text-lg`}>
              Member information
            </Text>

            {/* ShortBio */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-black font-semibold mb-1`}>Short Bio</Text>
              <TextInput
                style={tw`bg-white p-3 rounded border border-gray-300`}
                multiline
                numberOfLines={3}
                value={shortBio}
                onChangeText={setShortBio}
                placeholder="Enter your short bio..."
              />
            </View>

            {/* Hobbies */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-black font-semibold mb-1`}>
                Hobbies (comma-separated)
              </Text>
              <TextInput
                style={tw`bg-white p-3 rounded border border-gray-300`}
                value={hobbiesInput}
                onChangeText={setHobbiesInput}
                placeholder="e.g., Surfing, Guitar, Yoga"
              />
            </View>

            {/* Location */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-black font-semibold mb-1`}>Location</Text>
              <TextInput
                style={tw`bg-white p-3 rounded border border-gray-300`}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., Sydney"
              />
            </View>

            {/* Update Button - Only updates membership fields */}
            <TouchableOpacity
              onPress={handleUpdateMembership}
              disabled={updating}
              style={tw`bg-red-500 py-3 rounded-xl items-center ${updating ? "opacity-50" : ""}`}
            >
              <Text style={tw`text-white font-semibold`}>
                {updating ? "Updating..." : "Update Profile"}
              </Text>
            </TouchableOpacity>

            {error && (
              <Text style={tw`text-red-500 text-center mt-2 text-sm`}>
                {error}
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
