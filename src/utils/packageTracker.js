import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { getUserData, storeUserData } from "./storage";

const PRE_UPGADE_ROLE_KEY = "pre_upgrade_role_id";

/**
 * Saves the current user's role ID before they start an upgrade process.
 */
export const saveCurrentRoleBeforeUpgrade = async () => {
  try {
    const userData = await getUserData();
    const currentRoleId = userData?.activatedPackage?.role?._id || userData?.role?._id;
    if (currentRoleId) {
      await AsyncStorage.setItem(PRE_UPGADE_ROLE_KEY, currentRoleId);
      console.log("💾 Saved pre-upgrade role ID:", currentRoleId);
    }
  } catch (error) {
    console.error("Error saving pre-upgrade role:", error);
  }
};

/**
 * Fetches the latest user profile and checks if the role has changed.
 * Returns { upgraded: boolean, newRoleName: string }
 */
export const checkForPackageUpgrade = async () => {
  try {
    const userData = await getUserData();
    if (!userData || !userData._id || !userData.token) return { upgraded: false };

    const preUpgradeRoleId = await AsyncStorage.getItem(PRE_UPGADE_ROLE_KEY);
    if (!preUpgradeRoleId) return { upgraded: false };

    console.log("🔍 Checking for package upgrade. Pre-upgrade Role ID:", preUpgradeRoleId);

    // Fetch fresh profile from backend
    const res = await axios.get(`${API_BASE_URL}/user/${userData._id}`, {
      headers: { Authorization: `Bearer ${userData.token}` }
    });

    const freshUser = res.data;
    if (!freshUser) return { upgraded: false };

    // Update local storage with fresh data
    const updatedUserData = { ...userData, ...freshUser };
    await storeUserData(updatedUserData);
    console.log("✅ Updated local user data with fresh profile");

    const newRoleId = freshUser.activatedPackage?.role?._id || freshUser.role?._id;
    const newRoleName = freshUser.activatedPackage?.role?.label || freshUser.activatedPackage?.role?.name || "New Package";

    if (newRoleId && newRoleId !== preUpgradeRoleId) {
      console.log("🎉 Upgrade detected! New Role:", newRoleName);
      await AsyncStorage.removeItem(PRE_UPGADE_ROLE_KEY);
      return { upgraded: true, newRoleName };
    }

    return { upgraded: false };
  } catch (error) {
    console.error("Error checking package upgrade:", error.response?.data || error.message);
    return { upgraded: false };
  }
};
