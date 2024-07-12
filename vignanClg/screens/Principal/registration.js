import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Registration = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [resError, setResError] = useState(null);
    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleRegister = async () => {
        setIsLoading(true);
        setResError(null)
        const newErrors = {};
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
            setIsLoading(false)
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
            setIsLoading(false)
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
            setIsLoading(false)
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
            setIsLoading(false)
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
            setIsLoading(false)
        } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number. Must be 10 digits';
            setIsLoading(false)
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false)
            return;
        }
        const saveObj = {
            "firstName": formData?.firstName,
            "lastName": formData?.lastName,
            "email": formData?.email,
            "phoneNo": formData?.phoneNumber
        }
        try {
            const response = await axios.post('http://10.0.2.2:5000/principal/create', saveObj)
            if (response.status == 200) {
                setIsLoading(false)
                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    text2: 'You have successfully registered!',
                    position: 'top',
                });
                navigation.navigate('OtpVerification', { email: formData?.email });
            }
        } catch (error) {
            setIsLoading(false);
            // setResError(error.response?.data?.messages || error)
            Toast.show({
                type: 'error',
                text1: error.response?.data?.messages || error,
                position: 'top',
            });
        }
    };

    return (
        <LinearGradient colors={['#bdc3c7', '#2c3e50']} style={styles.gradient}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView contentContainerStyle={styles.container}>
                {resError && <View style={styles.errorCard}>
                    <View style={styles.errorHeader}>
                        <Ionicons
                            name="close-circle"
                            size={24}
                            color="white"
                        />
                        <Text style={styles.errorMessage}>{resError}</Text>
                    </View>
                </View>}
                <Text style={styles.title}>Register</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your first name"
                        placeholderTextColor="#FFF"
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                    />
                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        placeholderTextColor="#FFF"
                        value={formData.lastName}
                        onChangeText={(value) => handleInputChange('lastName', value)}
                    />
                    {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#FFF"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        keyboardType="email-address"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#FFF"
                        value={formData.phoneNumber}
                        onChangeText={(value) => handleInputChange('phoneNumber', value)}
                        keyboardType="numeric"
                    />
                    {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator size="small" color="#FFF" style={styles.loader} />
                        : <Text style={styles.buttonText}>Submit</Text>}
                </TouchableOpacity>

                <View style={styles.signInContainer}>
                    <Text style={styles.signInText}>
                        If you have an account?{' '}
                        <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
                            Sign in
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: 'white', // Light white mixed with light orange
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    inputTitle: {
        fontSize: 16,
        marginBottom: 8,
        color: 'white',
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: 'white',
        backgroundColor: 'transparent',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
    button: {
        width: '100%',
        padding: 16,
        backgroundColor: '#1ABC9C',
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signInContainer: {
        width: '100%',
        marginTop: 16,
        alignItems: 'center',
    },
    signInText: {
        color: 'white',
        fontSize: 16,
    },
    signInLink: {
        color: '#1ABC9C',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        marginLeft: 5,
    },
    loader: {
        marginLeft: 10, // Add some margin to the left of the loader
    },
    errorCard: {
        width: '100%',
        padding: 16,
        backgroundColor: '#e74c3c',
        borderRadius: 10,
        marginBottom: 16,
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
    },
});

export default Registration;
