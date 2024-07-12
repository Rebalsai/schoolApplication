import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from '../store/store';
import DashBoard from '../screens/MyDrawer/dashboard';
import AnimationScreen from '../screens/Animation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePassword from '../screens/Principal/changePassword';
import Registration from '../screens/Principal/registration';
import { AuthContext } from '../screens/login/authContext';
import SelectLogin from '../screens/login/selectLogin';
import OtpVerification from '../screens/Principal/otpVerification';
import Otp from '../screens/Principal/otp';
import { useDispatch } from 'react-redux';
import { setUserData } from '../store/actions/StudentAction/studentActions';
import SetPassword from '../screens/Principal/setPassword';
import SchoolInformation from '../screens/Principal/schoolInformation';
import Login from '../screens/Principal/login';
import TeacherLogin from '../screens/Teacher/teacherLogin';
import TeacherRegistration from '../screens/Teacher/teacherRegistration';
import TeacherEmailOtp from '../screens/Teacher/teacherEmailOtp';
import TeacherOtpVerification from '../screens/Teacher/teacherVerifyOtp';
import TeacherSetPassword from '../screens/Teacher/teacherSetPassword';
import TeacherProfile from '../screens/Teacher/teacherViewProfile';
import StudentList from '../screens/Student/studentList';
import TeacherChangePassword from '../screens/Teacher/teacherChangePassword';
import TeachersList from '../screens/Teacher/teacherList';
import TeacherEdit from '../screens/Teacher/teacherEdit';


const AppNavigation = () => {
    const Stack = createStackNavigator();
    const { userToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [loadedUserToken, setLoadedUserToken] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(loadedUserToken, "loadedUserToken");
        const fetchUserToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const parsedToken = JSON.parse(token);
                    setLoadedUserToken(parsedToken);
                    console.log(parsedToken, "parsedToken");
                    // dispatch(setUserData(parsedToken?.id));
                    dispatch(setUserData(parsedToken));
                }
            } catch (error) {
                console.error('Error fetching user token:', error);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchUserToken();
    }, []);

    if (loading) {
        return null; // Render nothing while loading
    }

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={loadedUserToken ? 'DashBoard' : 'AnimationScreen'}>
                    <Stack.Screen name="AnimationScreen" component={AnimationScreen} />
                    <Stack.Screen name="SelectLogin" component={SelectLogin} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="OtpVerification" component={OtpVerification} />
                    <Stack.Screen name="Otp" component={Otp} />
                    <Stack.Screen name="Registration" component={Registration} />
                    <Stack.Screen name="DashBoard" component={DashBoard} />
                    <Stack.Screen name="SetPassword" component={SetPassword} />
                    {/* <Stack.Screen name="schoolInformation" component={SchoolInformation}
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#2c3e50',
                            },
                            headerTitle: 'School Information',
                            headerTintColor: '#FFFFFF',
                            headerTitleAlign: 'center',
                        }} /> */}
                    {/* <Stack.Screen name="ChangePassword" component={ChangePassword}
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#2c3e50',
                            },
                            headerTitle: 'Change Password',
                            headerTintColor: '#FFFFFF',
                            headerTitleAlign: 'center',
                        }} /> */}

                    {/* teacher files */}
                    <Stack.Screen name="teacherLogin" component={TeacherLogin} />
                    <Stack.Screen name="teacherRegistration" component={TeacherRegistration} />
                    <Stack.Screen name="teacherEamilOtp" component={TeacherEmailOtp} />
                    <Stack.Screen name="teacherOtpVerify" component={TeacherOtpVerification} />
                    <Stack.Screen name="teacherSetPassword" component={TeacherSetPassword} />
                    <Stack.Screen name="teacherProfile" component={TeacherProfile} />
                    {/* <Stack.Screen name="teacherChangePassword" component={TeacherChangePassword} options={{ headerShown: false }} /> */}
                    {/* <Stack.Screen name="teacherList" component={TeachersList} 
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#2c3e50',
                            },
                            headerTitle: 'Teacher List',
                            headerTintColor: '#FFFFFF',
                            headerTitleAlign: 'center',
                        }}/> */}
                    <Stack.Screen name="teacherEdit" component={TeacherEdit} 
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#2c3e50',
                            },
                            headerTitle: 'Teacher Edit',
                            headerTintColor: '#FFFFFF',
                            headerTitleAlign: 'center',
                        }}/>

                    {/* students file */}
                    {/* <Stack.Screen name="StudentList" component={StudentList}
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#2c3e50',
                            },
                            headerTitle: 'Student List',
                            headerTintColor: '#FFFFFF',
                            headerTitleAlign: 'center',
                        }} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

export default AppNavigation;


