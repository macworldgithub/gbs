import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";

export default function StripeCheckout({ route, navigation }) {
  const { roleId, months, trial, startDate } = route.params;
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  useEffect(() => {
    initCheckout();
  }, []);

  const initCheckout = async () => {
    try {
      const tokenStr = await AsyncStorage.getItem("userData");
      const token = tokenStr ? JSON.parse(tokenStr).token : "";

      // Call backend to create Stripe Checkout session
      const res = await axios.post(
        `${API_BASE_URL}/payment/checkout`,
        { roleId, months, trial, startDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { url } = res.data;
      if (!url) {
        Alert.alert("Error", "Failed to get checkout URL");
        return;
      }

      setCheckoutUrl(url);
    } catch (err) {
      console.log("Checkout initialization error:", err.response?.data || err);
      Alert.alert("Error", "Failed to start payment. Try again later.");
    }
  };

  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;

    // Stripe success URL contains session_id
    if (url.includes("/payment/success")) {
      try {
        // Activate subscription internally
        const tokenStr = await AsyncStorage.getItem("userData");
        const token = tokenStr ? JSON.parse(tokenStr).token : "";
        const now = new Date();

        await axios.post(
          `${API_BASE_URL}/user-package`,
          { role: roleId, startDate: now.toISOString(), months, trial },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Alert.alert("Success", "Payment completed and subscription activated!");
        navigation.replace("Tabs");
      } catch (err) {
        console.log(
          "Subscription activation error:",
          err.response?.data || err
        );
        Alert.alert(
          "Activation Error",
          "Payment succeeded, but subscription activation failed. Please contact support."
        );
      }
    }

    if (url.includes("/payment/cancel")) {
      Alert.alert("Payment Cancelled", "You cancelled the payment.");
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace("Tabs");
      }
    }
  };

  if (!checkoutUrl) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: checkoutUrl }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState
      javaScriptEnabled
      domStorageEnabled
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
