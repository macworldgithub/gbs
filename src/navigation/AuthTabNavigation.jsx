import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import CustomTabBar from "../../components/CustomTabBar"
import Favorite from "../Screens/Favorite";
import AllChat from "../Screens/AllChat";
import MembersDirectory from "../Screens/Directory";
import BusinessPage from "../Screens/BusinessPage";
import Chat from "../Screens/Chat";
import WellbeingScreen from "../Screens/Wellbeing";
import Offers from "../Screens/Offers";
const Tab = createBottomTabNavigator();

export default function AuthTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Directory" component={MembersDirectory} />
      <Tab.Screen name="Business" component={BusinessPage} />
      <Tab.Screen name="Social" component={Chat} />
      <Tab.Screen name="Wellbeing" component={WellbeingScreen} />
      <Tab.Screen name="Offers" component={Offers} />

    </Tab.Navigator>
  );
}
