// import React, { useState } from 'react';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { createStackNavigator } from '@react-navigation/stack';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import Home from '../Screens/Home';
// import Signup from '../auth/Signup';
// import Signin from '../auth/Signin';
// import SearchEvent from '../Screens/SearchEvent';
// import Notification from '../Screens/Notification';
// import UpcomingEvent from '../Screens/UpcomingEvent';
// import PopularEvent from '../Screens/PopularEvent';
// import DetailEvent from '../Screens/DetailEvent';
// import MemberLocation from '../Screens/MemberLocation';
// import Profile from '../Screens/Profile';
// import EditProfile from '../Screens/EditProfile';
// import AccountSecurity from '../Screens/AccountSecurity';
// import QRCodeScreen from '../Screens/QRCodeScreen';
// import Scanner from '../Screens/Scanner';
// import PaymentSettings from '../Screens/PaymentSettings';
// import PaymentMethod from '../Screens/PaymentMethod';
// import AddPaymentMethod from '../Screens/AddPaymentMethod';
// import PaymentSuccess from '../Screens/PaymentSuccess';
// import GeneralSetting from '../Screens/GeneralSetting';
// import Theme from '../Screens/Theme';
// import LanguageSetting from '../Screens/LanguageSetting';
// import AllChat from '../Screens/AllChat';
// import Chat from '../Screens/Chat';
// import CreateGroup from '../Screens/CreateGroup';
// import GroupInfo from '../Screens/GroupInfo';
// import GroupChat from '../Screens/GroupChat';
// import Gallery from '../Screens/Gallery';
// import MuteGroup from '../Screens/MuteGroup';
// import FavoriteEmpty from '../Screens/FavoriteEmpty';
// import Favorite from '../Screens/Favorite';
// import ForgotPass from '../Screens/ForgotPass';
// import InboxOTP from '../Screens/InboxOTP';
// import CreateNewPass from '../Screens/CreateNewPass';
// import ResetPass from '../Screens/ResetPass';
// import OTPVerification from '../auth/OTPVerification';
// import AuthTabs from '../navigation/AuthTabNavigation';
// import MembersDirectory from '../Screens/Directory';
// import BusinessPage from '../Screens/BusinessPage';
// import Onboarding from '../Screens/Onboarding';
// import OnboardingTwo from '../Screens/OnboardingTwo';

// const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();

// const userRole = 'admin'; // Replace with real role logic

// function CustomDrawerContent(props) {
//   const [socialExpanded, setSocialExpanded] = useState(false);
//   return (
//     <DrawerContentScrollView {...props}>
//       <Text style={{ marginLeft: 16, marginTop: 16, fontWeight: 'bold', fontSize: 16 }}>Chat Groups</Text>
//       {userRole === 'admin' && (
//         <DrawerItem label="Announcements" icon={({ color, size }) => <FontAwesome name="bullhorn" size={size} color={color} />} onPress={() => {}} />
//       )}
//       <DrawerItem label="Business" icon={({ color, size }) => <FontAwesome name="briefcase" size={size} color={color} />} onPress={() => {}} />
//       <TouchableOpacity onPress={() => setSocialExpanded(!socialExpanded)} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingVertical: 8 }}>
//         <FontAwesome name="users" size={20} color="#222" />
//         <Text style={{ marginLeft: 32, fontWeight: 'bold', fontSize: 15 }}>Social</Text>
//         <FontAwesome name={socialExpanded ? 'angle-up' : 'angle-down'} size={18} color="#222" style={{ marginLeft: 8 }} />
//       </TouchableOpacity>
//       {socialExpanded && (
//         <View style={{ paddingLeft: 48 }}>
//           <DrawerItem label="General" onPress={() => {}} />
//           <DrawerItem label="Horse Tipping" onPress={() => {}} />
//           <DrawerItem label="Competitions" onPress={() => {}} />
//           <DrawerItem label="Golf" onPress={() => {}} />
//           <DrawerItem label="Wine Club" onPress={() => {}} />
//           <DrawerItem label="Wellbeing" onPress={() => {}} />
//         </View>
//       )}
//     </DrawerContentScrollView>
//   );
// }

// function MainStackNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="Signup" component={Signup} />
//       <Stack.Screen name="Signin" component={Signin} />
//       <Stack.Screen name="SearchEvent" component={SearchEvent} />
//       <Stack.Screen name="Notification" component={Notification} />
//       <Stack.Screen name="UpcomingEvent" component={UpcomingEvent} />
//       <Stack.Screen name="PopularEvent" component={PopularEvent} />
//       <Stack.Screen name="DetailEvent" component={DetailEvent} />
//       <Stack.Screen name="MemberLocation" component={MemberLocation} />
//       <Stack.Screen name="Profile" component={Profile} />
//       <Stack.Screen name="EditProfile" component={EditProfile} />
//       <Stack.Screen name="AccountSecurity" component={AccountSecurity} />
//       <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
//       <Stack.Screen name="Scanner" component={Scanner} />
//       <Stack.Screen name="PaymentSettings" component={PaymentSettings} />
//       <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
//       <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} />
//       <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
//       <Stack.Screen name="GeneralSetting" component={GeneralSetting} />
//       <Stack.Screen name="Theme" component={Theme} />
//       <Stack.Screen name="LanguageSetting" component={LanguageSetting} />
//       <Stack.Screen name="AllChat" component={AllChat} />
//       <Stack.Screen name="Chat" component={Chat} />
//       <Stack.Screen name="CreateGroup" component={CreateGroup} />
//       <Stack.Screen name="GroupInfo" component={GroupInfo} />
//       <Stack.Screen name="GroupChat" component={GroupChat} />
//       <Stack.Screen name="Gallery" component={Gallery} />
//       <Stack.Screen name="MuteGroup" component={MuteGroup} />
//       <Stack.Screen name="FavoriteEmpty" component={FavoriteEmpty} />
//       <Stack.Screen name="Favorite" component={Favorite} />
//       <Stack.Screen name="ForgotPass" component={ForgotPass} />
//       <Stack.Screen name="InboxOTP" component={InboxOTP} />
//       <Stack.Screen name="CreateNewPass" component={CreateNewPass} />
//       <Stack.Screen name="ResetPass" component={ResetPass} />
//       <Stack.Screen name="OTPVerification" component={OTPVerification} />
//       <Stack.Screen name="AuthTabs" component={AuthTabs} />
//       <Stack.Screen name="MembersDirectory" component={MembersDirectory} />
//       <Stack.Screen name="BusinessPage" component={BusinessPage} />
//       <Stack.Screen name="Onboarding" component={Onboarding} />
//       <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
//     </Stack.Navigator>
//   );
// }

// export default function DrawerNavigation() {
//   return (
//     <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
//       <Drawer.Screen name="Main" component={MainStackNavigator} />
//     </Drawer.Navigator>
//   );
// }



import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Screens/Home';
import { Text } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Chat Groups"
        labelStyle={{ fontWeight: 'bold' }}
        onPress={() => {}}
      />
      <DrawerItem label="- Announcements (Admin only)" onPress={() => {}} />
      <DrawerItem label="- Business" onPress={() => {}} />
      <DrawerItem label="- Social" onPress={() => {}} />
      <DrawerItem label="    - General" onPress={() => {}} />
      <DrawerItem label="    - Horse Tipping" onPress={() => {}} />
      <DrawerItem label="    - Competitions" onPress={() => {}} />
      <DrawerItem label="    - Golf" onPress={() => {}} />
      <DrawerItem label="    - Wine Club" onPress={() => {}} />
      <DrawerItem label="    - Wellbeing" onPress={() => {}} />
    </DrawerContentScrollView>
  );
};

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainDrawer" component={MainDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
