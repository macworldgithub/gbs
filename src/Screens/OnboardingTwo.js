// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   ImageBackground,
// } from "react-native";

// export default function OnboardingTwo({ navigation }) {
//   return (
//     <ImageBackground
//       source={require("../../assets/good.png")}
//       style={styles.backgroundImage}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <StatusBar
//           barStyle="light-content"
//           translucent
//           backgroundColor="transparent"
//         />

//         {/* Main content */}
//         <View style={styles.content} classname="">
//           <Text style={styles.tagline}>
//             <Text style={styles.boldText} classname="">
//               Business – Social - Wellbeing
//             </Text>
//           </Text>
//           <Text style={styles.subheading}>NATIONAL PARTNERS</Text>

//           <Text style={styles.logo}>
//             <Text style={styles.logoBold}>DIRECT </Text>
//             <Text style={styles.logoRed}>COURIERS</Text>
//           </Text>

//           <Text style={styles.description}>
//             Experience the Ultimate in Events and Connection
//           </Text>

//           {/* Join Now Button */}
//           {/* <TouchableOpacity
//             style={styles.button}
//             onPress={() => navigation.replace("Tabs")}
//           >
//             <Text style={styles.buttonText}>Join Now</Text>
//           </TouchableOpacity> */}

//           <TouchableOpacity
//             style={[styles.button, styles.guestButton]}
//             onPress={() => navigation.replace("AuthTabs")}
//           >
//             <Text style={styles.buttonText}>Guest Login</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Sign In Link at the bottom */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate("Signin")}
//           style={styles.signInContainer}
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
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   content: {
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 140,
//   },

//   logo: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   logoBold: {
//     color: "#fff",
//   },
//   logoRed: {
//     color: "#ed292e",
//   },
//   subheading: {
//     color: "#ccc",
//     fontSize: 12,
//     marginBottom: 30,
//     letterSpacing: 1,
//     textAlign: "center",
//   },
//   tagline: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   boldText: {
//     fontWeight: "bold",
//   },
//   description: {
//     color: "#aaa",
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 40,
//     paddingHorizontal: 10,
//   },
//   button: {
//     backgroundColor: "#ed292e",
//     paddingVertical: 16,
//     borderRadius: 12,
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   signInContainer: {
//     position: "absolute",
//     bottom: 45,
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
} from "react-native";

export default function OnboardingScreen({ navigation }) {
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
            source={require("../../assets/direct-couriers.png")} // 👈 logo here
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.description}>
            Experience the Ultimate in Events and Connection
          </Text>
        </View>

        {/* ---- Buttons ---- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.memberButton}
            onPress={() => navigation.replace("Tabs")}
          >
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
    marginTop: 220, // moves the center block up a bit for better balance
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
    marginTop: 0,
  },
  memberButton: {
    backgroundColor: "#ed292e",
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 0,
  },
  memberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  joinButton: {
    // backgroundColor: "#fff",
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
