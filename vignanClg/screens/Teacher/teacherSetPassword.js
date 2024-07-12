// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Platform, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';


// const TeacherSetPassword = ({ route }) => {
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [errors, setErrors] = useState({});

//     const navigation = useNavigation();

//     const toggleNewPasswordVisibility = () => {
//         setShowNewPassword(!showNewPassword);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };

//     const handleSubmit = async () => {
//         navigation.navigate("teacherLogin");
//     };

//     return (
//         <>
//             <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
//             <LinearGradient
//                 colors={['#bdc3c7', '#2c3e50']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.outerContainer}
//             >
//                 <View style={styles.container}>
//                     <Text style={styles.title}>Set Password</Text>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>New Password</Text>
//                         <TextInput
//                             style={styles.input}
//                             placeholder="New Password"
//                             placeholderTextColor="#F5F5F5"
//                             secureTextEntry={!showNewPassword}
//                             value={newPassword}
//                             onChangeText={(text) => {
//                                 setNewPassword(text);
//                                 if (errors.newPassword) {
//                                     setErrors((prevErrors) => ({ ...prevErrors, newPassword: '' }));
//                                 }
//                             }}
//                         />
//                         <TouchableOpacity style={styles.eyeIcon} onPress={toggleNewPasswordVisibility}>
//                             <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} color="#FFF" />
//                         </TouchableOpacity>
//                         {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Confirm Password</Text>
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Confirm Password"
//                             placeholderTextColor="#F5F5F5"
//                             secureTextEntry={!showConfirmPassword}
//                             value={confirmPassword}
//                             onChangeText={(text) => {
//                                 setConfirmPassword(text);
//                                 if (errors.confirmPassword) {
//                                     setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
//                                 }
//                             }}
//                         />
//                         <TouchableOpacity style={styles.eyeIcon} onPress={toggleConfirmPasswordVisibility}>
//                             <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#FFF" />
//                         </TouchableOpacity>
//                         {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
//                     </View>

//                     {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

//                     <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                         <Text style={styles.buttonText}>Submit</Text>
//                     </TouchableOpacity>
//                 </View>
//             </LinearGradient>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     outerContainer: {
//         flex: 1,
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//     },
//     container: {
//         flex: 1,
//         justifyContent: 'center',  // Center vertically
//         alignItems: 'center',       // Center horizontally
//         paddingHorizontal: 16,
//     },
//     title: {
//         fontSize: 32,
//         color: 'white',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     inputContainer: {
//         width: '100%',
//         position: 'relative',
//         marginBottom: 20,
//     },
//     label: {
//         color: 'white',
//         marginBottom: 5,
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderBottomWidth: 1,
//         paddingHorizontal: 8,
//         color: 'white',
//         width: '100%',
//         paddingRight: 40,  // Add padding to the right to make space for the eye icon
//     },
//     eyeIcon: {
//         position: 'absolute',
//         right: 10,
//         top: 35,
//     },
//     errorText: {
//         fontSize: 12,
//         color: 'red',
//         marginTop: 4,
//     },
//     button: {
//         backgroundColor: '#1ABC9C',
//         paddingVertical: 12,
//         paddingHorizontal: 24,
//         borderRadius: 40,
//         alignItems: 'center',
//         width: '100%',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//     },
// });

// export default TeacherSetPassword;


import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Platform, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const TeacherSetPassword = ({ route }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigation = useNavigation();
    const { email } = route.params;

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const containsEmoji = (text) => {
        const regex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF])/;
        return regex.test(text);
    };

    const validate = () => {
        const newErrors = {};
        if (!newPassword) newErrors.newPassword = 'New password is required';
        else if (newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters long';
        else if (containsEmoji(newPassword)) newErrors.newPassword = 'New password cannot contain emojis';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        else if (confirmPassword !== newPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const payload = {
                    email: email,
                    password: newPassword,
                    confirmPassword: confirmPassword,
                };
                const response = await axios.post('http://10.0.2.2:5000/Teacher/setPassword', payload);
                if (response.status === 200) {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: response.data.message,
                    });
                    navigation.navigate("teacherLogin");
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'An error occurred';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: errorMessage,
                });
                setErrors({ general: errorMessage });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <LinearGradient
                colors={['#bdc3c7', '#2c3e50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.outerContainer}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Set Password</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            placeholderTextColor="#F5F5F5"
                            secureTextEntry={!showNewPassword}
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                if (errors.newPassword) {
                                    setErrors((prevErrors) => ({ ...prevErrors, newPassword: '' }));
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={toggleNewPasswordVisibility}>
                            <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} color="#FFF" />
                        </TouchableOpacity>
                        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#F5F5F5"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (errors.confirmPassword) {
                                    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={toggleConfirmPasswordVisibility}>
                            <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#FFF" />
                        </TouchableOpacity>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}>Submit</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 20,
    },
    label: {
        color: 'white',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        color: 'white',
        width: '100%',
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 35,
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 40,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default TeacherSetPassword;

