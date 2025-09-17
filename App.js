import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, Platform, Alert, PermissionsAndroid } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Screens
import Splash from "./src/Screens/Splash";
import Onboarding from "./src/Screens/Onboarding";
import OnboardingTwo from "./src/Screens/OnboardingTwo";
import Home from "./src/Screens/Home";
import Signup from "./src/auth/Signup";
import Signin from "./src/auth/Signin";
import SearchEvent from "./src/Screens/SearchEvent";
import Notification from "./src/Screens/Notification";
import UpcomingEvent from "./src/Screens/UpcomingEvent";
import PopularEvent from "./src/Screens/PopularEvent";
import DetailEvent from "./src/Screens/DetailEvent";
import MemberLocation from "./src/Screens/MemberLocation";
import Profile from "./src/Screens/Profile";
import EditProfile from "./src/Screens/EditProfile";
import AccountSecurity from "./src/Screens/AccountSecurity";
import QRCodeScreen from "./src/Screens/QRCodeScreen";
import Scanner from "./src/Screens/Scanner";
import PaymentSettings from "./src/Screens/PaymentSettings";
import PaymentMethod from "./src/Screens/PaymentMethod";
import AddPaymentMethod from "./src/Screens/AddPaymentMethod";
import PaymentSuccess from "./src/Screens/PaymentSuccess";
import GeneralSetting from "./src/Screens/GeneralSetting";
import Theme from "./src/Screens/Theme";
import LanguageSetting from "./src/Screens/LanguageSetting";
import AllChat from "./src/Screens/AllChat";
import Chat from "./src/Screens/Chat";
import Conversations from "./src/Screens/Conversations";
import CreateGroup from "./src/Screens/CreateGroup";
import GroupInfo from "./src/Screens/GroupInfo";
import GroupChat from "./src/Screens/GroupChat";
import Gallery from "./src/Screens/Gallery";
import MuteGroup from "./src/Screens/MuteGroup";
import GroupConversations from "./src/Screens/GroupConversations";
import FavoriteEmpty from "./src/Screens/FavoriteEmpty";
import Favorite from "./src/Screens/Favorite";
import ForgotPass from "./src/Screens/ForgotPass";
import InboxOTP from "./src/Screens/InboxOTP";
import CreateNewPass from "./src/Screens/CreateNewPass";
import ResetPass from "./src/Screens/ResetPass";
import OTPVerification from "./src/auth/OTPVerification";
import AuthTabs from "./src/navigation/AuthTabNavigation";
import MembersDirectory from "./src/Screens/Directory";
import BusinessPage from "./src/Screens/BusinessPage";
import BusinessDetail from "./src/Screens/BusinessDetail";
import Wellbeing from "./src/Screens/Wellbeing";
import MyBusiness from "./src/Screens/MyBusiness";
import AddOfferScreen from "./src/Screens/AddOfferScreen";
import OfferCard from "./src/Screens/OfferCard";
import SavedOffers from "./src/Screens/SavedOffers";
import UpgradePackage from "./src/Screens/UpgradePackage";
import Social from "./src/Screens/Social";
import EventDetail from "./src/Screens/EventDetail";
import NotificationForm from "./src/Screens/NotificationForm";
import CreateEvent from "./src/Screens/CreateEvent";
import OfferDetails from "./src/Screens/OfferDetails";

// Firebase Messaging
import { 
  getApp 
} from "firebase/app";
import { 
  getMessaging, 
  getToken, 
  requestPermission, 
  onTokenRefresh, 
  deleteToken, 
  AuthorizationStatus 
} from "@react-native-firebase/messaging";

// Notifee
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";

// Axios for backend API
import axios from "axios";
import { API_BASE_URL } from "./src/utils/config";

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  // --- 🚀 Startup (login check + splash animation)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        setInitialRoute(userData ? "Tabs" : "OnboardingTwo");
      } catch (err) {
        console.log("Error checking login:", err);
        setInitialRoute("OnboardingTwo");
      }
    };

    checkLoginStatus();

    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // --- 🚀 FCM + Notifee setup
  useEffect(() => {
    const askPermissionAndGetFCM = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await getFcmToken();
      }
    };

    const setupNotifee = async () => {
      if (Platform.OS === "android") {
        await notifee.requestPermission();
        await notifee.createChannel({
          id: "default",
          name: "Default Channel",
          importance: AndroidImportance.HIGH,
        });
      }

      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log("📩 Notification pressed:", detail.notification);
          // You can navigate to "Chat" or "Notification" screen here
        }
      });
    };

    askPermissionAndGetFCM();
    setupNotifee();
  }, []);

  // --- 🚀 Listen for incoming messages + token refresh
  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    const unsubscribeMessage = messaging.onMessage(async (remoteMessage) => {
      console.log("Foreground message received:", remoteMessage);
      // ⚠️ Don't display notification here (Notifee handles background/foreground display)
    });

    const unsubscribeTokenRefresh = onTokenRefresh(messaging, async (token) => {
      console.log("🔁 Refreshed FCM Token:", token);
      await sendFcmTokenToBackend(token);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTokenRefresh();
    };
  }, []);

  // --- 📲 Helpers
  async function requestNotificationPermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    } else {
      try {
        const app = getApp();
        const messaging = getMessaging(app);
        const status = await requestPermission(messaging);
        const granted =
          status === AuthorizationStatus.AUTHORIZED ||
          status === AuthorizationStatus.PROVISIONAL;
        return granted;
      } catch (err) {
        console.warn("iOS permission error:", err);
        return false;
      }
    }
  }

  async function getFcmToken() {
    try {
      const app = getApp();
      const messaging = getMessaging(app);

      const currentToken = await getToken(messaging);
      if (currentToken) {
        await deleteToken(messaging);
      }

      const newToken = await getToken(messaging, true);
      console.log("🔥 New FCM Token:", newToken);
      await sendFcmTokenToBackend(newToken);
    } catch (error) {
      console.log("❌ Error getting new FCM token:", error);
    }
  }

  async function sendFcmTokenToBackend(fcmToken) {
    try {
      const jwtToken = await AsyncStorage.getItem("jwt_token");
      if (!jwtToken) return;
      await axios.post(
        `${API_BASE_URL}/notifications/register-token`,
        { fcmToken },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      console.log("✅ FCM token sent to backend");
    } catch (error) {
      console.error("Error sending FCM token:", error);
    }
  }

  // --- 🚀 Show splash until routes are decided
  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: splashOpacity }]}>
        <Splash />
      </Animated.View>
    );
  }

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="BusinessPage" component={BusinessPage} />
            <Stack.Screen name="BusinessDetail" component={BusinessDetail} />
            <Stack.Screen name="Wellbeing" component={Wellbeing} />
            <Stack.Screen name="Directory" component={MembersDirectory} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
            <Stack.Screen name="Tabs" component={AuthTabs} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="SearchEvent" component={SearchEvent} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="UpcomingEvent" component={UpcomingEvent} />
            <Stack.Screen name="PopularEvent" component={PopularEvent} />
            <Stack.Screen name="DetailEvent" component={DetailEvent} />
            <Stack.Screen name="MemberLocation" component={MemberLocation} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="AccountSecurity" component={AccountSecurity} />
            <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
            <Stack.Screen name="Scanner" component={Scanner} />
            <Stack.Screen name="PaymentSettings" component={PaymentSettings} />
            <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
            <Stack.Screen name="GeneralSetting" component={GeneralSetting} />
            <Stack.Screen name="Theme" component={Theme} />
            <Stack.Screen name="LanguageSetting" component={LanguageSetting} />
            <Stack.Screen name="AllChat" component={AllChat} />
            <Stack.Screen name="Conversations" component={Conversations} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="CreateGroup" component={CreateGroup} />
            <Stack.Screen name="GroupChat" component={GroupChat} />
            <Stack.Screen name="GroupConversations" component={GroupConversations} />
            <Stack.Screen name="GroupInfo" component={GroupInfo} />
            <Stack.Screen name="Gallery" component={Gallery} />
            <Stack.Screen name="MuteGroup" component={MuteGroup} />
            <Stack.Screen name="FavoriteEmpty" component={FavoriteEmpty} />
            <Stack.Screen name="Favorite" component={Favorite} />
            <Stack.Screen name="ForgotPass" component={ForgotPass} />
            <Stack.Screen name="InboxOTP" component={InboxOTP} />
            <Stack.Screen name="CreateNewPass" component={CreateNewPass} />
            <Stack.Screen name="ResetPass" component={ResetPass} />
            <Stack.Screen name="OTPVerification" component={OTPVerification} />
            <Stack.Screen name="AuthTabs" component={AuthTabs} />
            <Stack.Screen name="OfferDetails" component={OfferDetails} />
            <Stack.Screen name="MyBusiness" component={MyBusiness} />
            <Stack.Screen name="AddOffer" component={AddOfferScreen} />
            <Stack.Screen name="OfferCard" component={OfferCard} />
            <Stack.Screen name="EventDetail" component={EventDetail} />
            <Stack.Screen name="SavedOffers" component={SavedOffers} />
            <Stack.Screen name="social" component={Social} />
            <Stack.Screen name="UpgradePackage" component={UpgradePackage} />
            <Stack.Screen name="NotificationForm" component={NotificationForm} />
            <Stack.Screen name="CreateEvent" component={CreateEvent} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1 },
});
