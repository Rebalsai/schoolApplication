import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const Otp = ({ navigation }) => {
  const [enterEmail, setEnterEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate if the email is in a correct format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if the email contains emojis
  const containsEmoji = (text) => {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
    return emojiRegex.test(text);
  };

  // Handle the forget password logic
  const handleForgetPassword = async () => {
    let email = enterEmail.trim();

    if (email === '') {
      setError('Email is required');  // Error message for empty email
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');  // Error message for invalid email format
      return;
    }

    if (containsEmoji(email)) {
      setError('Email address cannot contain emojis');
      return;
    }

    setLoading(true);
    try {
      // Make the API request to send OTP
      const response = await axios.post('http://10.0.2.2:5000/Principal/sendOtp', { email });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message,
        });
        // Navigate to OTP verification screen with email parameter
        navigation.navigate('OtpVerification', { email: email });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#bdc3c7', '#2c3e50']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.mainView}>
        <View style={styles.textView}>
          <Text style={styles.text}>Enter Your Email</Text>
          <Text style={styles.text}>We will send you a verification code</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            placeholder="Enter your Email"
            placeholderTextColor="white"
            style={styles.textInput}
            value={enterEmail}
            onChangeText={value => {
              setEnterEmail(value);
              setError('');  // Clear error when email input changes
            }}
          />
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={handleForgetPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  textView: {
    alignItems: 'center',
    marginBottom: 40,
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 5,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 30,
    width: '80%',
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1ABC9C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 40,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Otp;
