import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from "./secureAuth";

export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem("userData");
    if (data) return JSON.parse(data);

    const sess = await getSession({ prompt: false });
    if (sess) {
      try {
        await AsyncStorage.setItem("userData", JSON.stringify(sess));
      } catch {}
      return sess;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
