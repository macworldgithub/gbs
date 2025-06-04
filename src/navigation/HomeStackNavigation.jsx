import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Stack } from "expo-router";


const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>

    </HomeStack.Navigator>
  );
}
