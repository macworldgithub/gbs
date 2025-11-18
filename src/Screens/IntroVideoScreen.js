import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Video from "react-native-video";

const INTRO_VIDEO = require("../../assets/intro.mp4");

export default function IntroVideoScreen({ navigation }) {
  const [isBuffering, setIsBuffering] = useState(true);
  const hasNavigatedRef = useRef(false);

  const handleNavigation = (target) => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    navigation.replace(target);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <Video
        source={INTRO_VIDEO}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        paused={false}
        repeat={false}
        controls
        onLoadStart={() => setIsBuffering(true)}
        onReadyForDisplay={() => setIsBuffering(false)}
        onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
        onEnd={() => handleNavigation("OnboardingTwo")}
        onError={(error) => {
          console.warn("Intro video error:", error);
          handleNavigation("OnboardingTwo");
        }}
        ignoreSilentSwitch="obey"
        playInBackground={false}
        playWhenInactive={false}
      />

      {isBuffering && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Skip intro video"
          style={styles.skipButton}
          onPress={() => handleNavigation("OnboardingTwo")}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 48,
    paddingHorizontal: 24,
    alignItems: "flex-end",
  },
  skipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    // borderColor: "rgba(255, 255, 255, 0.4)",
  
  },
  skipText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
