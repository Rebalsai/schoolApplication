import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const SelectLogin = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#bdc3c7', '#2c3e50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Add Image component here */}
        <Image
          source={{ uri: "https://c8.alamy.com/comp/BP5AM3/teachers-and-parents-meet-during-a-pta-parent-teacher-association-BP5AM3.jpg" }} // Replace with a high-resolution image URL
          style={styles.logo}
        />
        <Text style={styles.title}>Select Login</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.tabText}>Principal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate('teacherLogin')}
          >
            <Text style={styles.tabText}>Teacher</Text>
          </TouchableOpacity>
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
  logo: {
    width: 250,  // Adjust width and height as needed
    height: 250,
    borderRadius: 150, // Half of the width and height to make it circular
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    backgroundColor: '#1ABC9C',
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 18,
  },
});


export default SelectLogin;
