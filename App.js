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

    return () => clearTimeout(timer);
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
