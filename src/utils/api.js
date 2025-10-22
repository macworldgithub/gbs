import axios from "axios";
import { API_BASE_URL } from "./config";

// export const SigninUser = async (email, password) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/user/auth/signin`,
//       {
//         email,
//         password,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': '*/*',
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Signin API error:', error);
//     throw error;
//   }
// };

export const SignupUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/auth/signup`,
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        businessName: userData.businessName,
        shortBio: userData.shortBio,
        interestedIn: userData.interestedIn,
        state: userData.state,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      }
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
    { email }
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
