import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import CustomTabBar from "../../components/CustomTabBar"
import Favorite from "../Screens/Favorite";
import AllChat from "../Screens/AllChat";

const Tab = createBottomTabNavigator();

export default function AuthTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favorite" component={Favorite}/>
      <Tab.Screen name="Chat" component={AllChat} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
