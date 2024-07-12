import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Home/home';
import Notifications from '../Notifications/notifications';
import Profile from '../Principal/profile';
import StudentDetails from '../Student/studentDetails';
import CustomTabBar from './customTab';
import TeacherProfile from '../Teacher/teacherViewProfile';
import { useSelector } from 'react-redux';


const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const user = useSelector(state => state?.user);

    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="home" component={Home} />
            <Tab.Screen name="notification" component={Notifications} />
            {user?.userType == "principal" ?  <Tab.Screen name="profile" component={Profile} /> 
            : <Tab.Screen name="profile" component={TeacherProfile} />}
            <Tab.Screen name="studentsDetails" component={StudentDetails} />
            </Tab.Navigator>
    );
}
