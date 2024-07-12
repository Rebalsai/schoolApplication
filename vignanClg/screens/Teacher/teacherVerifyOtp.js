// import React, { useState, useRef } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import OTPTextInput from 'react-native-otp-textinput';


// const TeacherOtpVerification = ({ navigation, route }) => {
//     const [otp, setOtp] = useState('');
//     const [error, setError] = useState('');
//     const otpInputRef = useRef(null); // Ref to OTPTextInput component

//     const handleVerifyOtp = async () => {
//         navigation.navigate('teacherSetPassword');
//     };

//     const clearText = () => {
//         if (otpInputRef.current) {
//             otpInputRef.current.clear(); // Accessing clear method of OTPTextInput
//             setOtp(''); // Reset the OTP state
//             setError(''); // Clear any existing error messages
//         }
//     };

//     return (
//         <LinearGradient
//             colors={['#bdc3c7', '#2c3e50']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.container}
//         >
//             <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
//             <View style={styles.mainView}>
//                 <View style={styles.textView}>
//                     <Text style={styles.title}>Enter Verification Code</Text>
//                     <Text style={styles.text}>We are automatically detecting SMS</Text>
//                     <Text style={styles.text}>sent to your mobile</Text>
//                 </View>
//                 <View style={styles.otpView}>
//                     <OTPTextInput
//                         ref={otpInputRef}
//                         inputCount={6}
//                         tintColor="yellow"
//                         offTintColor="white"
//                         keyboardType="numeric"
//                         handleTextChange={(text) => {
//                             setOtp(text);
//                             setError('');  // Clear error when OTP input changes
//                         }}
//                         textInputStyle={styles.textInput}
//                         clearTextOnFocus={false} // Prevents auto-move to the next input on clear
//                     // value={otp}
//                     />
//                 </View>
//                 {error ? (
//                     <Text style={styles.errorText}>{error}</Text>
//                 ) : null}
//                 <View style={styles.resendView}>
//                     <Text style={styles.resendText}>Didn't receive the code?</Text>
//                     <TouchableOpacity >
//                         <Text style={styles.resendButton}>Resend Code</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableOpacity style={styles.okButton} onPress={handleVerifyOtp}>
//                     <Text style={styles.okButtonText}>Submit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.clearButton} onPress={clearText}>
//                     <Text style={styles.clearButtonText}>Clear OTP</Text>
//                 </TouchableOpacity>
//             </View>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     mainView: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//     },
//     textView: {
//         alignItems: 'center',
//         marginBottom: 40,
//     },
//     title: {
//         color: 'white',
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 8,
//     },
//     text: {
//         color: 'white',
//         fontSize: 18,
//         textAlign: 'center',
//         marginBottom: 4,
//     },
//     otpView: {
//         alignItems: 'center',
//         marginBottom: 24,
//     },
//     textInput: {
//         width: 40,
//         height: 40,
//         borderColor: 'yellow',
//         borderWidth: 1,
//         textAlign: 'center',
//         color: 'white',
//     },
//     errorText: {
//         color: 'red',
//         fontSize: 16,
//         marginVertical: 8,
//         textAlign: 'center',
//     },
//     resendView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 32,
//     },
//     resendText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     resendButton: {
//         color: 'yellow',
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginLeft: 4,
//     },
//     okButton: {
//         backgroundColor: '#1ABC9C',
//         paddingVertical: 12,
//         paddingHorizontal: 24,
//         borderRadius: 40,
//         alignItems: 'center',
//         width: '90%',
//         marginBottom: 16,
//     },
//     okButtonText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     clearButton: {
//         paddingVertical: 12,
//         paddingHorizontal: 24,
//         borderRadius: 40,
//         alignItems: 'center',
//         width: '90%',
//         borderColor: 'white',
//         borderWidth: 1,
//     },
//     clearButtonText: {
//         color: 'white',
//         fontSize: 16,
//     },
// });

// export default TeacherOtpVerification;


import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, Platform, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import OTPTextInput from 'react-native-otp-textinput';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const OtpVerification = ({ navigation, route }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const otpInputRef = useRef(null); // Ref to OTPTextInput component
    const { email } = route.params;

    const validateOtp = (otp) => {
        const otpRegex = /^[0-9]{6}$/;
        return otpRegex.test(otp);
    };

    const handleVerifyOtp = async () => {
        const sendOtp = {
            email: email,
            otp: otp,
        };

        if (!validateOtp(otp)) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://10.0.2.2:5000/Teacher/verifyotp', sendOtp);
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.data.message,
                });
                navigation.navigate('teacherSetPassword', { email: email });
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

    const resendOtp = async () => {
        const sendOtp = {
            email: email,
        };
        try {
            const response = await axios.post('http://10.0.2.2:5000/Teacher/resendOtp', sendOtp);
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.data.message,
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred';
            setError(errorMessage);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        }
    };

    const clearText = () => {
        if (otpInputRef.current) {
            otpInputRef.current.clear(); // Accessing clear method of OTPTextInput
            setOtp(''); // Reset the OTP state
            setError(''); // Clear any existing error messages
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
                    <Text style={styles.title}>Enter Verification Code</Text>
                    <Text style={styles.text}>We are automatically detecting SMS</Text>
                    <Text style={styles.text}>sent to your mobile</Text>
                </View>
                <View style={styles.otpView}>
                    <OTPTextInput
                        ref={otpInputRef}
                        inputCount={6}
                        tintColor="yellow"
                        offTintColor="white"
                        keyboardType="numeric"
                        handleTextChange={(text) => {
                            setOtp(text);
                            setError('');  // Clear error when OTP input changes
                        }}
                        textInputStyle={styles.textInput}
                        clearTextOnFocus={false} // Prevents auto-move to the next input on clear
                    />
                </View>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}
                <View style={styles.resendView}>
                    <Text style={styles.resendText}>Didn't receive the code?</Text>
                    <TouchableOpacity onPress={resendOtp}>
                        <Text style={styles.resendButton}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.okButton} onPress={handleVerifyOtp} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.okButtonText}>Submit</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={clearText}>
                    <Text style={styles.clearButtonText}>Clear OTP</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    textView: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    text: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 4,
    },
    otpView: {
        alignItems: 'center',
        marginBottom: 24,
    },
    textInput: {
        width: 40,
        height: 40,
        borderColor: 'yellow',
        borderWidth: 1,
        textAlign: 'center',
        color: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginVertical: 8,
        textAlign: 'center',
    },
    resendView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    resendText: {
        color: 'white',
        fontSize: 16,
    },
    resendButton: {
        color: 'yellow',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    okButton: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 40,
        alignItems: 'center',
        width: '90%',
        marginBottom: 16,
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
    },
    clearButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 40,
        alignItems: 'center',
        width: '90%',
        borderColor: 'white',
        borderWidth: 1,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default OtpVerification;

