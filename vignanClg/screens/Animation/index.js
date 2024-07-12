import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const AnimationScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('SelectLogin');
        }, 4000);
    }, [navigation]);

    return (
        <View style={styles.wrapper}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <LinearGradient
                colors={['#bdc3c7', '#2c3e50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.innerContainer}>
                    <Animatable.Image
                        animation="zoomIn"
                        duration={1500}
                        source={{ uri: "https://c8.alamy.com/comp/2E5F6TN/chung-sing-school-yuen-long-hong-kong-2E5F6TN.jpg" }} // Replace with a high-resolution image URL
                        style={styles.image}
                    />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 150,
        marginBottom: 20,
    },
});

export default AnimationScreen;
