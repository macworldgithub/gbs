import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../../src/utils/config";
import { getUserData } from "../../src/utils/storage";

const OfferCard = ({ offer, onOfferUpdated, onOfferDeleted }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: offer.title || "",
    discount: offer.discount || "",
    expiryDate: offer.expiryDate ? offer.expiryDate.split("T")[0] : "",
    description: offer.description || "",
  });

  // 🔹 Update Offer
  const handleUpdate = async () => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      await axios.patch(`${API_BASE_URL}/offer/${offer._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Offer updated successfully!");
      setModalVisible(false);
      if (onOfferUpdated) onOfferUpdated(); // parent refresh
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to update offer");
    }
  };

  // 🔹 Delete Offer
  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this offer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const userData = await getUserData();
              const token = userData?.token;

              await axios.delete(`${API_BASE_URL}/offer/${offer._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Deleted", "Offer deleted successfully!");
              if (onOfferDeleted) onOfferDeleted(offer._id);
            } catch (err) {
              console.error("Delete error:", err.response?.data || err.message);
              Alert.alert("Error", "Failed to delete offer");
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <View
        style={tw`bg-white rounded-xl shadow p-4 mb-4 border border-gray-200`}
      >
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <View style={tw`flex-row items-center`}>
            <MaterialIcons name="card-giftcard" size={20} color="#DC2626" />
            <Text style={tw`ml-2 text-base font-bold text-gray-900`}>
              {offer.title}
            </Text>
          </View>

          {/* Update + Delete */}
          <View style={tw`flex-row`}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={tw`mr-2`}
            >
              <MaterialIcons name="edit" size={22} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <MaterialIcons name="delete" size={22} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Discount */}
        <Text style={tw`text-sm font-semibold text-red-600`}>
          {offer.discount}
        </Text>

        {/* Business */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>
          {offer.business?.companyName}
        </Text>

        {/* Category */}
        <View style={tw`flex-row items-center mt-1`}>
          <Text
            style={tw`text-xs px-2 py-1 rounded-full ${
              offer.offerType === "Member"
                ? "bg-red-100 text-red-600"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            {offer.offerType}
          </Text>
          <Text style={tw`text-xs text-gray-500 ml-2`}>{offer.category}</Text>
        </View>

        {/* Description */}
        <Text style={tw`text-sm text-gray-700 mb-2`}>{offer.description}</Text>

        {/* Expiry */}
        <Text style={tw`text-xs text-gray-500`}>
          Expires: {new Date(offer.expiryDate).toLocaleDateString()}
        </Text>
      </View>

      {/* Update Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white rounded-lg p-4 w-11/12`}>
            <Text style={tw`text-lg font-bold mb-3`}>Update Offer</Text>

            <TextInput
              style={tw`border border-gray-300 p-2 mb-2 rounded`}
              placeholder="Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            <TextInput
              style={tw`border border-gray-300 p-2 mb-2 rounded`}
              placeholder="Discount"
              value={formData.discount}
              onChangeText={(text) =>
                setFormData({ ...formData, discount: text })
              }
            />
            <TextInput
              style={tw`border border-gray-300 p-2 mb-2 rounded`}
              placeholder="Expiry Date (YYYY-MM-DD)"
              value={formData.expiryDate}
              onChangeText={(text) =>
                setFormData({ ...formData, expiryDate: text })
              }
            />
            <TextInput
              style={tw`border border-gray-300 p-2 mb-4 rounded`}
              placeholder="Description"
              multiline
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />

            <View style={tw`flex-row justify-end`}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={tw`mr-3`}
              >
                <Text style={tw`text-gray-500`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate}>
                <Text style={tw`text-red-500 font-bold`}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default OfferCard;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { MaterialIcons } from "@expo/vector-icons";
// import axios from "axios";
// import { API_BASE_URL } from "../../src/utils/config";
// import { getUserData } from "../../src/utils/storage";
// import { launchImageLibrary } from "react-native-image-picker";

// const OfferCard = ({ offer, onOfferUpdated, onOfferDeleted }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     title: offer.title || "",
//     discount: offer.discount || "",
//     expiryDate: offer.expiryDate ? offer.expiryDate.split("T")[0] : "",
//     description: offer.description || "",
//   });

//   // 🔹 Update Offer
//   const handleUpdate = async () => {
//     try {
//       const userData = await getUserData();
//       const token = userData?.token;

//       await axios.patch(`${API_BASE_URL}/offer/${offer._id}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       Alert.alert("Success", "Offer updated successfully!");
//       setModalVisible(false);
//       if (onOfferUpdated) onOfferUpdated(); // parent refresh
//     } catch (err) {
//       console.error("Update error:", err.response?.data || err.message);
//       Alert.alert("Error", "Failed to update offer");
//     }
//   };

//   // 🔹 Delete Offer
//   const handleDelete = async () => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this offer?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const userData = await getUserData();
//               const token = userData?.token;

//               await axios.delete(`${API_BASE_URL}/offer/${offer._id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//               });

//               Alert.alert("Deleted", "Offer deleted successfully!");
//               if (onOfferDeleted) onOfferDeleted(offer._id);
//             } catch (err) {
//               console.error("Delete error:", err.response?.data || err.message);
//               Alert.alert("Error", "Failed to delete offer");
//             }
//           },
//         },
//       ]
//     );
//   };

//   // 🔹 Image Upload
//   const handleImageUpload = async () => {
//     try {
//       const options = {
//         mediaType: "photo",
//         includeBase64: false,
//       };

//       launchImageLibrary(options, async (response) => {
//         if (response.didCancel) {
//           return;
//         }
//         if (response.errorCode) {
//           console.error("ImagePicker Error:", response.errorMessage);
//           Alert.alert("Error", "Failed to pick image");
//           return;
//         }

//         const file = response.assets[0];
//         const fileName = file.fileName || `offer-${offer._id}.jpg`;
//         const fileType = file.type || "image/jpeg";

//         try {
//           const userData = await getUserData();
//           const token = userData?.token;

//           // Step 1: Get pre-signed S3 upload URL
//           const url = `${API_BASE_URL}/offer/${offer._id}/image/upload-url?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}`;
//           const res = await fetch(url, {
//             method: "GET",
//             headers: {
//               accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           if (!res.ok) throw new Error("Failed to get upload URL");

//           const { url: uploadUrl, key } = await res.json();

//           // Step 2: Upload file directly to S3
//           const uploadRes = await fetch(uploadUrl, {
//             method: "PUT",
//             headers: { "Content-Type": fileType },
//             body: { uri: file.uri },
//           });

//           if (!uploadRes.ok) throw new Error("Failed to upload file to S3");

//           // Step 3: Tell backend the final fileKey
//           const patchRes = await fetch(
//             `${API_BASE_URL}/offer/${offer._id}/image`,
//             {
//               method: "PATCH",
//               headers: {
//                 "Content-Type": "application/json",
//                 accept: "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({ fileKey: key }),
//             }
//           );

//           if (!patchRes.ok) throw new Error("Failed to update offer image");

//           Alert.alert("Success", "Offer image uploaded successfully!");
//           if (onOfferUpdated) onOfferUpdated();
//         } catch (err) {
//           console.error("Upload error:", err);
//           Alert.alert("Error", "Image upload failed!");
//         }
//       });
//     } catch (err) {
//       console.error("Upload error:", err);
//       Alert.alert("Error", "Image upload failed!");
//     }
//   };

//   return (
//     <>
//       <View
//         style={tw`bg-white rounded-xl shadow p-4 mb-4 border border-gray-200`}
//       >
//         {/* Header */}
//         <View style={tw`flex-row justify-between items-center mb-2`}>
//           <View style={tw`flex-row items-center`}>
//             <MaterialIcons name="card-giftcard" size={20} color="#DC2626" />
//             <Text style={tw`ml-2 text-base font-bold text-gray-900`}>
//               {offer.title}
//             </Text>
//           </View>

//           {/* Update + Delete + Image Upload */}
//           <View style={tw`flex-row`}>
//             <TouchableOpacity
//               onPress={() => setModalVisible(true)}
//               style={tw`mr-2`}
//             >
//               <MaterialIcons name="edit" size={22} color="#2563EB" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleImageUpload} style={tw`mr-2`}>
//               <MaterialIcons name="image" size={22} color="#10B981" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleDelete}>
//               <MaterialIcons name="delete" size={22} color="#DC2626" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Discount */}
//         <Text style={tw`text-sm font-semibold text-red-600`}>
//           {offer.discount}
//         </Text>

//         {/* Business */}
//         <Text style={tw`text-sm text-gray-700 mb-1`}>
//           {offer.business?.companyName}
//         </Text>

//         {/* Category */}
//         <View style={tw`flex-row items-center mt-1`}>
//           <Text
//             style={tw`text-xs px-2 py-1 rounded-full ${
//               offer.offerType === "Member"
//                 ? "bg-red-100 text-red-600"
//                 : "bg-purple-100 text-purple-600"
//             }`}
//           >
//             {offer.offerType}
//           </Text>
//           <Text style={tw`text-xs text-gray-500 ml-2`}>{offer.category}</Text>
//         </View>

//         {/* Description */}
//         <Text style={tw`text-sm text-gray-700 mb-2`}>{offer.description}</Text>

//         {/* Expiry */}
//         <Text style={tw`text-xs text-gray-500`}>
//           Expires: {new Date(offer.expiryDate).toLocaleDateString()}
//         </Text>
//       </View>

//       {/* Update Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//         >
//           <View style={tw`bg-white rounded-lg p-4 w-11/12`}>
//             <Text style={tw`text-lg font-bold mb-3`}>Update Offer</Text>

//             <TextInput
//               style={tw`border border-gray-300 p-2 mb-2 rounded`}
//               placeholder="Title"
//               value={formData.title}
//               onChangeText={(text) => setFormData({ ...formData, title: text })}
//             />
//             <TextInput
//               style={tw`border border-gray-300 p-2 mb-2 rounded`}
//               placeholder="Discount"
//               value={formData.discount}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, discount: text })
//               }
//             />
//             <TextInput
//               style={tw`border border-gray-300 p-2 mb-2 rounded`}
//               placeholder="Expiry Date (YYYY-MM-DD)"
//               value={formData.expiryDate}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, expiryDate: text })
//               }
//             />
//             <TextInput
//               style={tw`border border-gray-300 p-2 mb-4 rounded`}
//               placeholder="Description"
//               multiline
//               value={formData.description}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, description: text })
//               }
//             />

//             <View style={tw`flex-row justify-end`}>
//               <TouchableOpacity
//                 onPress={() => setModalVisible(false)}
//                 style={tw`mr-3`}
//               >
//                 <Text style={tw`text-gray-500`}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleUpdate}>
//                 <Text style={tw`text-red-500 font-bold`}>Update</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default OfferCard;
