import React from "react";
import { View, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Splash() {
  return (
    <LinearGradient
      colors={["#000000", "#434343"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Image
        source={require("../../assets/blokes.png")}
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
