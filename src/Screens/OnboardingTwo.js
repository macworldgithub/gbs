import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Onboarding from "./Onboarding";

export default function OnboardingTwo({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/OnBoard1.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={25} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.heading}>
          Experience{"\n"}The Ultimate{"\n"}Local Event Right
        </Text>

        <Text style={styles.subtext}>
          The best event we have prepared for you
        </Text>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          // onPress={() => navigation.navigate("Signup")}>
            onPress={() => navigation.replace('Tabs')}>

          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Sign In */}
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    padding: 10,
  },
  skipText: {
    color: "white",
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
    marginBottom: 8,
  },
  subtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: "row",
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#ed292e",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  signInText: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  signInBold: {
    color: "white",
    fontWeight: "bold",
  },
});
