// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Linking,
//   Alert,
// } from "react-native";
// import axios from "axios";
// import tw from "tailwind-react-native-classnames";
// import { API_BASE_URL } from "../utils/config";
// import { getUserData } from "../utils/storage";
// import { MaterialIcons } from "@expo/vector-icons";

// const OfferDetails = ({ route, navigation }) => {
//   const { id } = route.params;
//   const [offer, setOffer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchOfferDetail = async () => {
//     try {
//       setLoading(true);

//       const userData = await getUserData();
//       const token = userData?.token;

//       const response = await axios.get(`${API_BASE_URL}/offer/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOffer(response.data);
//     } catch (err) {
//       console.error("Offer detail error:", err.response?.data || err.message);
//       setError("Failed to fetch offer details");
//       Alert.alert("Error", "Failed to fetch offer details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOfferDetail();
//   }, [id]);

//   if (loading) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <ActivityIndicator size="large" color="#EF4444" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <Text style={tw`text-red-500`}>{error}</Text>
//       </View>
//     );
//   }

//   if (!offer) return null;

//   return (
//     <View style={tw`flex-1 bg-white mt-8`}>
//       {/* Top Header */}
//       <View style={tw`flex-row items-center bg-red-500 px-4 py-3 mt-8`}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
//           <MaterialIcons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={tw`text-white text-lg font-bold`}>Offer Details</Text>
//       </View>

//       <ScrollView style={tw`flex-1 p-4`}>
//         <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>{offer.title}</Text>

//         {offer.discount && (
//           <Text style={tw`text-red-600 text-xl font-bold mb-4`}>
//             {offer.discount}
//           </Text>
//         )}

//         <Text style={tw`text-gray-700 text-base mb-4`}>{offer.description}</Text>

//         <View style={tw`mb-4 bg-gray-50 p-3 rounded-lg shadow-sm`}>
//           <Text style={tw`text-sm text-gray-500`}>Type: {offer.offerType}</Text>
//           <Text style={tw`text-sm text-gray-500`}>Category: {offer.category}</Text>
//           <Text style={tw`text-sm text-gray-500`}>
//             Expires: {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : "-"}
//           </Text>
//         </View>

//         {offer.termsAndConditions?.length > 0 && (
//           <View style={tw`bg-gray-100 p-3 rounded-lg shadow-sm mb-4`}>
//             <Text style={tw`font-bold text-gray-700 mb-2`}>Terms & Conditions</Text>
//             {offer.termsAndConditions.map((term, idx) => (
//               <Text key={idx} style={tw`text-xs text-gray-600`}>• {term}</Text>
//             ))}
//           </View>
//         )}

//         {offer.howToRedeem && (
//           <View style={tw`bg-gray-100 p-3 rounded-lg shadow-sm mb-4`}>
//             <Text style={tw`font-bold text-gray-700 mb-2`}>How to Redeem</Text>
//             <Text style={tw`text-xs text-gray-600`}>{offer.howToRedeem}</Text>
//           </View>
//         )}

//         <View style={tw`flex-row justify-between mt-4`}>
//           {offer.contactPhone && (
//             <TouchableOpacity
//               style={tw`flex-1 bg-red-500 py-3 rounded-lg mr-2`}
//               onPress={() => Linking.openURL(`tel:${offer.contactPhone}`)}
//             >
//               <Text style={tw`text-white text-center font-bold`}>Call</Text>
//             </TouchableOpacity>
//           )}
//           {offer.contactEmail && (
//             <TouchableOpacity
//               style={tw`flex-1 bg-red-500 py-3 rounded-lg mr-2`}
//               onPress={() => Linking.openURL(`mailto:${offer.contactEmail}`)}
//             >
//               <Text style={tw`text-white text-center font-bold`}>Email</Text>
//             </TouchableOpacity>
//           )}
//           {offer.website && (
//             <TouchableOpacity
//               style={tw`flex-1 bg-red-500 py-3 rounded-lg`}
//               onPress={() => Linking.openURL(offer.website)}
//             >
//               <Text style={tw`text-white text-center font-bold`}>Visit</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default OfferDetails;





// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Linking,
//   Alert,
//   TextInput,
// } from "react-native";
// import axios from "axios";
// import tw from "tailwind-react-native-classnames";
// import { API_BASE_URL } from "../utils/config";
// import { getUserData } from "../utils/storage";
// import { MaterialIcons } from "@expo/vector-icons";
// import { FontAwesome } from "@expo/vector-icons";

// const OfferDetails = ({ route, navigation }) => {
//   const { id } = route.params;
//   const [offer, setOffer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

 
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");

//   const fetchOfferDetail = async () => {
//     try {
//       setLoading(true);
//       const userData = await getUserData();
//       const token = userData?.token;

//       const response = await axios.get(`${API_BASE_URL}/offer/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOffer(response.data);
//     } catch (err) {
//       console.error("Offer detail error:", err.response?.data || err.message);
//       setError("Failed to fetch offer details");
//       Alert.alert("Error", "Failed to fetch offer details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOfferDetail();
//   }, [id]);

//   if (loading) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <ActivityIndicator size="large" color="#EF4444" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <Text style={tw`text-red-500`}>{error}</Text>
//       </View>
//     );
//   }

//   if (!offer) return null;

//   return (
//     <View style={tw`flex-1 bg-white mt-8`}>
//       {/* Top Header */}
//       <View style={tw`flex-row items-center bg-red-500 px-4 py-3 `}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
//           <MaterialIcons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={tw`text-white text-lg font-bold`}>Offer Details</Text>
//       </View>

//       <ScrollView style={tw`flex-1 p-4`}>
//         <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
//           {offer.title}
//         </Text>

//         {offer.discount && (
//           <Text style={tw`text-red-600 text-xl font-bold mb-4`}>
//             {offer.discount}
//           </Text>
//         )}

//         <Text style={tw`text-gray-700 text-base mb-4`}>
//           {offer.description}
//         </Text>

//         <View style={tw`mb-4 bg-gray-50 p-3 rounded-lg shadow-sm`}>
//           <Text style={tw`text-sm text-gray-500`}>Type: {offer.offerType}</Text>
//           <Text style={tw`text-sm text-gray-500`}>
//             Category: {offer.category}
//           </Text>
//           <Text style={tw`text-sm text-gray-500`}>
//             Expires:{" "}
//             {offer.expiryDate
//               ? new Date(offer.expiryDate).toLocaleDateString()
//               : "-"}
//           </Text>
//         </View>

//         {offer.termsAndConditions?.length > 0 && (
//           <View style={tw`bg-gray-100 p-3 rounded-lg shadow-sm mb-4`}>
//             <Text style={tw`font-bold text-gray-700 mb-2`}>
//               Terms & Conditions
//             </Text>
//             {offer.termsAndConditions.map((term, idx) => (
//               <Text key={idx} style={tw`text-xs text-gray-600`}>
//                 • {term}
//               </Text>
//             ))}
//           </View>
//         )}

//         {offer.howToRedeem && (
//           <View style={tw`bg-gray-100 p-3 rounded-lg shadow-sm mb-4`}>
//             <Text style={tw`font-bold text-gray-700 mb-2`}>How to Redeem</Text>
//             <Text style={tw`text-xs text-gray-600`}>{offer.howToRedeem}</Text>
//           </View>
//         )}

//         <View style={tw`flex-row justify-between mt-4`}>
//           {offer.contactPhone && (
//             <TouchableOpacity
//               style={tw`flex-1 bg-red-500 py-3 rounded-lg mr-2`}
//               onPress={() => Linking.openURL(`tel:${offer.contactPhone}`)}
//             >
//               <Text style={tw`text-white text-center font-bold`}>Call</Text>
//             </TouchableOpacity>
//           )}
//           {offer.contactEmail && (
//             <TouchableOpacity
//               style={tw`flex-1 bg-red-500 py-3 rounded-lg mr-2`}
//               onPress={() => Linking.openURL(`mailto:${offer.contactEmail}`)}
//             >
//               <Text style={tw`text-white text-center font-bold`}>Email</Text>
//             </TouchableOpacity>
//           )}
//           {offer.website && (
//             <TouchableOpacity
//               style={tw`flex-1 bg-red-500 py-3 rounded-lg`}
//               onPress={() => Linking.openURL(offer.website)}
//             >
//               <Text style={tw`text-white text-center font-bold`}>Visit</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* ⭐ Rating & Comment Section */}
//         <View style={tw`mt-8 bg-gray-50 p-4 rounded-lg shadow`}>
//           <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
//             Rate this Offer
//           </Text>

         
//           <View style={tw`flex-row mb-4`}>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <TouchableOpacity key={star} onPress={() => setRating(star)}>
//                 <FontAwesome
//                   name={star <= rating ? "star" : "star-o"}
//                   size={28}
//                   color={star <= rating ? "#facc15" : "#9ca3af"} 
//                   style={tw`mr-2`}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>

         
//           <TextInput
//             placeholder="Write your comment here..."
//             value={comment}
//             onChangeText={setComment}
//             multiline
//             style={tw`border border-gray-300 rounded-lg p-3 text-gray-700 bg-white`}
//           />

          
//           <TouchableOpacity
//             style={tw`bg-red-500 py-3 rounded-lg mt-4`}
//             onPress={() => Alert.alert("Info", "Submit action not implemented")}
//           >
//             <Text style={tw`text-white text-center font-bold`}>Submit</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default OfferDetails;
   


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const OfferDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ UI state for rating/comment
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOfferDetail = async () => {
    try {
      setLoading(true);
      const userData = await getUserData();
      const token = userData?.token;

      const response = await axios.get(`${API_BASE_URL}/offer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffer(response.data);
    } catch (err) {
      console.error("Offer detail error:", err.response?.data || err.message);
      setError("Failed to fetch offer details");
      Alert.alert("Error", "Failed to fetch offer details");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Submit review
  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Error", "Please write a comment");
      return;
    }

    try {
      setSubmitting(true);
      const userData = await getUserData();
      const token = userData?.token;

      const response = await axios.post(
        `${API_BASE_URL}/offer/${id}/review`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Your review has been submitted!");
      setComment("");
      setRating(0);

      setOffer(response.data);
    } catch (err) {
      console.error("Review submit error:", err.response?.data || err.message);
      const errorResponse = err.response?.data;
      if (errorResponse?.statusCode === 409 && errorResponse?.error === "Conflict" && errorResponse?.message === "User has already reviewed this offer") {
        Alert.alert("Alert", "You have already reviewed this offer");
      } else {
        Alert.alert("Error", "Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ⭐ Delete review function
  const deleteReview = async (reviewId) => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      await axios.delete(`${API_BASE_URL}/offer/${id}/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffer((prevOffer) => ({
        ...prevOffer,
        reviews: prevOffer.reviews.filter((rev) => rev._id !== reviewId),
      }));
      Alert.alert("Success", "Review deleted successfully");
    } catch (err) {
      console.error("Delete review error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to delete review");
    }
  };

  // Placeholder for edit review (to be implemented with a form)
  const editReview = (review) => {
    // Implement edit logic here, e.g., open a modal with TextInput for comment and rating selection
    Alert.alert("Info", "Edit functionality to be implemented");
  };

  useEffect(() => {
    fetchOfferDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>{error}</Text>
      </View>
    );
  }

  if (!offer) return null;

  // ⭐ Calculate overall rating
  const reviews = offer.reviews || [];
  const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

  return (
    <View style={tw`flex-1 bg-white mt-8`}>
      <ScrollView style={tw`flex-1`}>
        {/* Top Header */}
        <View style={tw`flex-row items-center bg-red-500 px-4 py-3`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-white text-lg font-bold`}>Offer Details</Text>
        </View>

        {/* Content */}
        <View style={tw`p-4`}>
          <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
            {offer.title}
          </Text>

          {offer.discount && (
            <Text style={tw`text-red-600 text-xl font-bold mb-4`}>
              {offer.discount}
            </Text>
          )}

          <Text style={tw`text-gray-700 text-base mb-4`}>
            {offer.description}
          </Text>

          <View style={tw`mb-4 bg-gray-50 p-3 rounded-lg shadow-sm`}>
            <Text style={tw`text-sm text-gray-500`}>Type: {offer.offerType}</Text>
            <Text style={tw`text-sm text-gray-500`}>
              Category: {offer.category}
            </Text>
            <Text style={tw`text-sm text-gray-500`}>
              Expires:{" "}
              {offer.expiryDate
                ? new Date(offer.expiryDate).toLocaleDateString()
                : "-"}
            </Text>
          </View>

          <View style={tw`mt-4 bg-yellow-50 p-4 rounded-lg shadow`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
              Overall Rating
            </Text>
            <View style={tw`flex-row items-center`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= avgRating ? "star" : "star-o"}
                  size={22}
                  color={star <= avgRating ? "#facc15" : "#9ca3af"}
                  style={tw`mr-1`}
                />
              ))}
              <Text style={tw`ml-2 text-gray-700`}>
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </Text>
            </View>
          </View>

          <View style={tw`mt-6 bg-gray-50 p-4 rounded-lg shadow`}>
          
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Reviews</Text>
            

            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <View
                  key={rev._id}
                  style={tw`mb-4 border-b border-gray-200 pb-2`}
                >
                  {/* User Name and Avatar */}
                  <View style={tw`flex-row items-center mb-2`}>
                    <Image
                      source={{ uri: rev.userId.avatarUrl }}
                      style={tw`w-8 h-8 rounded-full mr-2`}
                    />
                    <Text style={tw`text-sm font-semibold text-gray-800`}>
                      {rev.userId.name}
                    </Text>
                  </View>

                  {/* Rating Stars */}
                  <View style={tw`flex-row mb-1`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome
                        key={star}
                        name={star <= rev.rating ? "star" : "star-o"}
                        size={18}
                        color={star <= rev.rating ? "#facc15" : "#9ca3af"}
                        style={tw`mr-1`}
                      />
                    ))}
                  </View>

                  {/* Comment */}
                  <Text style={tw`text-gray-700`}>{rev.comment}</Text>

                  {/* Date */}
                  <Text style={tw`text-xs text-gray-400 mt-1`}>
                    {new Date(rev.date).toLocaleDateString()}
                  </Text>

                
                </View>
              ))
            ) : (
              <Text style={tw`text-gray-500 italic`}>
                No reviews yet. Be the first to review!
              </Text>
            )}
          </View>

          {/* ⭐ Rating & Comment Section */}
          <View style={tw`mt-6 bg-gray-50 p-4 rounded-lg shadow`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
              Rate this Offer
            </Text>

            <View style={tw`flex-row mb-4`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <FontAwesome
                    name={star <= rating ? "star" : "star-o"}
                    size={28}
                    color={star <= rating ? "#facc15" : "#9ca3af"}
                    style={tw`mr-2`}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Write a comment..."
              value={comment}
              onChangeText={setComment}
              multiline
              style={tw`border border-gray-300 rounded-lg p-3 text-black bg-white`}
            />

            <TouchableOpacity
              style={tw`bg-red-500 py-3 rounded-lg mt-4`}
              onPress={submitReview}
              disabled={submitting}
            >
              <Text style={tw`text-white text-center font-bold`}>
                {submitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferDetails;