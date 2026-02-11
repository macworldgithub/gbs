import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { getUserData } from "../utils/storage";
import { API_BASE_URL } from "../utils/config";

export default function CreateGroup() {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [participantMap, setParticipantMap] = useState({});

  useEffect(() => {
    const loadParticipantNames = async () => {
      try {
        const parsed = await getUserData();
        const token = parsed?.token;

        const res = await axios.get(
          "https://gbs.westsidecarcare.com.au/messages/public-groups",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const groups = res?.data?.groups || [];

        const map = {};
        groups.forEach((g) => {
          (g.participants || []).forEach((p) => {
            if (p?._id) {
              map[p._id] = p.name || "Unnamed";
            }
          });
        });

        setParticipantMap(map);
      } catch (e) {
        console.log(
          "participant name load error",
          e?.response?.data || e.message,
        );
      }
    };

    loadParticipantNames();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const parsed = await getUserData();
        const token = parsed?.token;
        const meId = parsed?._id || parsed?.user?._id || null;
        setMyUserId(meId);

        const res = await axios.get(`${API_BASE_URL}/user`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = Array.isArray(res.data) ? res.data : res.data?.users || [];
        const filtered = list.filter((u) => u?._id && u._id !== meId);
        setUsers(filtered);
      } catch (e) {
        console.log("load users error", e.response?.data || e.message);
        setUsers([]);
      }
    };
    load();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Validation", "Please enter a group name");
      return;
    }

    try {
      setSubmitting(true);
      const parsed = await getUserData();
      const token = parsed?.token;
      if (!token) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const payload = {
        participantIds: selectedIds,
        groupName: groupName.trim(),
      };

      const res = await axios.post(
        `${API_BASE_URL}/messages/group-conversation`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const conversationId = res?.data?._id;
      if (!conversationId) {
        throw new Error("Invalid server response");
      }

      const creatorId = parsed?._id || parsed?.user?._id || null;
      const creatorParticipant = creatorId
        ? {
            _id: creatorId,
            name: parsed?.name || parsed?.user?.name || "You",
            email: parsed?.email || parsed?.user?.email || "",
          }
        : null;

   
      const selectedUsers = users.filter((u) => selectedIds.includes(u._id));
      const resolvedParticipants = selectedUsers.map((u) => ({
        _id: u._id,
        name: participantMap[u._id] || u.name || "Unnamed",
        email: u.email || "",
      }));

      const participantsForChat = [
        // Ensure creator appears first if available
        ...(creatorParticipant ? [creatorParticipant] : []),
        ...resolvedParticipants,
      ];

      navigation.replace("GroupChat", {
        conversationId,
        group: { name: groupName.trim() },
        participants: participantsForChat,
      });
    } catch (e) {
      Alert.alert(
        "Error",
        e.response?.data?.message || e.message || "Failed to create group",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-black/30 justify-center items-center`}>
      <View style={tw`w-11/12 bg-white p-5 rounded-xl shadow relative`}>
        {/* Close button */}
        <TouchableOpacity
          style={tw`absolute right-3 top-3 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        <Text style={tw`text-lg font-bold mb-6 self-center`}>New Group</Text>

        {/* Group Name */}
        <View style={tw`flex-row items-center bg-gray-100 p-3 rounded-lg mb-4`}>
          <TextInput
            placeholder="Group name"
            placeholderTextColor="#000000"
            value={groupName}
            onChangeText={setGroupName}
            style={tw`flex-1`}
          />
        </View>

        {/* Add Members */}
        <TouchableOpacity
          style={tw`flex-row items-center bg-gray-100 p-3 rounded-lg mb-2`}
          onPress={() => setShowDropdown((v) => !v)}
        >
          <FontAwesome
            name="user-plus"
            size={20}
            color="red"
            style={{ marginRight: 10 }}
          />
          <Text style={tw`text-gray-700 flex-1`}>
            {selectedIds.length > 0
              ? `Selected ${selectedIds.length} member(s)`
              : "Add members"}
          </Text>
          <Ionicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={18}
            color="#444"
          />
        </TouchableOpacity>

        {showDropdown && (
          <View style={tw`bg-gray-50 rounded-lg mb-4 max-h-64`}>
            <ScrollView>
              {users.map((u) => (
                <TouchableOpacity
                  key={u._id}
                  onPress={() => toggleSelect(u._id)}
                  style={tw`flex-row items-center px-3 py-2 border-b border-gray-200`}
                >
                  <Ionicons
                    name={
                      selectedIds.includes(u._id)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color={selectedIds.includes(u._id) ? "#ef4444" : "#6b7280"}
                    style={tw`mr-2`}
                  />
                  <View style={tw`flex-1`}>
                    <Text>{participantMap[u._id] || u.name || "Unnamed"}</Text>

                    {u.email ? (
                      <Text style={tw`text-gray-500 text-xs`}>{u.email}</Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
              {users.length === 0 && (
                <Text style={tw`text-gray-500 px-3 py-3`}>
                  No other users found
                </Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* Create Button */}
        <TouchableOpacity
          style={tw`bg-red-500 p-3 rounded-lg mt-2`}
          onPress={handleCreateGroup}
          disabled={submitting}
        >
          <Text style={tw`text-white font-bold text-center`}>
            {submitting ? "Creating..." : "Create Group"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
