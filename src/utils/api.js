import axios from 'axios';
import { API_BASE_URL } from './config';


export const SigninUser = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}user/auth/signin`, {
    email,
    password,
  });
  return res.data;
};


export const SignupUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/user/auth/signup`, userData);
  return res.data;
};

