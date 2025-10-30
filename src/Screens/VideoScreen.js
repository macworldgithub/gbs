import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { storeUserData } from "../utils/storage";

export default function VideoScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  const youtubeUrl =
    "https://www.youtube.com/embed/Zn75REPd540?autoplay=1&playsinline=1&modestbranding=1&controls=1";

  const handleSkip = async () => {
    try {
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const expiry = now + sevenDaysMs;

      const guestData = {
        token: "guest-token",
        isGuest: true,
        guestExpiry: expiry,
        name: "Guest User",
        email: null,
      };

      try {
        await storeUserData(guestData);
      } catch (e) {
        console.log("storeUserData helper error:", e);
      }
      await AsyncStorage.setItem("userData", JSON.stringify(guestData));

      navigation.replace("Tabs");
    } catch (e) {
      console.error("Guest sign-in error:", e);
      Alert.alert("Error", "Could not sign in as guest. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{
          uri: youtubeUrl,
          headers: {
            Referer: "https://www.example.com", // Replace with your app's domain (e.g., https://com.yourapp.example.com)
          },
        }}
        style={styles.webview}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        originWhitelist={["*"]}
        onLoadEnd={() => setLoading(false)} // Hide loader when WebView finishes loading
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1, backgroundColor: "#000" },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    height: 70,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  skipButton: {
    backgroundColor: "#ed292e",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  skipText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
