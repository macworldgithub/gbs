import React, { useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import MembersDirectory from "../Screens/Directory";
import DirectoryDetail from "../Screens/DirectoryDetail";

const Stack = createStackNavigator();

export default function DirectoryStack({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      if (navigation && navigation.reset) {
        navigation.reset({
          index: 0,
          routes: [{ name: "DirectoryList" }],
        });
      }
    }, [navigation]),
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DirectoryList" component={MembersDirectory} />
      <Stack.Screen name="DirectoryDetail" component={DirectoryDetail} />
    </Stack.Navigator>
  );
}
