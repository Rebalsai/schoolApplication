import React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.subContent}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const iconName = route.name === 'home' ? (isFocused ? 'home' : 'home-outline')
                        : route.name === 'profile' ? (isFocused ? 'account' : 'account-outline')
                            : route.name === 'notification' ? (isFocused ? 'bell' : 'bell-outline')
                                : route.name === 'studentsDetails' ? (isFocused ? 'account-group' : 'account-group-outline')
                                    : route.name === 'studentInfo' ? (isFocused ? 'account-group' : 'account-group-outline')
                                        : 'circle';

                    const iconColor = isFocused ? '#ffffff' : '#000000';

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const tabContent = (
                        <View style={styles.iconContainer}>
                            <Icon
                                name={iconName}
                                size={30}
                                color={iconColor}
                            />
                        </View>
                    );

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={styles.tab}
                        >
                            {isFocused ? (
                                <LinearGradient
                                    colors={['#bdc3c7', '#2c3e50']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientBackground}
                                >
                                    {tabContent}
                                </LinearGradient>
                            ) : (
                                tabContent
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
            {/* Add a bottom border */}
            <View style={styles.bottomBorder} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: 60, // Adjust the height of the tab bar
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff', // Background color of the tab bar
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6', // Border color of the tab bar
    },
    subContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%',
    },
    // tab: {
    //   flex: 1,
    //   // alignItems: 'center',
    //   // justifyContent: 'center',
    //   // padding: 5, // Add some padding to ensure the icon doesn't touch the edges
    // },
    iconContainer: {
        width: 77, // Adjust size to fit the icon and background
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 10,
        backgroundColor: 'transparent', // This will be overridden by the parent TouchableOpacity backgroundColor
    },
    gradientBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 10,
    },
    bottomBorder: {
        height: 2, // Adjust the thickness of the bottom border
        backgroundColor: '#373A50', // Color of the bottom border
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});

export default CustomTabBar;
