// import React from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import tw from "tailwind-react-native-classnames";

// import HeroImage from "../././../assets/latest1.png";

// const NewsDetail = () => {
//   const navigation = useNavigation();

//   return (
//     <ScrollView style={tw`flex-1 bg-white`}>
//       {/* Header */}
//       <View style={tw`flex-row items-center justify-between px-4 pt-12 pb-6`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={tw`text-xl font-bold text-red-600`}>News Detail</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Hero Image - Saved in assets */}
//       <Image source={HeroImage} style={tw`w-full h-64`} resizeMode="cover" />

//       {/* Main Event Card */}
//       <View style={tw`px-4 mt-6`}>
//         <View
//           style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-6 mb-8`}
//         >
//           <Text style={tw`text-3xl font-bold text-center text-purple-900 mb-6`}>
//             NEW GBS GIN AVAILABLE NOW The GBS Legends London Dry Gin Bold.
//             Australian. Unapologetically Good.
//           </Text>

//           <Text style={tw`text-base text-gray-700 leading-6 mb-6`}>
//             A collaboration between GBS and Brunswick Aces celebrating mateship,
//             grit, and good humour. This isn't just gin—it's pure GBS spirit in a
//             bottle. Order now:Price: $99.95 Pickup: Brunswick Aces, Brunswick
//             East Delivery: FREE in VIC | Small charge interstate
//           </Text>

//           {/* <Text style={tw`text-base text-gray-700 leading-6 mb-8`}>
//             10% of your investment and winnings will be directed into the Punt
//             with Purpose community wellbeing program. We will use funds for
//             workshops and partnerships dedicated to Men's Health.
//           </Text> */}

//           {/* Dates */}
//           {/* <View style={tw`border-t border-gray-200 pt-4`}>
//             <Text style={tw`text-base text-gray-800 mb-2`}>
//               <Text style={tw`font-bold text-red-600`}>Start:</Text> 2/28/2025,
//               7:00:00 PM
//             </Text>
//             <Text style={tw`text-base text-gray-800 mb-2`}>
//               <Text style={tw`font-bold text-red-600`}>End:</Text> 12/31/2025,
//               4:00:00 PM
//             </Text>
//             <Text style={tw`text-base text-gray-800 mb-2`}>
//               <Text style={tw`font-bold text-red-600`}>Booking Start:</Text>{" "}
//               2/10/2025, 7:00:21 AM
//             </Text>
//             <Text style={tw`text-base text-gray-800`}>
//               <Text style={tw`font-bold text-red-600`}>Booking End:</Text>{" "}
//               12/31/2025, 7:00:00 AM
//             </Text>
//           </View> */}
//         </View>

//         {/* GIN PROMOTION SECTION - Fixed content below event */}
//         <View style={tw`mb-10`}>
//           {/* <Text style={tw`text-2xl font-bold text-center text-gray-900 mb-4`}>
//             NEW GBS GIN AVAILABLE NOW
//           </Text>
//           <Text
//             style={tw`text-lg font-semibold text-center text-gray-800 mb-4`}
//           >
//             The GBS Legends London Dry Gin{"\n"}
//             <Text style={tw`text-base font-normal`}>
//               Bold. Australian. Unapologetically Good.
//             </Text>
//           </Text>

//           <Text
//             style={tw`text-base text-gray-700 text-center leading-6 mb-6 px-4`}
//           >
//             A collaboration between GBS and Brunswick Aces celebrating mateship,
//             grit, and good humour. This isn't just gin—it's pure GBS spirit in a
//             bottle.
//           </Text> */}

//           {/* <View style={tw`bg-gray-100 rounded-xl p-5 mx-4 mb-6`}>
//             <Text style={tw`text-base text-gray-800 mb-2`}>
//               <Text style={tw`font-bold`}>Order now:</Text>
//             </Text>
//             <Text style={tw`text-base text-gray-800 mb-1`}>Price: $99.95</Text>
//             <Text style={tw`text-base text-gray-800 mb-1`}>
//               Pickup: Brunswick Aces, Brunswick East
//             </Text>
//             <Text style={tw`text-base text-gray-800`}>
//               Delivery: FREE in VIC | Small charge interstate
//             </Text>
//           </View> */}

//           {/* Buy Gin Button */}
//           <TouchableOpacity
//             onPress={() =>
//               Linking.openURL(
//                 "https://brunswickaces.com/products/gbs-london-dry-gin"
//               )
//             }
//             style={tw`bg-red-600 py-4 rounded-xl items-center mx-4`}
//           >
//             <Text style={tw`text-white text-lg font-bold`}>Order Gin Now</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default NewsDetail;

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";


import HeroImage from "../../../assets/latest1.png"; /

const NewsDetail = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 pt-12 pb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-red-600`}>News Detail</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Hero Image */}
      <Image source={HeroImage} style={tw`w-full h-64`} resizeMode="cover" />

      {/* Main Content Card */}
      <View style={tw`px-4 mt-6`}>
        <View
          style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-6 mb-8`}
        >
          {/* Title */}
          <Text style={tw`text-3xl font-bold text-center text-purple-900 mb-6`}>
            NEW GBS GIN AVAILABLE NOW{"\n"}
            The GBS Legends London Dry Gin{"\n"}
            Bold. Australian. Unapologetically Good.
          </Text>

          {/* Description */}
          <Text style={tw`text-base text-gray-700 leading-7 mb-6 px-2`}>
            A collaboration between GBS and Brunswick Aces celebrating mateship,
            grit, and good humour. This isn't just gin—it's pure GBS spirit in a
            bottle.
          </Text>

          {/* Order Details */}
          <View style={tw`bg-gray-100 rounded-xl p-5 mx-2`}>
            <Text style={tw`text-base text-gray-800 font-bold mb-3`}>
              Order now:
            </Text>
            <Text style={tw`text-base text-gray-800`}>Price: $99.95</Text>
            <Text style={tw`text-base text-gray-800`}>
              Pickup: Brunswick Aces, Brunswick East
            </Text>
            <Text style={tw`text-base text-gray-800`}>
              Delivery: FREE in VIC | Small charge interstate
            </Text>
          </View>
        </View>

        {/* Order Button */}
        <View style={tw`mb-12`}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://brunswickaces.com/products/gbs-london-dry-gin"
              )
            }
            style={tw`bg-red-600 py-4 rounded-xl items-center mx-4`}
          >
            <Text style={tw`text-white text-lg font-bold`}>Order Gin Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default NewsDetail;
