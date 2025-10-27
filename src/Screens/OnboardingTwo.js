// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Image,
//   ImageBackground,
// } from "react-native";

// export default function OnboardingScreen({ navigation }) {
//   return (
//     <ImageBackground
//       source={require("../../assets/good.png")}
//       style={styles.backgroundImage}
//       resizeMode="cover"
//     >
//       <View style={styles.overlay}>
//         <StatusBar
//           barStyle="light-content"
//           translucent
//           backgroundColor="transparent"
//         />

//         {/* ---- Top tagline ---- */}
//         <View style={styles.topTaglineContainer}>
//           <Text style={styles.topTagline}>Business – Social – Wellbeing</Text>
//         </View>

//         {/* ---- Middle content ---- */}
//         <View style={styles.middleContent}>
//           <Text style={styles.subheading}>NATIONAL PARTNERS</Text>

//           <Image
//             source={require("../../assets/direct-couriers.png")} // 👈 logo here
//             style={styles.logo}
//             resizeMode="contain"
//           />

//           <Text style={styles.description}>
//             Experience the Ultimate in Events and Connection
//           </Text>
//         </View>

//         {/* ---- Buttons ---- */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.memberButton}
//             onPress={() => navigation.replace("Tabs")}
//           >
//             <Text style={styles.memberText}>Member Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.joinButton}
//             onPress={() => navigation.replace("AuthTabs")}
//           >
//             <Text style={styles.joinText}>Join Now</Text>
//           </TouchableOpacity>
//         </View>

//         {/* ---- Sign In Link ---- */}
//         <TouchableOpacity
//           style={styles.signInContainer}
//           onPress={() => navigation.navigate("Signin")}
//         >
//           <Text style={styles.signInText}>
//             Already have an account?{" "}
//             <Text style={styles.signInBold}>Sign In</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 24,
//     paddingBottom: 50,
//   },
//   topTaglineContainer: {
//     marginTop: 60,
//   },
//   topTagline: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//     textAlign: "center",
//     letterSpacing: 0.5,
//   },
//   middleContent: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 220, // moves the center block up a bit for better balance
//   },
//   subheading: {
//     color: "#ddd",
//     fontSize: 12,
//     letterSpacing: 1,
//     marginBottom: 8,
//   },
//   logo: {
//     width: 180,
//     height: 75,
//     marginBottom: 10,
//   },
//   description: {
//     color: "#eee",
//     fontSize: 14,
//     width: 500,
//     textAlign: "center",
//     marginTop: 5,
//     paddingHorizontal: 20,
//   },
//   buttonContainer: {
//     width: "100%",
//     alignItems: "center",
//     marginTop: 0,
//   },
//   memberButton: {
//     backgroundColor: "#ed292e",
//     borderRadius: 14,
//     paddingVertical: 14,
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 0,
//   },
//   memberText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   joinButton: {
//     // backgroundColor: "#fff",
//     borderRadius: 14,
//     paddingVertical: 14,
//     width: "100%",
//     alignItems: "center",
//   },
//   joinText: {
//     color: "#ffffff",
//     textDecorationLine: "underline",
//     fontSize: 16,
//     fontWeight: "400",
//   },
//   signInContainer: {
//     alignSelf: "center",
//   },
//   signInText: {
//     color: "#ccc",
//     fontSize: 14,
//   },
//   signInBold: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { storeUserData } from "../utils/storage"; // ✅ keep same helper

export default function OnboardingScreen({ navigation }) {
  // 🧩 Guest Sign-in logic (copied from your Signin screen)
  const handleGuestSignIn = async () => {
    try {
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

      // Check for existing guest expiry
      const existingExpiryStr = await AsyncStorage.getItem("guestExpiry");
      let expiry = now + sevenDaysMs; // Default new expiry

      if (existingExpiryStr) {
        const existingExpiry = parseInt(existingExpiryStr, 10);
        if (now < existingExpiry) {
          // Reuse existing if not expired
          expiry = existingExpiry;
        } else {
          // Expired, create new
          expiry = now + sevenDaysMs;
          await AsyncStorage.setItem("guestExpiry", expiry.toString());
        }
      } else {
        // No existing, create new
        await AsyncStorage.setItem("guestExpiry", expiry.toString());
      }

      const guestData = {
        token: "guest-token", // non-sensitive placeholder
        isGuest: true,
        guestExpiry: expiry,
        name: "Guest User",
        email: null,
      };

      // Save guest info
      try {
        await storeUserData(guestData);
      } catch (e) {
        console.log("storeUserData helper error:", e);
      }
      await AsyncStorage.setItem("userData", JSON.stringify(guestData));

      Alert.alert(
        "Guest Access",
        `You are signed in as a guest. Guest access is valid until ${new Date(
          expiry
        ).toLocaleString()}.`
      );

      navigation.replace("Tabs");
    } catch (e) {
      console.error("Guest sign-in error:", e);
      Alert.alert("Error", "Could not sign in as guest. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/good.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        {/* ---- Top tagline ---- */}
        <View style={styles.topTaglineContainer}>
          <Text style={styles.topTagline}>Business – Social – Wellbeing</Text>
        </View>

        {/* ---- Middle content ---- */}
        <View style={styles.middleContent}>
          <Text style={styles.subheading}>NATIONAL PARTNERS</Text>

          <Image
            source={require("../../assets/direct-couriers.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.description}>
            Experience the Ultimate in Events and Connection
          </Text>
        </View>

        {/* ---- Buttons ---- */}
        <View style={styles.buttonContainer}>
          {/* ✅ Member Login now performs Guest Sign-In */}
          <TouchableOpacity
            style={styles.memberButton}
            onPress={handleGuestSignIn}
          >
            <FontAwesome
              name="user"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.memberText}>Member Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => navigation.replace("AuthTabs")}
          >
            <Text style={styles.joinText}>Join Now</Text>
          </TouchableOpacity>
        </View>

        {/* ---- Sign In Link ---- */}
        <TouchableOpacity
          style={styles.signInContainer}
          onPress={() => navigation.navigate("Signin")}
        >
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={styles.signInBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  topTaglineContainer: {
    marginTop: 60,
  },
  topTagline: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  middleContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 220,
  },
  subheading: {
    color: "#ddd",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  logo: {
    width: 180,
    height: 75,
    marginBottom: 10,
  },
  description: {
    color: "#eee",
    fontSize: 14,
    width: 500,
    textAlign: "center",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  memberButton: {
    backgroundColor: "#ed292e",
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  memberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  joinButton: {
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
  },
  joinText: {
    color: "#ffffff",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "400",
  },
  signInContainer: {
    alignSelf: "center",
  },
  signInText: {
    color: "#ccc",
    fontSize: 14,
  },
  signInBold: {
    color: "#fff",
    fontWeight: "bold",
  },
});
