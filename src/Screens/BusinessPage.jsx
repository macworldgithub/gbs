import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import Cards from "../../components/Cards";
const businessMetrics = [
  {
    id: 1,
    icon: <MaterialIcons name="trending-up" size={18} color="#DC2626" />,
    value: "127%",
    label: "Growth Rate",
  },
  {
    id: 2,
    icon: <FontAwesome5 name="users" size={18} color="#DC2626" />,
    value: "450+",
    label: "Business Members",
  },
];

const BusinessPage = () => {
  return (
    <View style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Section Title */}
      <Text style={tw`text-xs font-bold text-gray-800 mb-1 mt-16`}>Business</Text>
      <Text style={tw`text-sm text-gray-600 mb-4`}>
        Connect with business professionals, access industry insights, and
        explore partnership opportunities.
      </Text>

      {/* Metrics */}
      <Text style={tw`text-xs font-bold text-gray-800 mb-2`}>
        Business Metrics
      </Text>
      <View style={tw`flex-row gap-4 mb-4`}>
        {businessMetrics.map((metric) => (
          <View
            key={metric.id}
            style={tw`flex-1 items-center bg-gray-100 rounded-lg py-4`}
          >
            {metric.icon}
            <Text style={tw`text-lg font-bold text-gray-800 mt-2`}>
              {metric.value}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>{metric.label}</Text>
          </View>
        ))}
      </View>

      {/* Upcoming Events Header */}
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-sm font-semibold text-gray-800`}>
          Upcoming Events
        </Text>
        <TouchableOpacity>
          <Text style={tw`text-sm text-red-500`}>See all events</Text>
        </TouchableOpacity>
      </View>

      <Cards/>
    </View>
  );
};

export default BusinessPage;
