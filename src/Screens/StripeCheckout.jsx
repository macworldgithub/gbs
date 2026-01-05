// import React, { useEffect, useState } from "react";
// import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { API_BASE_URL } from "../utils/config";
// import { getUserData } from "../utils/storage";

// export default function StripeCheckout({ route, navigation }) {
//   const { roleId, startDate, months, trial } = route.params;
//   const [checkoutUrl, setCheckoutUrl] = useState(null);

//   useEffect(() => {
//     initCheckout();
//   }, []);

//   const initCheckout = async () => {
//     try {
//       const storedUser = await getUserData();
//       const token = storedUser?.token || "";

//       // Call backend to create Stripe Checkout session
//       const res = await axios.post(
//         `${API_BASE_URL}/payment/checkout`,
//         { roleId, startDate, months, trial },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const { url } = res.data;
//       if (!url) {
//         Alert.alert("Error", "Failed to get checkout URL");
//         return;
//       }

//       setCheckoutUrl(url);
//     } catch (err) {
//       console.log(
//         "Checkout initialization error:",
//         err.response?.data || err.message || err
//       );
//       Alert.alert(
//         "Error",
//         err.response?.data?.message ||
//           "Failed to start payment. Try again later."
//       );
//     }
//   };

//   const handleNavigationStateChange = async (navState) => {
//     const { url } = navState;

//     // Stripe success URL contains session_id
//     if (url.includes("/payment/success")) {
//       try {
//         // Activate subscription internally
//         const userData = await getUserData();
//         const token = userData?.token || "";
//         const now = new Date().toISOString();

//         const hasExistingPackage = userData?.activatedPackage?.role?._id
//           ? true
//           : false;

//         const apiMethod = hasExistingPackage ? "patch" : "post";

//         const activate = await axios[apiMethod](
//           `${API_BASE_URL}/user-package`,
//           { role:roleId, startDate: now, months, trial },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const newPkg = activate.data?.activatedPackage ||
//           activate.data?.userPackage || {
//             role: { _id: role },
//             startDate: now,
//             endDate: new Date(
//               new Date(now).setMonth(new Date(now).getMonth() + months)
//             ).toISOString(),
//           };

//         const mergedUser = {
//           ...userData,
//           activatedPackage: newPkg,
//         };
//         await AsyncStorage.setItem("userData", JSON.stringify(mergedUser));
//         await AsyncStorage.setItem("currentPackage", JSON.stringify(newPkg));

//         Alert.alert(
//           "Success",
//           hasExistingPackage
//             ? "Package upgraded successfully!"
//             : "Subscription activated successfully!"
//         );

//         navigation.replace("Tabs");
//       } catch (err) {
//         console.log(
//           "Subscription activation error:",
//           err.response?.data || err
//         );
//         Alert.alert(
//           "Activation Error",
//           "Payment succeeded, but subscription activation failed. Please contact support."
//         );
//       }
//     }

//     if (url.includes("/payment/cancel")) {
//       Alert.alert("Payment Cancelled", "You cancelled the payment.");
//       if (navigation.canGoBack()) {
//         navigation.goBack();
//       } else {
//         navigation.replace("Tabs");
//       }
//     }
//   };

//   if (!checkoutUrl) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <WebView
//       originWhitelist={["*"]}
//       source={{ uri: checkoutUrl }}
//       onNavigationStateChange={handleNavigationStateChange}
//       startInLoadingState
//       javaScriptEnabled
//       domStorageEnabled
//       style={{ flex: 1 }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";

export default function StripeCheckout({ route, navigation }) {
  const { roleId, startDate, months, trial } = route.params;
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  useEffect(() => {
    initCheckout();
  }, []);

  const initCheckout = async () => {
    try {
      const storedUser = await getUserData();
      const token = storedUser?.token || "";

      // Call backend to create Stripe Checkout session
      const res = await axios.post(
        `${API_BASE_URL}/payment/checkout`,
        { roleId, startDate, months, trial },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { url } = res.data;
      if (!url) {
        Alert.alert("Error", "Failed to get checkout URL");
        return;
      }

      setCheckoutUrl(url);
    } catch (err) {
      console.log(
        "Checkout initialization error:",
        err.response?.data || err.message || err
      );
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          "Failed to start payment. Try again later."
      );
    }
  };

  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;

    // Stripe success URL contains session_id
    if (url.includes("/payment/success")) {
      try {
        // Activate subscription internally
        const userData = await getUserData();
        const token = userData?.token || "";
        const now = new Date().toISOString();

        const hasExistingPackage = userData?.activatedPackage?.role?._id
          ? true
          : false;

        const apiMethod = hasExistingPackage ? "patch" : "post";

        const activate = await axios[apiMethod](
          `${API_BASE_URL}/user-package`,
          { role: roleId, startDate: now, months, trial },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newPkg = activate.data?.activatedPackage ||
          activate.data?.userPackage || {
            role: { _id: role },
            startDate: now,
            endDate: new Date(
              new Date(now).setMonth(new Date(now).getMonth() + months)
            ).toISOString(),
          };

        const mergedUser = {
          ...userData,
          activatedPackage: newPkg,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(mergedUser));
        await AsyncStorage.setItem("currentPackage", JSON.stringify(newPkg));

        Alert.alert(
          "Success",
          hasExistingPackage
            ? "Package upgraded successfully!"
            : "Subscription activated successfully!"
        );

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

  return (
    <View style={styles.container}>
      {checkoutUrl ? (
        <WebView
          originWhitelist={["*"]}
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          style={styles.webview}
        />
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50, // Adjust the value as needed for the desired top margin
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webview: {
    flex: 1,
  },
});
