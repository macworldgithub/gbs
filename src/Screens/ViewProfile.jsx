// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import tw from "twrnc";
// import { getUserData } from "../utils/storage";
// import { Ionicons } from "@expo/vector-icons";
// import moment from "moment";

// const BASE_URL = "https://gbs.westsidecarcare.com.au/user";

// export default function ViewProfile() {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//     const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//     const [anniversary, setAnniversary] = useState(null);
//     const [renewalDue, setRenewalDue] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const storedUser = await getUserData();
//         if (!storedUser || !storedUser._id) {
//           console.warn("No user found in storage");
//           setLoading(false);
//           return;
//         }

//         setUser(storedUser);

//         const res = await fetch(`${BASE_URL}/${storedUser._id}`);
//         const data = await res.json();

//         if (res.ok) {
//           setProfile(data);
//         } else {
//           console.error("Error fetching profile:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <View style={tw`flex-1 justify-center items-center bg-white`}>
//         <ActivityIndicator size="large" color="red" />
//         <Text style={tw`text-gray-500 mt-2`}>Loading Profile...</Text>
//       </View>
//     );
//   }

//   if (!profile) {
//     return (
//       <View style={tw`flex-1 justify-center items-center bg-white`}>
//         <Text style={tw`text-gray-500`}>Profile not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={tw`flex-1 bg-white pt-12`}>
//       <View style={tw`px-4 pb-2 flex-row items-center`}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={tw`pr-3 py-2`}
//         >
//           <Ionicons name="chevron-back" size={24} color="#111" />
//         </TouchableOpacity>
//         <Text style={tw`text-lg font-bold text-black`}>Member Detail</Text>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#ed292e" style={tw`mt-10`} />
//       ) : error ? (
//         <View style={tw`px-4 mt-10`}>
//           <Text style={tw`text-red-500`}>{error}</Text>
//           <TouchableOpacity
//             onPress={fetchUser}
//             style={tw`mt-3 bg-red-500 px-4 py-2 rounded`}
//           >
//             <Text style={tw`text-white text-center`}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : !user ? (
//         <Text style={tw`text-center text-gray-500 mt-10`}>No user found.</Text>
//       ) : (
//         <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
//           <View style={tw`items-center mt-4`}>
//             <Image
//               source={
//                 user.avatarUrl
//                   ? { uri: user.avatarUrl }
//                   : require("../../assets/user.jpg")
//               }
//               style={tw`w-28 h-28 rounded-full`}
//             />
//             <Text style={tw`text-xl font-bold text-black mt-3`}>
//               {user.name}
//             </Text>
//             <Text style={tw`text-red-500 mt-1`}>{user.email}</Text>
//             <Text style={tw`text-gray-600 mt-1`}>{user.phone || "N/A"}</Text>
//             <Text style={tw`text-gray-500 mt-1`}>
//               State: {user.state || "N/A"}
//             </Text>
//           </View>

//           {/* Anniversary / Member info card: include Member since, Business and Interested In here */}
//           <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
//             {/* Member since (from createdAt) */}
//             {user?.createdAt ? (
//               <View style={tw`mb-3`}>
//                 <Text style={tw`text-black font-semibold`}>Member since</Text>
//                 <Text style={tw`text-gray-700`}>
//                   {moment(user.createdAt).format("MMMM DD, YYYY")}
//                 </Text>
//               </View>
//             ) : null}

//             {/* Business and Interested In moved below (where Trusted Devices was) */}

//             {/* Anniversary date and renewal notice */}
//             {anniversary ? (
//               <View style={tw`mt-2`}>
//                 <Text style={tw`text-black font-semibold`}>
//                   Member Anniversary Date:
//                 </Text>
//                 <Text style={tw`text-red-500`}>
//                   {moment(anniversary).format("MMMM DD, YYYY")}
//                 </Text>
//                 {renewalDue && (
//                   <Text style={tw`text-yellow-600 mt-1 font-medium`}>
//                     Annual Renewal Due Soon!
//                   </Text>
//                 )}
//               </View>
//             ) : null}
//           </View>

//           <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
//             <Text style={tw`text-black font-semibold mb-2`}>
//               Activated Package
//             </Text>
//             <Text style={tw`text-gray-700 font-bold`}>
//               {user?.activatedPackage?.role?.label || "Member"}
//             </Text>
//             {Array.isArray(user?.activatedPackage?.role?.permissions) && (
//               <View style={tw`mt-3`}>
//                 <Text style={tw`text-black font-semibold mb-1`}>
//                   Permissions:
//                 </Text>
//                 {user.activatedPackage.role.permissions.slice(0, 5).map((p) => (
//                   <Text
//                     key={p._id || p.permission?._id}
//                     style={tw`text-gray-700`}
//                   >
//                     • {p.permission?.label || p.permission?.name}
//                   </Text>
//                 ))}
//               </View>
//             )}
//           </View>

//           {/* Business & Interested In card (replaces Trusted Devices location) */}
//           {(user?.business?.name ||
//             (Array.isArray(user.interestedIn) &&
//               user.interestedIn.length > 0)) && (
//             <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
//               {user?.business?.name ? (
//                 <View style={tw`mb-3`}>
//                   <Text style={tw`text-black font-semibold`}>Business</Text>
//                   <Text style={tw`text-gray-700`}>{user.business.name}</Text>
//                 </View>
//               ) : null}

//               {Array.isArray(user.interestedIn) &&
//               user.interestedIn.length > 0 ? (
//                 <View style={tw`mb-3`}>
//                   <Text style={tw`text-black font-semibold`}>
//                     Interested In
//                   </Text>
//                   {user.interestedIn.map((it, idx) => (
//                     <Text key={it._id || idx} style={tw`text-gray-700`}>
//                       • {it.label || it.name || it}
//                     </Text>
//                   ))}
//                 </View>
//               ) : null}
//             </View>
//           )}
//         </ScrollView>
//       )}
//     </View>
//   );
// }
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
import moment from "moment";

const BASE_URL = "https://gbs.westsidecarcare.com.au/user";

export default function ViewProfile({ navigation }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ added error state
  const [anniversary, setAnniversary] = useState(null); // optional if needed
  const [renewalDue, setRenewalDue] = useState(false); // optional if needed

  // ✅ New states for editable fields
  const [shortBio, setShortBio] = useState("");
  const [hobbiesInput, setHobbiesInput] = useState(""); // Comma-separated input
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchUser = async () => {
    try {
      console.log("🔍 Fetching user data...");
      setLoading(true);
      setError(null);

      const storedUser = await getUserData();
      console.log("📦 Stored user:", storedUser);
      if (!storedUser || !storedUser._id) {
        setError("No user found in storage");
        setLoading(false);
        return;
      }

      setUser(storedUser);

      const res = await fetch(`${BASE_URL}/${storedUser._id}`);
      const data = await res.json();
      console.log("📥 Fetched profile data:", data);

      if (res.ok) {
        setProfile(data);
        // optionally set anniversary or renewal info
        if (data?.anniversaryDate) setAnniversary(data.anniversaryDate);

        // ✅ Initialize editable fields from profile
        setShortBio(data?.shortBio || "");
        setHobbiesInput((data?.hobbies || []).join(", "));
        setLat(data?.location?.lat?.toString() || "");
        setLng(data?.location?.lng?.toString() || "");
      } else {
        setError(data?.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMembership = async () => {
    try {
      console.log("🔄 Starting update...");
      setUpdating(true);
      setError(null);

      if (!user?._id) {
        setError("No user ID available");
        return;
      }

      // ✅ Prepare hobbies array from comma-separated input
      const hobbies = hobbiesInput
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      // ✅ Prepare location object
      const location = {};
      if (lat && !isNaN(lat)) location.lat = parseFloat(lat);
      if (lng && !isNaN(lng)) location.lng = parseFloat(lng);

      const updateData = {
        shortBio: shortBio.trim(),
        hobbies,
        location,
      };

      console.log("📤 Update payload:", updateData);

      const res = await fetch(`${BASE_URL}/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await res.json();
      console.log("📥 Update response:", responseData);

      if (res.ok) {
        // ✅ Refetch profile to update UI
        await fetchUser();
        console.log("✅ Update successful!");
      } else {
        setError(responseData?.message || "Failed to update");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      setError(err.message || "Something went wrong during update");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="red" />
        <Text style={tw`text-gray-500 mt-2`}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white px-4`}>
        <Text style={tw`text-red-500 mb-4`}>{error}</Text>
        <TouchableOpacity
          onPress={fetchUser}
          style={tw`bg-red-500 px-4 py-2 rounded`}
        >
          <Text style={tw`text-white`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-gray-500`}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white pt-12`}>
      {/* Header */}
      <View style={tw`px-4 pb-2 flex-row items-center`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`pr-3 py-2`}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-black`}>View Profile</Text>
      </View>

      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        <View style={tw`items-center mt-4`}>
          <Image
            source={
              profile?.avatarUrl
                ? { uri: profile.avatarUrl }
                : require("../../assets/user.jpg")
            }
            style={tw`w-28 h-28 rounded-full`}
          />
          <Text style={tw`text-xl font-bold text-black mt-3`}>
            {profile?.name || "No Name"}
          </Text>
          <Text style={tw`text-red-500 mt-1`}>{profile?.email || "N/A"}</Text>
          <Text style={tw`text-gray-600 mt-1`}>{profile?.phone || "N/A"}</Text>
          <Text style={tw`text-gray-500 mt-1`}>
            State: {profile?.state || "N/A"}
          </Text>
        </View>

        {/* Info Card */}
        <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
          {profile?.createdAt && (
            <View style={tw`mb-3`}>
              <Text style={tw`text-black font-semibold`}>Member since</Text>
              <Text style={tw`text-gray-700`}>
                {moment(profile.createdAt).format("MMMM DD, YYYY")}
              </Text>
            </View>
          )}

          {anniversary && (
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
          )}
        </View>

        {/* Package Info */}
        <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
          <Text style={tw`text-black  mb-2`}>Activated Package: </Text>
          <Text style={tw`text-gray-700 font-bold`}>
            {profile?.activatedPackage?.role?.label || "Member"}
          </Text>
          {Array.isArray(profile?.activatedPackage?.role?.permissions) && (
            <View style={tw`mt-3`}>
              <Text style={tw`text-black font-semibold mb-1`}>
                Permissions:
              </Text>
              {profile.activatedPackage.role.permissions
                .slice(0, 5)
                .map((p, i) => (
                  <Text key={i} style={tw`text-gray-700`}>
                    • {p.permission?.label || p.permission?.name}
                  </Text>
                ))}
            </View>
          )}
        </View>

        {/* Business Info */}
        {(profile?.business?.name ||
          (Array.isArray(profile.interestedIn) &&
            profile.interestedIn.length > 0)) && (
          <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
            {profile?.business?.name && (
              <View style={tw`mb-3`}>
                <Text style={tw`text-black font-semibold`}>Business</Text>
                <Text style={tw`text-gray-700`}>{profile.business.name}</Text>
              </View>
            )}

            {Array.isArray(profile.interestedIn) &&
              profile.interestedIn.length > 0 && (
                <View>
                  <Text style={tw`text-black font-semibold`}>
                    Interested In
                  </Text>
                  {profile.interestedIn.map((it, idx) => (
                    <Text key={idx} style={tw`text-gray-700`}>
                      • {it.label || it.name || it}
                    </Text>
                  ))}
                </View>
              )}
          </View>
        )}

        {/* ✅ New Membership Level Section */}
        <View style={tw`mt-6 bg-gray-100 rounded-xl p-4`}>
          <Text style={tw`text-black font-semibold mb-3 text-lg`}>
            Membership Level
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
            <View style={tw`flex-row`}>
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-gray-600 text-xs mb-1`}>Latitude</Text>
                <TextInput
                  style={tw`bg-white p-3 rounded border border-gray-300`}
                  value={lat}
                  onChangeText={setLat}
                  placeholder="e.g., -37.840935"
                  keyboardType="numeric"
                />
              </View>
              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-gray-600 text-xs mb-1`}>Longitude</Text>
                <TextInput
                  style={tw`bg-white p-3 rounded border border-gray-300`}
                  value={lng}
                  onChangeText={setLng}
                  placeholder="e.g., 144.946457"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            onPress={handleUpdateMembership}
            disabled={updating}
            style={tw`bg-red-500 py-3 rounded-xl items-center ${
              updating ? "opacity-50" : ""
            }`}
          >
            <Text style={tw`text-white font-semibold`}>
              {updating ? "Updating..." : "Update Membership Level"}
            </Text>
          </TouchableOpacity>

          {error && (
            <Text style={tw`text-red-500 text-center mt-2 text-sm`}>
              {error}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
