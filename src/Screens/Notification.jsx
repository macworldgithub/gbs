import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNotificationById } from "../utils/api";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const getUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsed = JSON.parse(userData);

        setIsAdmin(parsed?.isAdmin === true);
      }
    } catch (error) {
      console.error("Role error:", error);
    }
  };

  useEffect(() => {
    getUserRole();
    if (isFocused) {
      fetchNotifications();
    }
  }, [isFocused]);

  const [data, setData] = useState({
    today: [],
    yesterday: [],
  });

  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchNotifications = () => {
    setLoading(true);

    fetch(`${API_BASE_URL}/notification`)
      .then((res) => res.json())
      .then((resData) => {
        const today = [];
        const yesterday = [];

        const now = new Date();
        const todayDate = now.toDateString();

        resData.forEach((n) => {
          const createdDate = new Date(n.createdAt);

          if (createdDate.toDateString() === todayDate) {
            today.push({
              ...n,
              unread: n.unread ?? true,
              highlight: n.unread ?? false,
            });
          } else {
            yesterday.push({
              ...n,
              unread: n.unread ?? false,
              highlight: false,
            });
          }
        });

        setData({ today, yesterday });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // const fetchNotifications = () => {
  //   setLoading(true);
  //   fetch(`${API_BASE_URL}/notification`)
  //     .then((res) => res.json())
  //     .then((resData) => {
  //       const today = [];
  //       const yesterday = [];
  //       const now = new Date();
  //       const todayDate = now.toDateString();

  //       resData.forEach((n) => {
  //         const createdDate = new Date(n.createdAt);
  //         if (createdDate.toDateString() === todayDate) {
  //           today.push(n);
  //         } else {
  //           yesterday.push(n);
  //         }
  //       });

  //       setData({ today, yesterday });
  //     })
  //     .catch((err) => console.error(err))
  //     .finally(() => setLoading(false));
  // };

  const markAllAsRead = (section) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].map((n) => ({
        ...n,
        unread: false,
        highlight: false,
      })),
    }));
  };

  const deleteNotification = (id) => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const userData = await AsyncStorage.getItem("userData");
              const parsed = userData ? JSON.parse(userData) : null;
              const token = parsed?.token;

              if (!token) {
                Alert.alert(
                  "Error",
                  "Please login again to perform this action",
                );
                return;
              }

              const res = await fetch(`${API_BASE_URL}/notification/${id}`, {
                method: "DELETE",
                headers: {
                  Accept: "*/*",
                  Authorization: `Bearer ${token}`, // ← Yeh line add karo
                },
              });

              if (res.ok) {
                Alert.alert("Success", "Notification deleted");
                fetchNotifications();
              } else {
                const errorData = await res.json().catch(() => ({}));
                Alert.alert(
                  "Error",
                  errorData.message || "Failed to delete notification",
                );
              }
            } catch (error) {
              console.error("❌ Delete error:", error);
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ],
    );
  };

  const fetchNotificationDetail = async (notificationId) => {
    try {
      setLoadingDetail(true);
      const response = await getNotificationById(notificationId);
      setSelectedNotification(response);
      setDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching notification detail:", error);
      Alert.alert("Error", "Failed to load notification details");
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedNotification(null);
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item._id}
      style={
        item.highlight
          ? [tw`flex-row items-start px-4 py-3 rounded bg-purple-100`]
          : tw`flex-row items-start px-4 py-3`
      }
      onPress={() => fetchNotificationDetail(item._id)}
      activeOpacity={0.7}
    >
      <View style={tw`mt-1 mr-2`}>
        <FontAwesome name="bell" size={16} color="#f43f5e" />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-sm font-semibold text-black`}>{item.title}</Text>
        <Text style={tw`text-xs text-gray-500`}>{item.message}</Text>
        <Text style={tw`text-xs text-gray-400 mt-1`}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      <View style={tw`flex-row items-center ml-2`}>
        {/* Update Button */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("NotificationForm", { notification: item })
          }
          style={tw`mr-3`}
        >
          <Icon name="edit" size={18} color="#2563eb" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => deleteNotification(item._id)}>
          <Icon name="trash" size={18} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#f43f5e" />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white pt-10 `}>
      {/* Header */}
      <View
        style={tw`flex-row justify-between items-center px-4 py-4 border-b border-gray-100`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-black ml-2 flex-1`}>
          Notification
        </Text>

        {isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationForm")}
            style={tw`border border-red-500 rounded-full px-3 py-0.5`}
          >
            <Text style={tw`text-red-500 text-xs font-medium p-2`}>
              Create Notification
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Today */}
      <View style={tw`mt-2`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-1`}>
          <Text style={tw`text-xs font-medium text-gray-400`}>TODAY</Text>
          <TouchableOpacity onPress={() => markAllAsRead("today")}>
            <Text style={tw`text-xs font-medium text-red-500`}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
        {data.today.length > 0 ? (
          data.today.map((item) => renderItem(item))
        ) : (
          <Text style={tw`text-center text-gray-400 text-xs`}>
            No notifications for today
          </Text>
        )}
      </View>

      {/* Yesterday */}
      <View style={tw`mt-4 mb-10`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-1`}>
          <Text style={tw`text-xs font-medium text-gray-400`}>YESTERDAY</Text>
          <TouchableOpacity onPress={() => markAllAsRead("yesterday")}>
            <Text style={tw`text-xs font-medium text-red-500`}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
        {data.yesterday.length > 0 ? (
          data.yesterday.map((item) => renderItem(item))
        ) : (
          <Text style={tw`text-center text-gray-400 text-xs`}>
            No notifications for yesterday
          </Text>
        )}
      </View>

      {/* Notification Detail Modal */}
      {/* Notification Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDetailModal}
      >
        <View style={tw`flex-1 bg-black/60`}>
          <View style={tw`flex-1 bg-white rounded-t-3xl mt-auto`}>
            {/* Modal Header */}
            <View
              style={tw`flex-row justify-between items-center px-4 py-4 border-b border-gray-200`}
            >
              <Text style={tw`text-xl font-semibold text-black flex-1 mt-24`}>
                Notification Details
              </Text>
              <TouchableOpacity onPress={closeDetailModal}>
                <Icon name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {loadingDetail ? (
              <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#f43f5e" />
              </View>
            ) : selectedNotification ? (
              <ScrollView style={tw`flex-1 px-4 py-4`}>
                {/* Title */}
                <View style={tw`mb-5`}>
                  <Text style={tw`text-xs font-medium text-gray-400 mb-1`}>
                    TITLE
                  </Text>
                  <Text style={tw`text-2xl font-bold text-black leading-tight`}>
                    {selectedNotification.title}
                  </Text>
                </View>

                {/* Message */}
                <View style={tw`mb-5`}>
                  <Text style={tw`text-xs font-medium text-gray-400 mb-1`}>
                    MESSAGE
                  </Text>
                  <Text style={tw`text-base text-gray-700 leading-6`}>
                    {selectedNotification.message}
                  </Text>
                </View>

                {/* Event Dates */}
                {(selectedNotification.startDate ||
                  selectedNotification.endDate) && (
                  <View style={tw`mb-5`}>
                    <Text style={tw`text-xs font-medium text-gray-400 mb-2`}>
                      EVENT DATE & TIME
                    </Text>
                    <View style={tw`bg-gray-50 p-4 rounded-xl`}>
                      {selectedNotification.startDate && (
                        <View style={tw`flex-row items-center mb-2`}>
                          <Text style={tw`w-20 text-gray-500 text-sm`}>
                            Starts:
                          </Text>
                          <Text style={tw`font-medium`}>
                            {new Date(
                              selectedNotification.startDate,
                            ).toLocaleString()}
                          </Text>
                        </View>
                      )}
                      {selectedNotification.endDate && (
                        <View style={tw`flex-row items-center`}>
                          <Text style={tw`w-20 text-gray-500 text-sm`}>
                            Ends:
                          </Text>
                          <Text style={tw`font-medium`}>
                            {new Date(
                              selectedNotification.endDate,
                            ).toLocaleString()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Roles */}
                {selectedNotification.roles &&
                  selectedNotification.roles.length > 0 && (
                    <View style={tw`mb-5`}>
                      <Text style={tw`text-xs font-medium text-gray-400 mb-2`}>
                        TARGETED ROLES
                      </Text>
                      <View style={tw`bg-gray-50 rounded-xl p-3`}>
                        {selectedNotification.roles.map((role, index) => (
                          <View
                            key={index}
                            style={tw`py-2 border-b border-gray-100 last:border-0`}
                          >
                            <View
                              style={tw`flex-row justify-between items-center`}
                            >
                              <Text style={tw`font-semibold text-gray-800`}>
                                {role.label}
                              </Text>
                              {/* {role.price && (
                                <Text style={tw`text-emerald-600 font-medium`}>
                                  ${role.price}
                                </Text>
                              )} */}
                            </View>
                            <Text style={tw`text-xs text-gray-500`}>
                              {role.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
              </ScrollView>
            ) : (
              <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-gray-500`}>No notification selected</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
