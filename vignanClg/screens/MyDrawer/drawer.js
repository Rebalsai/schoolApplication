// import React, { useEffect, useRef, useState, useContext } from 'react';
// import { DrawerContentScrollView } from '@react-navigation/drawer';
// import { Image, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
// import { AuthContext } from '../login/authContext';
// import Icon from 'react-native-vector-icons/AntDesign';
// import { useSelector } from 'react-redux';
// import { CommonActions } from '@react-navigation/native';

// export default function CustomDrawerContent(props) {
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const scrollRef = useRef(null);
//   const [contentWidth, setContentWidth] = useState(0);
//   const [containerWidth, setContainerWidth] = useState(0);
//   const { signOut } = useContext(AuthContext);
//   const user = useSelector(state => state?.user);
//   useEffect(() => {
//     const scrollAnimation = () => {
//       Animated.sequence([
//         Animated.timing(scrollX, {
//           toValue: contentWidth - containerWidth,
//           duration: 10000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scrollX, {
//           toValue: 0,
//           duration: 10000,  
//           useNativeDriver: true,
//         })
//       ]).start(() => {
//         scrollAnimation();
//       });
//     };

//     if (contentWidth > 0 && containerWidth > 0) {
//       scrollAnimation();
//     }
//   }, [contentWidth, containerWidth]);

//   useEffect(() => {
//     scrollX.addListener(({ value }) => {
//       if (scrollRef.current) {
//         scrollRef.current.scrollTo({ x: value, animated: false });
//       }
//     });

//     return () => scrollX.removeAllListeners();
//   }, []);

//   const handleSignOut = () => {
//     signOut();
//     props.navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{ name: 'AnimationScreen' }],
//       })
//     );
//   };

//   const goToDashBoard = ()=>{
//     props.navigation.navigate('home');
//   }

//   const goToSchoolInfoPage = () => {
//     props.navigation.navigate('schoolInformation');
//   };

//   const goToPrincipalChangePasswordPage = () => {
//     props?.navigation?.navigate('ChangePassword')
//   }

//   const goToStudentListPage =()=>{
//     props?.navigation?.navigate('StudentList')
//   }

//   const goToTeacherChangePasswordPage = () => {
//     props?.navigation?.navigate('teacherChangePassword')
//   }

//   const goToTeacherListPage = ()=>{
//     props?.navigation?.navigate('teacherList')
//   }

//   return (
//     <View style={styles.container}>
//       <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
//         <View style={styles.profileContainer}>
//           <Image
//             source={{ uri: user?.image || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQArQMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAgMEAQUH/8QAKhABAAIBAgUDAwUBAAAAAAAAAAECAxESBCExQVFhcYEikZITMjNToRT/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAAAAAAAAAAAAAAAAAAAAADkzEdZQtk7QrmdeoLJyeIR/UtKIDu6fJut5cATjJKUXjvyVANAoraa9F1bRMcgdAAAAAAAAAAV3vz0h3JbSOXVUAAAB8xEeoArnNjjlv5+yVclLTpW0SCQABEzE8gBdW26NUlFZ2yv6gAAAAAAAjefpkFVp3WcAAAEb2ilZmWLJktkn6p5eFnF21tFO0RqoAAVGjBn0nbedYnpPhqea3YLbsVZ+JRVgACzFOsaK0qTpYFwAAAAACGT9qaGXoCoAAAGLiv5p9oVL+Lrpff2mNFCgAINnC/xfLG3YK7cUeZ5irAEA7wANA5HR0AAAABDJH0ym5aNYmAUAAAAjkpGSu2fifDDkpNJ0tD0OyM2pMaWmsx4mQeeNc48E94/JKtMNZ1ia/MgpwYd07rdI7eWtyLVnpaJ+XQAACOsCWONbAuAAAAAAABVkjSfdBfaNY0UTGk6AKM2fZO2mk27+iee/6eOZ7zyhhBK1rWnW0zKOkAqAAHwsx5r05ROseFYDfjyVyViaz8eE2HDfZkie09W5FF2ONK+qvHXWVwAAAAAAAACN67o9UgHn8brG2ssr1suGuWsxbr58MGbhcmPnEbq+YUUACAAAO1rN50rEzIOPSwxupWfRTg4LpOb8W2IiI0joikRpDoAAAAAAAAAAAAAryYMeTnasa+VFuBpP7bWj/WsBh/4Z/sj7OxwPnJ9obQGanB4q9dbe8r60rWNK1iI9EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==" }}
//             style={styles.profileImage}
//           />
//           <View style={styles.profileInfo}>
//             <View style={styles.profileRow}>
//               <Text style={styles.profileName}>{user?.fullName}</Text>
//             </View>
//             <View style={styles.profileRow}>
//               <Text style={styles.profileText}>{user?.phoneNo}</Text>
//               {/* <Text style={styles.arrow}>{' >'}</Text> */}
//             </View>
//             <Animated.ScrollView
//               ref={scrollRef}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               scrollEventThrottle={16}
//               onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
//               onContentSizeChange={(width) => setContentWidth(width)}
//             >
//               <View style={styles.profileRow}>
//                 <Text style={styles.profileText}>
//                   {user?.email}
//                 </Text>
//               </View>
//             </Animated.ScrollView>
//           </View>
//         </View>
//         <View style={styles.infoSection}>
//          <TouchableOpacity style={styles.profileRow} onPress={goToDashBoard}>
//             <Text style={styles.infoHeader}>DashBoard</Text>
//           </TouchableOpacity>
//           {user?.userType == "principal" && <TouchableOpacity style={styles.profileRow} onPress={goToTeacherListPage}>
//             <Text style={styles.infoHeader}>Teachers List</Text>
//           </TouchableOpacity>}
//           <TouchableOpacity style={styles.profileRow} onPress={goToStudentListPage}>
//             <Text style={styles.infoHeader}>Students List</Text>
//           </TouchableOpacity>
//            <TouchableOpacity style={styles.profileRow} onPress={goToSchoolInfoPage}>
//             <Text style={styles.infoHeader}>School Information</Text>
//           </TouchableOpacity>
//           {user?.userType == "principal" &&  <TouchableOpacity style={styles.profileRow} onPress={goToPrincipalChangePasswordPage}>
//             <Text style={styles.infoHeader}>Change Password</Text>
//           </TouchableOpacity>}
//           {user?.userType == "teacher" && <TouchableOpacity style={styles.profileRow} onPress={goToTeacherChangePasswordPage}>
//             <Text style={styles.infoHeader}>Change Password</Text>
//           </TouchableOpacity>}
//         </View>
//       </DrawerContentScrollView>
//       <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
//         <Icon name="logout" size={20} color="black" />
//         <Text style={styles.signOutText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: 'white',
//     borderTopRightRadius: 0,
//     borderTopLeftRadius: 0,
//     borderBottomRightRadius: 10,
//     borderBottomLeftRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//     marginHorizontal: 0,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   profileInfo: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   profileRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   profileName: {
//     fontSize: 20,
//     color: 'black',
//   },
//   profileText: {
//     fontSize: 16,
//     color: 'black',
//   },
//   arrow: {
//     fontSize: 16,
//     color: 'black',
//     textAlign: 'right',
//     flex: 1,
//   },
//   infoSection: {
//     paddingHorizontal: 15,
//     marginBottom: 'auto',
//   },
//   infoHeader: {
//     fontSize: 18,
//     color: '#000000',
//     marginBottom: 10,
//   },
//   signOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     // paddingHorizontal: 15,
//     // backgroundColor: '#f8f8f8',
//     borderRadius: 5,
//     marginBottom: 30,
//     marginHorizontal: 20,
//   },
//   signOutText: {
//     fontSize: 18,
//     color: 'black',
//     marginLeft: 10,
//   },
//   drawerEdges: {
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#dddddd',
//   },
// });



import React, { useEffect, useRef, useState, useContext } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Image, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { AuthContext } from '../login/authContext';
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

export default function CustomDrawerContent(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedItem, setSelectedItem] = useState('DashBoard');
  const { signOut } = useContext(AuthContext);
  const user = useSelector(state => state?.user);

  useEffect(() => {
    const scrollAnimation = () => {
      Animated.sequence([
        Animated.timing(scrollX, {
          toValue: contentWidth - containerWidth,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollX, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        })
      ]).start(() => {
        scrollAnimation();
      });
    };

    if (contentWidth > 0 && containerWidth > 0) {
      scrollAnimation();
    }
  }, [contentWidth, containerWidth]);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: value, animated: false });
      }
    });

    return () => scrollX.removeAllListeners();
  }, []);

  const handleSignOut = () => {
    signOut();
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AnimationScreen' }],
      })
    );
  };

  const handleNavigation = (route, item) => {
    setSelectedItem(item);
    props.navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: user?.image || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQArQMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAgMEAQUH/8QAKhABAAIBAgUDAwUBAAAAAAAAAAECAxESBCExQVFhcYEikZITMjNToRT/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAAAAAAAAAAAAAAAAAAAAADkzEdZQtk7QrmdeoLJyeIR/UtKIDu6fJut5cATjJKUXjvyVANAoraa9F1bRMcgdAAAAAAAAAAV3vz0h3JbSOXVUAAAB8xEeoArnNjjlv5+yVclLTpW0SCQABEzE8gBdW26NUlFZ2yv6gAAAAAAAjefpkFVp3WcAAAEb2ilZmWLJktkn6p5eFnF21tFO0RqoAAVGjBn0nbedYnpPhqea3YLbsVZ+JRVgACzFOsaK0qTpYFwAAAAACGT9qaGXoCoAAAGLiv5p9oVL+Lrpff2mNFCgAINnC/xfLG3YK7cUeZ5irAEA7wANA5HR0AAAABDJH0ym5aNYmAUAAAAjkpGSu2fifDDkpNJ0tD0OyM2pMaWmsx4mQeeNc48E94/JKtMNZ1ia/MgpwYd07rdI7eWtyLVnpaJ+XQAACOsCWONbAuAAAAAAABVkjSfdBfaNY0UTGk6AKM2fZO2mk27+iee/6eOZ7zyhhBK1rWnW0zKOkAqAAHwsx5r05ROseFYDfjyVyViaz8eE2HDfZkie09W5FF2ONK+qvHXWVwAAAAAAAACN67o9UgHn8brG2ssr1suGuWsxbr58MGbhcmPnEbq+YUUACAAAO1rN50rEzIOPSwxupWfRTg4LpOb8W2IiI0joikRpDoAAAAAAAAAAAAAryYMeTnasa+VFuBpP7bWj/WsBh/4Z/sj7OxwPnJ9obQGanB4q9dbe8r60rWNK1iI9EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <View style={styles.profileRow}>
              <Text style={styles.profileName}>{user?.fullName}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileText}>{user?.phoneNo}</Text>
              {/* <Text style={styles.arrow}>{' >'}</Text> */}
            </View>
            <Animated.ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
              onContentSizeChange={(width) => setContentWidth(width)}
            >
              <View style={styles.profileRow}>
                <Text style={styles.profileText}>
                  {user?.email}
                </Text>
              </View>
            </Animated.ScrollView>
          </View>
        </View>
        <View style={styles.infoSection}>
          <TouchableOpacity
            style={[styles.profileRow, selectedItem === 'DashBoard' && styles.selectedItem]}
            onPress={() => handleNavigation('home', 'DashBoard')}
          >
            <Text style={[styles.infoHeader, selectedItem === 'DashBoard' && styles.selectedText]}>DashBoard</Text>
          </TouchableOpacity>
          {user?.userType == "principal" && (
            <TouchableOpacity
              style={[styles.profileRow, selectedItem === 'TeachersList' && styles.selectedItem]}
              onPress={() => handleNavigation('teacherList', 'TeachersList')}
            >
              <Text style={[styles.infoHeader, selectedItem === 'TeachersList' && styles.selectedText]}>Teachers List</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.profileRow, selectedItem === 'StudentsList' && styles.selectedItem]}
            onPress={() => handleNavigation('StudentList', 'StudentsList')}
          >
            <Text style={[styles.infoHeader, selectedItem === 'StudentsList' && styles.selectedText]}>Students List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profileRow, selectedItem === 'SchoolInformation' && styles.selectedItem]}
            onPress={() => handleNavigation('schoolInformation', 'SchoolInformation')}
          >
            <Text style={[styles.infoHeader, selectedItem === 'SchoolInformation' && styles.selectedText]}>School Information</Text>
          </TouchableOpacity>
          {user?.userType == "principal" && (
            <TouchableOpacity
              style={[styles.profileRow, selectedItem === 'PrincipalChangePassword' && styles.selectedItem]}
              onPress={() => handleNavigation('ChangePassword', 'PrincipalChangePassword')}
            >
              <Text style={[styles.infoHeader, selectedItem === 'PrincipalChangePassword' && styles.selectedText]}>Change Password</Text>
            </TouchableOpacity>
          )}
          {user?.userType == "teacher" && (
            <TouchableOpacity
              style={[styles.profileRow, selectedItem === 'TeacherChangePassword' && styles.selectedItem]}
              onPress={() => handleNavigation('teacherChangePassword', 'TeacherChangePassword')}
            >
              <Text style={[styles.infoHeader, selectedItem === 'TeacherChangePassword' && styles.selectedText]}>Change Password</Text>
            </TouchableOpacity>
          )}
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Icon name="logout" size={20} color="black" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 0,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    color: 'black',
  },
  profileText: {
    fontSize: 16,
    color: 'black',
  },
  arrow: {
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: 15,
    marginBottom: 'auto',
  },
  infoHeader: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 10,
  },
  selectedText: {
    color: '#1E90FF', // Change this color to your preferred highlight color
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    // paddingHorizontal: 15,
    // backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  signOutText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});


