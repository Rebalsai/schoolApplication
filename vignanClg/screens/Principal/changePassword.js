// import React, { useState } from 'react';
// import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import { ScrollView } from 'react-native-gesture-handler';

// const ChangePassword = () => {
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const navigation = useNavigation();

//   const toggleOldPasswordVisibility = () => {
//     setShowOldPassword(!showOldPassword);
//   };

//   const toggleNewPasswordVisibility = () => {
//     setShowNewPassword(!showNewPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!oldPassword) newErrors.oldPassword = 'Old password is required';
//     if (!newPassword) newErrors.newPassword = 'New password is required';
//     else if (newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters long';
//     if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
//     else if (confirmPassword !== newPassword) newErrors.confirmPassword = 'Passwords do not match';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleSubmit = async () => {
//     if (validate()) {
//       const saveObj = {
//         email: "devi@yopmail.com",
//         oldPassword: oldPassword,
//         newPassword: newPassword,
//         confirmPassword: confirmPassword
//       };
//       try {
//         const response = await axios.put("http://10.0.2.2:5000/principal/changePassword", saveObj);
//         console.log(response, "response");
//         if (response.status === 200) {
//           Toast.show({
//             type: 'success',
//             text1: 'Password Updated successfully',
//             position: 'top',
//           });
//           navigation.navigate("Home");
//         }
//       } catch (error) {
//         // alert("Failed to change password");
//         Toast.show({
//           type: 'error',
//           text1: error.response.data.msg,
//           position: 'top',
//         });
//         console.log(error.response.data.msg);
//       }
//     }
//   };
//   return (

//     <ScrollView style={styles.container}>
//       {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
//       {/* Profile Section */}
//       <View style={styles.card}>
//         <View style={styles.profileContainer}>
//           <Image
//             style={styles.backgroundImage}
//             source={{ uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUMh2eeRfc6F-RerCp58Ot90bhrLMAQSAvK1RIvRTSOqd4yyot' }}
//           />
//           <View style={styles.profileImageContainer}>
//             <Image
//               style={styles.profileImage}
//               source={{ uri: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRNCN-E_aYkPRuyo54rNUavwabE5Zoq4TRd-CmrDTvI_ok4IPKD' }}
//             />
//           </View>
//         </View>
//       </View>



//       <View style={styles.card}>
//         <Text style={styles.title}>Change Password</Text>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Old Password"
//             placeholderTextColor="#2c3e50"
//             secureTextEntry={!showOldPassword}
//             value={oldPassword}
//             onChangeText={setOldPassword}
//           />
//           <TouchableOpacity style={styles.eyeIcon} onPress={toggleOldPasswordVisibility}>
//             <Icon name={showOldPassword ? "eye-off" : "eye"} size={20} color="#2c3e50" />
//           </TouchableOpacity>
//           {errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword}</Text>}
//         </View>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="New Password"
//             placeholderTextColor="#2c3e50"
//             secureTextEntry={!showNewPassword}
//             value={newPassword}
//             onChangeText={setNewPassword}
//           />
//           <TouchableOpacity style={styles.eyeIcon} onPress={toggleNewPasswordVisibility}>
//             <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} color="#2c3e50" />
//           </TouchableOpacity>
//           {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
//         </View>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Confirm Password"
//             placeholderTextColor="#2c3e50"
//             secureTextEntry={!showConfirmPassword}
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />
//           <TouchableOpacity style={styles.eyeIcon} onPress={toggleConfirmPasswordVisibility}>
//             <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#2c3e50" />
//           </TouchableOpacity>
//           {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       </View>

//     </ScrollView>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 0,
//     marginHorizontal: 10,
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 3,
//   },
//   profileContainer: {
//     alignItems: 'center',
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//   },
//   backgroundImage: {
//     width: '100%',
//     height: 200,
//     marginBottom: -50,
//   },
//   profileImageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: '150%',
//     height: '130%',
//   },
//   content: {
//     fontWeight: 'bold',
//     justifyContent: 'center',
//     alignItems: 'center',
//     textAlign: 'center',
//     fontSize: 29,
//     marginBottom: 20,
//     color: "#000"
//   },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     padding: 20,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     color: '#2c3e50',
//     textAlign: 'center',
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   inputContainer: {
//     position: 'relative',
//     marginBottom: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: '#bdc3c7',
//     borderBottomWidth: 1,
//     paddingHorizontal: 8,
//     color: '#2c3e50',
//     width: '100%',
//     paddingRight: 40,
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 10,
//     top: 10,
//   },
//   errorText: {
//     fontSize: 12,
//     color: 'red',
//     marginTop: 4,
//   },
//   button: {
//     backgroundColor: '#1ABC9C',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 40,
//     alignItems: 'center',
//     width: '100%',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//   },

// });

// export default ChangePassword;

import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const user = useSelector(state => state?.user);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validate = () => {
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = 'Old password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters long';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (confirmPassword !== newPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    console.log(user?.email,"email");
    if (validate()) {
      const saveObj = {
        email: user?.email,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      };
      try {
        const response = await axios.put("http://10.0.2.2:5000/principal/changePassword", saveObj);
        console.log(response, "response");
        if (response.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Password Updated successfully',
            position: 'top',
          });
          navigation.navigate("Home");
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.response.data.msg,
          position: 'top',
        });
        console.log(error.response.data.msg);
      }
    }
  };
  return (

    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.backgroundImage}
            source={{ uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUMh2eeRfc6F-RerCp58Ot90bhrLMAQSAvK1RIvRTSOqd4yyot' }}
          />
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRNCN-E_aYkPRuyo54rNUavwabE5Zoq4TRd-CmrDTvI_ok4IPKD' }}
            />
          </View>
        </View>
      </View>



      <View style={styles.card}>
        <Text style={styles.title}>Change Password</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            placeholderTextColor="#2c3e50"
            secureTextEntry={!showOldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleOldPasswordVisibility}>
            <Icon name={showOldPassword ? "eye-off" : "eye"} size={20} color="#2c3e50" />
          </TouchableOpacity>
          {errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#2c3e50"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleNewPasswordVisibility}>
            <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} color="#2c3e50" />
          </TouchableOpacity>
          {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#2c3e50"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleConfirmPasswordVisibility}>
            <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#2c3e50" />
          </TouchableOpacity>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 0,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    marginBottom: -50,
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '150%',
    height: '130%',
  },
  content: {
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 29,
    marginBottom: 20,
    color: "#000"
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#bdc3c7',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    color: '#2c3e50',
    width: '100%',
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
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
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },

});

export default ChangePassword;
