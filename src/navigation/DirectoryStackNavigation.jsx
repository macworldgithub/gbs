import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MembersDirectory from "../Screens/Directory";
import DirectoryDetail from "../Screens/DirectoryDetail";

const Stack = createStackNavigator();

export default function DirectoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DirectoryList" component={MembersDirectory} />
      <Stack.Screen name="DirectoryDetail" component={DirectoryDetail} />
    </Stack.Navigator>
  );
}
