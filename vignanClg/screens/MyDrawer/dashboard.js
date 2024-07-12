import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, BackHandler, Modal, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabs from './bottomTab';
import CustomDrawerContent from './drawer';
import StudentList from '../Student/studentList';
import ChangePassword from '../Principal/changePassword';
import TeacherChangePassword from '../Teacher/teacherChangePassword';
import TeachersList from '../Teacher/teacherList';
import SchoolInformation from '../Principal/schoolInformation';

const Drawer = createDrawerNavigator();

const LogoTitle = () => (
    <View style={styles.headerContainer}>
        <Image
            style={styles.logo}
            source={{ uri: "https://victoriahomeselemschool.wordpress.com/wp-content/uploads/2012/12/skul-logo-2x2.png?w=640" }}
            resizeMode="contain"
        />
        <Text style={styles.title}>Home</Text>
    </View>
);

export default function DashBoard({ route }) {
    const [exitModalVisible, setExitModalVisible] = useState(false);
    const userData = useSelector(state => state?.user);
    const student = useSelector(state => state.students.data)
    console.log(userData, "userData");
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                setExitModalVisible(true);
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    const handleExit = () => {
        BackHandler.exitApp();
    };

    return (
        <React.Fragment>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerBackground: () => (
                        <LinearGradient
                            colors={['#bdc3c7', '#2c3e50']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ flex: 1 }}
                        />
                    ),
                    headerTintColor: '#fff',
                }}
            >
                <Drawer.Screen
                    name="Home"
                    component={BottomTabs}
                    options={{
                        headerTitle: () => <LogoTitle />,
                        headerRight: () => (
                            <Image
                                style={styles.profileImage}
                                source={{ uri: student?.image || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQArQMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAgMEAQUH/8QAKhABAAIBAgUDAwUBAAAAAAAAAAECAxESBCExQVFhcYEikZITMjNToRT/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAAAAAAAAAAAAAAAAAAAAADkzEdZQtk7QrmdeoLJyeIR/UtKIDu6fJut5cATjJKUXjvyVANAoraa9F1bRMcgdAAAAAAAAAAV3vz0h3JbSOXVUAAAB8xEeoArnNjjlv5+yVclLTpW0SCQABEzE8gBdW26NUlFZ2yv6gAAAAAAAjefpkFVp3WcAAAEb2ilZmWLJktkn6p5eFnF21tFO0RqoAAVGjBn0nbedYnpPhqea3YLbsVZ+JRVgACzFOsaK0qTpYFwAAAAACGT9qaGXoCoAAAGLiv5p9oVL+Lrpff2mNFCgAINnC/xfLG3YK7cUeZ5irAEA7wANA5HR0AAAABDJH0ym5aNYmAUAAAAjkpGSu2fifDDkpNJ0tD0OyM2pMaWmsx4mQeeNc48E94/JKtMNZ1ia/MgpwYd07rdI7eWtyLVnpaJ+XQAACOsCWONbAuAAAAAAABVkjSfdBfaNY0UTGk6AKM2fZO2mk27+iee/6eOZ7zyhhBK1rWnW0zKOkAqAAHwsx5r05ROseFYDfjyVyViaz8eE2HDfZkie09W5FF2ONK+qvHXWVwAAAAAAAACN67o9UgHn8brG2ssr1suGuWsxbr58MGbhcmPnEbq+YUUACAAAO1rN50rEzIOPSwxupWfRTg4LpOb8W2IiI0joikRpDoAAAAAAAAAAAAAryYMeTnasa+VFuBpP7bWj/WsBh/4Z/sj7OxwPnJ9obQGanB4q9dbe8r60rWNK1iI9EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==" }}
                                resizeMode="contain"
                            />
                        ),
                    }}
                />
                <Drawer.Screen name="teacherList" component={TeachersList} />
                <Drawer.Screen name="StudentList" component={StudentList} />
                <Drawer.Screen name="schoolInformation" component={SchoolInformation} />
                <Drawer.Screen name="ChangePassword" component={ChangePassword} />
                <Drawer.Screen name="teacherChangePassword" component={TeacherChangePassword} options={{headerTitle: 'ChangePassword'}} />

            </Drawer.Navigator>

            <Modal
                transparent={true}
                visible={exitModalVisible}
                onRequestClose={() => setExitModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Exit App</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to exit?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setExitModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleExit}
                            >
                                <Text style={styles.modalButtonText}>YES</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    profileImage: {
        width: 40,
        height: 40,
        marginRight: 15,
        borderRadius: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    modalButtonText: {
        fontSize: 16,
        color: '#007BFF',
    },
});
