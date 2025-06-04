import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
export default function Onboarding({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/OnBoard.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {/* Overlay to dim background */}
      <View style={{ backgroundColor: "rgba(0,0,0,0.4)", ...StyleSheet.absoluteFillObject }} />

      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: (StatusBar.currentHeight || 20) + 10,
          paddingHorizontal: 24,
          justifyContent: "space-between",
        }}
      >
        {/* Top navigation */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity
            style={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 999, padding: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={{ color: "#fff", fontSize: 14 }}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom content */}
        <View style={{ marginBottom: 48 }}>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", lineHeight: 38 }}>
            Discover{"\n"}Amazing Event{"\n"}In Your City
          </Text>

          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 8 }}>
            The best event we have prepared for you
          </Text>

          {/* Progress bar */}
          <View style={{ flexDirection: "row", marginTop: 24, gap: 8 }}>
            <View style={{ height: 4, width: 32, backgroundColor: "#fff", borderRadius: 999 }} />
            <View style={{ height: 4, width: 8, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 999 }} />
            <View style={{ height: 4, width: 8, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 999 }} />
          </View>

          {/* Next button */}
          <TouchableOpacity
            style={{ backgroundColor: "#ed292e", marginTop: 24, paddingVertical: 14, borderRadius: 12, alignItems: "center" }}
            onPress={() => navigation.navigate("OnboardingTwo")}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Next</Text>
          </TouchableOpacity>

          {/* Sign In text */}
          <Text style={{ color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 16 }}>
            Already have an account?{" "}
            <Text style={{ color: "#fff", fontWeight: "600" }}
            onPress={() => navigation.navigate("Signin")}>Sign In</Text>
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
