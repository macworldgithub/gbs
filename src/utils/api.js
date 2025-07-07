import axios from 'axios';
import { API_BASE_URL } from './config';

export const SigninUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/auth/signin`,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Signin API error:', error);
    throw error;
  }
};


export const SignupUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/auth/signup`,
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone, 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};