import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

// Initial member data
const initialMembersData = [
  {
    id: "1",
    name: "John Smith",
    company: "Smith Logistics",
    role: "Business Executive Members",
    image: require("../../assets/john.png"),
    liked: false,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    company: "Wilson Enterprises",
    role: "Chairman's Partners",
    image: require("../../assets/sarah.png"),
    liked: false,
  },
  {
    id: "3",
    name: "Michael Chen",
    company: "Chen Transport",
    role: "Business Members",
    image: require("../../assets/michael.png"),
    liked: false,
  },
  {
    id: "4",
    name: "John Smith",
    company: "Smith Logistics",
    role: "Business Executive Members",
    image: require("../../assets/smith.png"),
    liked: false,
  },
  {
    id: "5",
    name: "Sarah Wilson",
    company: "Wilson Enterprises",
    role: "Chairman's Partners",
    image: require("../../assets/wilson.png"),
    liked: false,
  },
];

export default function MembersDirectory() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState(initialMembersData);

  // Toggle heart liked/unliked
  const toggleLike = (id) => {
    const updatedMembers = members.map((member) =>
      member.id === id ? { ...member, liked: !member.liked } : member
    );
    setMembers(updatedMembers);
  };

  // Filter based on search text
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={tw`flex-1 bg-white px-4 pt-4`}>
      <Text style={tw`text-sm text-black mb-4 mt-4 font-bold`}>Members Directory</Text>

      <View
        style={tw`flex-row items-center border border-red-400 rounded-full px-4 py-2 mb-4 mt-6`}
      >
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search members....."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={tw`ml-2 flex-1 text-sm text-black`}
        />
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={tw`flex-row items-center bg-gray-100 p-3 mb-3 rounded-xl`}
          >
            <Image
              source={item.image}
              style={tw`w-12 h-12 rounded-full`}
              resizeMode="cover"
            />

            <View style={tw`ml-3 flex-1`}>
              <Text style={tw`text-black font-semibold text-sm`}>
                {item.name}
              </Text>
              <Text style={tw`text-red-500 text-sm`}>{item.company}</Text>
              <Text style={tw`text-gray-500 text-xs`}>{item.role}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleLike(item.id)}>
              <Ionicons
                name={item.liked ? "heart" : "heart-outline"}
                size={20}
                color={item.liked ? "#ed292e" : "#aaa"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
