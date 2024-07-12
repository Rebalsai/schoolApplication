import React, { createContext, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const signIn = async (email, password) => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/principal/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const userData = response.data; // Assuming the token is in response.data.token
        setUserToken(userData);
        await AsyncStorage.setItem('userToken', JSON.stringify(userData)); // Convert object to string
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const teachersignIn = async (email, password) => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/Teacher/login', {
        email,
        password,
      });
      console.log(response.data,"teacherResponse");
      if (response.status === 200) {
        const userData = response.data; // Assuming the token is in response.data.token
        setUserToken(userData);
        await AsyncStorage.setItem('userToken', JSON.stringify(userData)); // Convert object to string
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUserToken(null);
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, userToken, teachersignIn }}>
      {children}
    </AuthContext.Provider>
  );
};