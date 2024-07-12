import React, { useState, useContext, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../login/authContext';
import { setUserData } from '../../store/actions/StudentAction/studentActions';
import { useDispatch } from 'react-redux';
const Login = () => {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [resError, setResError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
 const dispatch = useDispatch();
  const handleInputChange = (key, value) => {
    setData({ ...data, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setResError(null);

    const newErrors = {};
    if (!data.email) {
      newErrors.email = 'Email or Phone Number is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!data.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await signIn(data.email, data.password);
      console.log(response.data,"response");
      console.log(response.status, "status");
      if (response?.status === 200) {
        dispatch(setUserData(response.data))
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.msg,
        });
        navigation.navigate('DashBoard', {
          id: response.data.id,
          fullName: response.data.fullName,
          phoneNo: response.data.phoneNo,
          email: response.data.email,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.msg,
        });
      }
    } catch (error) {
      console.log(error,"error");
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Unable to login. Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Clear errors when the screen is focused
      setErrors({});
      setResError(null);
      setData({
        email: '',
        password: '',
      });
    }, [])
  );

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#bdc3c7', '#2c3e50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          {resError && (
            <View style={styles.errorCard}>
              <View style={styles.errorHeader}>
                <Ionicons name="close-circle" size={24} color="white" />
                <Text style={styles.errorMessage}>{resError}</Text>
              </View>
            </View>
          )}
          <Text style={styles.firstText}>Hello.</Text>
          <Text style={styles.secondText}>Welcome back!</Text>
          <Text style={styles.signIn}>Sign in</Text>
          <Text style={styles.label}>Email or Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email or phone number"
            placeholderTextColor="#ffffff"
            onChangeText={(value) => handleInputChange('email', value)}
            value={data.email}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <Text style={styles.secondLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#ffffff"
              secureTextEntry={!passwordVisible}
              onChangeText={(value) => handleInputChange('password', value)}
              value={data.password}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={20}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <Text style={styles.forgotPassword} onPress={() => navigation.navigate('Otp')}>
            Forgot password?
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={styles.noAccountText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  firstText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '600',
    fontFamily: 'Roboto',
    marginLeft: 10,
    marginTop: 60,
  },
  secondText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '500',
    fontFamily: 'Roboto',
    marginLeft: 10,
  },
  signIn: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginTop: 70,
    marginLeft: 10,
  },
  label: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Roboto',
    marginTop: 20,
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderBottomColor: '#ffffff',
    borderBottomWidth: 0.5,
    color: '#ffffff',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  secondLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Roboto',
    marginLeft: 10,
    marginTop: 10,
  },
  forgotPassword: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginLeft: 210,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#1ABC9C',
    borderRadius: 40,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
    marginLeft: 10,
    marginRight: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  noAccountText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  signupText: {
    color: '#1ABC9C',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginLeft: 5,
  },
  errorCard: {
    width: '100%',
    padding: 16,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorMessage: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  closeIcon: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ffffff',
    borderBottomWidth: 0.5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  passwordInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  eyeIcon: {
    padding: 5,
  },
});

export default Login;
