// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import Offers from "../Screens/Offers";
// import AddOfferScreen from "../Screens/AddOfferScreen";

// const Stack = createStackNavigator();

// export default function OffersStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="OffersHome" component={Offers} />
//       <Stack.Screen name="AddOffer" component={AddOfferScreen} />
//     </Stack.Navigator>
//   );
// }


import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Offers from "../Screens/Offers";
import AddOfferScreen from "../Screens/AddOfferScreen";

const Stack = createStackNavigator();

export default function OffersStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OffersList" component={Offers} />
      <Stack.Screen name="AddOffer" component={AddOfferScreen} />
    </Stack.Navigator>
  );
}

