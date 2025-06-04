import React from "react";
import { View, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Splash() {
  return (
    <LinearGradient
      colors={["#ed292e", "#f07373"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Image
        source={require("../../assets/Splash.png")}
        style={{
          width: width * 0.5, 
          height: undefined,
          aspectRatio: 1.5,
          resizeMode: "contain",
        }}
      />
    </LinearGradient>
  );
}
