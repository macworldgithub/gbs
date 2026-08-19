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
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

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
      setName(storedUser.name || "");
      setPhone(storedUser.phone || "");

      const res = await fetch(`${BASE_URL}/${storedUser._id}`);
      const data = await res.json();
      console.log(" Fetched profile data:", data);

      if (res.ok) {
        setProfile(data);
        // Update editable fields with latest server data
        setName(data?.name || storedUser?.name || "");
        setPhone(data?.phone || storedUser?.phone || "");
        // ✅ Initialize editable fields from profile if valid, else from user
        setShortBio(
          data?.shortBio && data.shortBio !== "string"
            ? data.shortBio
            : storedUser?.shortBio || "",
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

  // ✅ Updated handleUpdateMembership
  const handleUpdateMembership = async () => {
    try {
      console.log(" Starting membership update...");
      setUpdating(true);
      setError(null);

      if (!user?._id) {
        setError("No user ID available");
        return;
      }

      const hobbies = hobbiesInput
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0 && h !== "string");

      const updateData = {
        name: name.trim(),
        phone: phone.trim(),
        shortBio: shortBio.trim(),
        hobbies: hobbies.length > 0 ? hobbies : undefined,
        location: location.trim(),
      };

      // Remove undefined fields
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

      if (res.ok) {
        console.log(" Update successful!");

        // ✅ IMPORTANT: Update local states with new values
        setName(updateData.name || name);
        setPhone(updateData.phone || phone);

        // Also update the main user state so getDisplayValue reflects new data
        setUser((prevUser) => ({
          ...prevUser,
          name: updateData.name || prevUser?.name,
          phone: updateData.phone || prevUser?.phone,
        }));

        // Optional: Refetch to get latest server data (recommended)
        await fetchProfile();
      } else {
        console.error(" Update failed:", responseData);
        setError(responseData?.message || "Failed to update profile");
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

  // ✅ Get active package safely (fixed field name)
  const getActivePackage = () => {
    const pkg = profile?.activatedPackage || user?.activatedPackage;

    if (!pkg) return "None";

    const role = pkg.role;
    if (role) {
      return role.label || role.name || "Unknown Package";
    }

    return pkg.name || pkg.label || "Unknown Package";
  };

  const getPermissions = () => {
    const permissions =
      profile?.activatedPackage?.role?.permissions ||
      user?.activatedPackage?.role?.permissions ||
      profile?.permissions ||
      user?.permissions ||
      [];

    return Array.isArray(permissions) ? permissions : [];
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}

      <View
        style={tw`px-4 pb-3 pt-12 flex-row items-center justify-between border-b border-gray-200`}
      >
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`pr-3 py-2`}
          >
            <Ionicons name="chevron-back" size={24} color="#111" />
          </TouchableOpacity>

          <Text style={tw`text-lg font-bold text-black`}>Member Detail</Text>
        </View>

        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={tw`text-red-500 font-semibold`}>
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-20`}
      >
        {/* Profile Card */}

        <View style={tw`bg-gray-100 p-5 rounded-2xl items-center`}>
          <Image
            source={
              profile?.profileImage
                ? { uri: profile.profileImage }
                : require("../../assets/profile.png")
            }
            style={tw`w-24 h-24 rounded-full`}
          />

          {/* Name */}

          {isEditing ? (
            <TextInput
              value={name}
              onChangeText={setName}
              style={tw`
border
border-gray-300
p-2
rounded
mt-3
bg-white
w-full
text-center
`}
            />
          ) : (
            <Text style={tw`text-xl font-bold text-black mt-3`}>
              {name || "No name"}
            </Text>
          )}

          {/* Phone */}

          {isEditing ? (
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={tw`
border
border-gray-300
p-2
rounded
mt-2
bg-white
w-full
text-center
`}
            />
          ) : (
            <Text style={tw`text-gray-600 mt-1`}>{phone || "No phone"}</Text>
          )}
        </View>

        {/* Short Bio */}

        <View style={tw`mt-5`}>
          <Text style={tw`font-semibold text-black mb-2`}>Short Bio</Text>

          {isEditing ? (
            <TextInput
              value={shortBio}
              onChangeText={setShortBio}
              multiline
              style={tw`
bg-gray-100
p-3
rounded-xl
border
border-gray-300
`}
            />
          ) : (
            <View style={tw`bg-gray-100 p-3 rounded-xl`}>
              <Text style={tw`text-gray-700`}>{shortBio || "Not added"}</Text>
            </View>
          )}
        </View>

        {/* Hobbies */}

        <View style={tw`mt-5`}>
          <Text style={tw`font-semibold text-black mb-2`}>Hobbies</Text>

          {isEditing ? (
            <TextInput
              value={hobbiesInput}
              onChangeText={setHobbiesInput}
              placeholder="Reading, Travel"
              style={tw`
bg-gray-100
p-3
rounded-xl
border
border-gray-300
`}
            />
          ) : (
            <View style={tw`bg-gray-100 p-3 rounded-xl`}>
              <Text style={tw`text-gray-700`}>
                {hobbiesInput || "Not added"}
              </Text>
            </View>
          )}
        </View>

        {/* Location */}

        <View style={tw`mt-5`}>
          <Text style={tw`font-semibold text-black mb-2`}>Location</Text>

          {isEditing ? (
            <TextInput
              value={location}
              onChangeText={setLocation}
              style={tw`
bg-gray-100
p-3
rounded-xl
border
border-gray-300
`}
            />
          ) : (
            <View style={tw`bg-gray-100 p-3 rounded-xl`}>
              <Text style={tw`text-gray-700`}>{location || "Not added"}</Text>
            </View>
          )}
        </View>

        {/* Non editable info */}
        <View style={tw`mt-6 bg-gray-100 p-4 rounded-2xl`}>
          <Text style={tw`font-semibold text-black mb-2`}>Email</Text>
          <Text style={tw`text-gray-700`}>{displayEmail}</Text>

          <View style={tw`mt-3`}>
            <Text style={tw`font-semibold text-black`}>Member Since</Text>
            <Text style={tw`text-gray-700`}>
              {profile?.createdAt
                ? moment(profile.createdAt).format("DD MMM YYYY")
                : "N/A"}
            </Text>
          </View>

          <View style={tw`mt-3`}>
            <Text style={tw`font-semibold text-black`}>Activated Package</Text>
            <Text style={tw`text-gray-700`}>{getActivePackage()}</Text>
          </View>

          {/* State - Changed from Location */}
          <View style={tw`mt-3`}>
            <Text style={tw`font-semibold text-black`}>State</Text>
            <Text style={tw`text-gray-700`}>
              {displayState || "Not available"}
            </Text>
          </View>

          {/* Permissions - Shown as Bullet Points */}
          <View style={tw`mt-4`}>
            <Text style={tw`font-semibold text-black mb-3`}>Permissions</Text>

            {getPermissions().length > 0 ? (
              <View style={tw`pl-1`}>
                {getPermissions().map((perm, index) => {
                  let label = "Unknown";

                  if (perm && typeof perm === "object") {
                    const permissionObj = perm.permission || perm;
                    if (permissionObj && typeof permissionObj === "object") {
                      label =
                        permissionObj.label ||
                        permissionObj.name ||
                        "Permission";
                    } else {
                      label = perm.label || perm.name || "Permission";
                    }
                  }

                  // Skip invalid labels
                  if (
                    !label ||
                    typeof label !== "string" ||
                    label.trim() === "" ||
                    label === "string"
                  ) {
                    return null;
                  }

                  return (
                    <View key={index} style={tw`flex-row items-start mb-2`}>
                      <Text style={tw`text-gray-700 mr-2 text-lg`}>•</Text>
                      <Text style={tw`text-gray-700 flex-1`}>{label}</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={tw`text-gray-500`}>No permissions found</Text>
            )}
          </View>
        </View>

        {/* Save Button */}

        {isEditing && (
          <TouchableOpacity
            onPress={handleUpdateMembership}
            disabled={updating}
            style={tw`
bg-red-500
py-3
rounded-xl
items-center
mt-6
${updating ? "opacity-50" : ""}
`}
          >
            <Text style={tw`text-white font-semibold`}>
              {updating ? "Updating..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
