import axios from "axios";
import { API_BASE_URL } from "./config";

export const SignupUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/auth/signup`,
      userData, // Pass entire payload (includes role, conditional businessName, etc.)
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Signup API error:", error);
    throw error;
  }
};

export const sendForgotPasswordOtp = async (email) => {
  const res = await axios.post(
    `${API_BASE_URL}/user/forgot-password/send-otp`,
    { email },
  );
  return res.data;
};

export const resetForgotPassword = async ({ email, otp, newPassword }) => {
  const res = await axios.post(`${API_BASE_URL}/user/forgot-password/reset`, {
    email,
    otp,
    newPassword,
  });
  return res.data;
};

// export const PreLogin = async (email, password, deviceId) => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}/user/auth/pre-login`, {
//       email,
//       password,
//       deviceId,
//     });
//     console.log('Pre-login response:', res.data);
//     return res.data;

//   } catch (error) {
//     throw error.response?.data || { message: 'Unknown error' };
//   }
// };

export const SigninUser = async (identifier, password = undefined) => {
  try {
    let payload = {};
    const trimmedId = identifier.trim();
    console.log("🔍 API.js - Building payload for identifier:", trimmedId); // Debug: Log identifier
    console.log("🔍 API.js - Password provided?", !!password); // Debug: Password check
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId)) {
      payload.email = trimmedId.toLowerCase();
      console.log("📧 API.js - Using email:", payload.email); // Debug: Email
    } else {
      // Assume phone and format
      let cleanPhone = trimmedId.replace(/\s/g, "");
      if (cleanPhone.startsWith("04") && cleanPhone.length === 10) {
        cleanPhone = "+61" + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith("4") && cleanPhone.length === 9) {
        cleanPhone = "+61" + cleanPhone;
      }
      payload.phone = cleanPhone;
      console.log("📱 API.js - Using phone:", payload.phone); // Debug: Phone
    }
    if (password) {
      payload.password = password;
      console.log("🔑 API.js - Adding password"); // Debug: Password added
    } else {
      console.log("🚫 API.js - No password - sending without"); // Debug: No password
    }
    console.log("📦 API.js - Full Payload:", JSON.stringify(payload, null, 2)); // Debug: Full payload
    const response = await axios.post(
      `${API_BASE_URL}/user/auth/signin`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      },
    );
    console.log("✅ API.js - Response Status:", response.status); // Debug: Status
    console.log(
      "✅ API.js - Response Data:",
      JSON.stringify(response.data, null, 2),
    ); // Debug: Data
    return response.data;
  } catch (error) {
    console.error("❌ API.js - Full Signin Error:", error); // Enhanced: Full error
    console.log(
      "❌ API.js - Error Response Data:",
      error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : "No data",
    ); // Debug: Error data
    console.log("❌ API.js - Error Status:", error.response?.status); // Debug: Status
    throw error;
  }
};

const activateIfNeeded = async (packageId, token) => {
  if (!packageId || !token) return;

  try {
    const now = new Date().toISOString();

    const payload = {
      role: packageId, // the package _id
      startDate: now,
      months: 12, // ← adjust business rule (or make configurable)
      trial: false, // ← adjust
    };

    const response = await axios.post(`${API_BASE_URL}/user-package`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Package activated after login:", response.data);

    // Optional: update local user data
    const updatedUser = {
      ...user,
      activatedPackage:
        response.data.activatedPackage || response.data.userPackage,
    };

    await storeUserData(updatedUser);
    // You can also update AsyncStorage directly if needed
  } catch (err) {
    console.error(
      "Package activation error after login:",
      err.response?.data || err,
    );
    throw err; // let outer catch handle logging
  }
};

export const deleteGroupConversation = async (conversationId, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/messages/group/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Delete Group API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Fetch notification details by ID
export const getNotificationById = async (notificationId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/notification/${notificationId}`,
      {
        headers: {
          Accept: "*/*",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Get Notification error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
