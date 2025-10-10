import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
import Toast from "react-native-toast-message";
import OfferDetails from "./src/Screens/OfferDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MyBusiness from "./src/Screens/MyBusiness";
import AddOfferScreen from "./src/Screens/AddOfferScreen";
import OfferCard from "./src/Screens/OfferCard";
import SavedOffers from "./src/Screens/SavedOffers";
import UpgradePackage from "./src/Screens/UpgradePackage";
import Social from "./src/Screens/Social";
import EventDetail from "./src/Screens/EventDetail";
import NotificationForm from "./src/Screens/NotificationForm";
import CreateEvent from "./src/Screens/CreateEvent";
import FeaturedEventsScreen from "./src/Screens/FeaturedEventsScreen";
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid,Platform} from 'react-native';
import { Alert } from 'react-native';
import { API_BASE_URL } from "./src/utils/config";
import axios from "axios";

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null); // <-- dynamic initial route
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        console.log("🚀 Existing user data at startup:", userData);

        if (userData) {
          setInitialRoute("Tabs");
        } else {
          setInitialRoute("OnboardingTwo");
        }
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
      }).start(() => {
        setShowSplash(false);
      });
    }, 4000);

    async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }
}

async function checkApplicationPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
  }
}

async function requestNotificationPermission() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "This app would like to send you notifications.",
          buttonPositive: "Allow",
          buttonNegative: "Deny",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("✅ Notification permission granted");
        return true;
      } else {
        console.log("❌ Notification permission denied");
        return false;
      }
    } catch (err) {
      console.warn("⚠️ Permission error:", err);
      return false;
    }
  } else {
    // For iOS or lower Android versions, permission is either automatic or handled separately
    return true;
  }
}



const getToken = async () => {
  try {
    // Request permission for notifications
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);

      // Get the FCM token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // Retrieve JWT token from AsyncStorage
      const userData = await AsyncStorage.getItem('userData'); // Adjust key based on your storage
      let jwtToken = null;

      if (userData) {
        const parsedData = JSON.parse(userData);
        jwtToken = parsedData.token || parsedData.jwtToken; // Adjust based on your data structure
      }

      if (jwtToken) {
        console.log('JWT Token found:', jwtToken);

        // Call the register-token API
        try {
          const response = await axios.post(
            `${API_BASE_URL}/notification/register-token`, // Replace with your backend URL
            { fcmToken: token },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('FCM token registered successfully:', response.data);
        } catch (error) {
          console.error('Error registering FCM token:', error.response?.data || error.message);
        }
      } else {
        console.log('User is not logged in (no JWT token), skipping FCM token registration');
      }

      return token;
    } else {
      console.log('Permission not granted for push notifications');
      return null;
    }
  } catch (error) {
    console.error('Error fetching FCM token:', error);
    return null;
  }
};



    requestUserPermission();
    checkApplicationPermission();
    requestNotificationPermission();
    getToken();

    
    return () => clearTimeout(timer);
  }, []);

    useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  if (showSplash) {
    return (
      <Animated.View
        style={[styles.splashContainer, { opacity: splashOpacity }]}
      >
        <Splash />
      </Animated.View>
    );
  }

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={initialRoute}
          >
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
            <Stack.Screen
              name="AddPaymentMethod"
              component={AddPaymentMethod}
            />
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
            <Stack.Screen
              name="GroupConversations"
              component={GroupConversations}
            />
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
            <Stack.Screen name="OTPSuccess" component={ResetPass} />
            <Stack.Screen name="OfferDetails" component={OfferDetails} />
            <Stack.Screen name="conversation" component={Conversations} />
            <Stack.Screen name="MyBusiness" component={MyBusiness} />
            <Stack.Screen name="AddOffer" component={AddOfferScreen} />
            <Stack.Screen name="OfferCard" component={OfferCard} />
            {/* <Stack.Screen name="CreateEvent" component={CreateEvent} /> */}
            <Stack.Screen name="EventDetail" component={EventDetail} />
            <Stack.Screen name="SavedOffers" component={SavedOffers} />
            <Stack.Screen name="social" component={Social} />
            <Stack.Screen name="UpgradePackage" component={UpgradePackage} />
            <Stack.Screen
              name="NotificationForm"
              component={NotificationForm}
            />
            <Stack.Screen name="CreateEvent" component={CreateEvent} />
            <Stack.Screen name="Featured" component={FeaturedEventsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
});
