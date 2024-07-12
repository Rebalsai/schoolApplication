import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
import ModalDropdown from 'react-native-modal-dropdown';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const Home = () => {
  const student = useSelector(state => state.students.data);
  const navigation = useNavigation();

  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [overallStudentCount, setOverallStudentCount] = useState(0);
  const [selectedClass, setSelectedClass] = useState('all');
  const [classOptions, setClassOptions] = useState([]);
  const user = useSelector(state => state?.user);
  const classes = ["All Classes", ...user?.classes || []];

  useEffect(() => {
    getCountData();
    setClassOptions([
      { label: 'All Classes', value: 'all' },
      { label: '1st class', value: 1 },
      { label: '2nd class', value: 2 },
      { label: '3rd class', value: 3 },
      { label: '4th class', value: 4 },
      { label: '5th class', value: 5 },
      { label: '6th class', value: 6 },
      { label: '7th class', value: 7 },
      { label: '8th class', value: 8 },
      { label: '9th class', value: 9 },
      { label: '10th class', value: 10 }
    ]);
  }, []);

  useEffect(() => {
    if (selectedClass === 'all') {
      getCountData();
    } else {
      getCountData(selectedClass);
    }
  }, [selectedClass]);

  const getCountData = async (className = null) => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/getPrincipalCount/${user?.id}`, {
        params: {
          class: className
        }
      });
      setTeacherCount(response.data.teacherCount);

      if (className === null || className === 'all') {
        setOverallStudentCount(response.data.studentCount);
      } else {
        setStudentCount(response.data.studentCount);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handlePrincipalClassSelect = (index, value) => {
    setSelectedClass(value);
  };

  const renderPrincipalDropdownRow = (option, index, isSelected) => {
    const isSelectedClass = selectedClass === classOptions[index].value;
    return (
      <View style={[styles.dropdownRow, isSelectedClass && styles.selectedItemContainer]}>
        <Text style={[styles.dropdownRowText, isSelectedClass && styles.selectedItemLabel]}>
          {option}
        </Text>
      </View>
    );
  };

  const getClassDisplayName = (classValue) => {
    if (classValue === 'all') return 'Overall Students';
    const classNames = [
      '1st class',
      '2nd class',
      '3rd class',
      '4th class',
      '5th class',
      '6th class',
      '7th class',
      '8th class',
      '9th class',
      '10th class'
    ];
    return `Students in ${classNames[classValue - 1]}`;
  };

  const handleTeacherSelect = (index, value) => {
    setSelectedClass(value);
    console.log(value, "selectValue");
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />


      {user?.userType == "principal" && <TouchableOpacity onPress={() => navigation.navigate('TeacherList')}>
        <LinearGradient colors={['#000428', '#004e92']} style={styles.card} onPress={() => navigation.navigate('TeacherList')}>
          <Icon name="users" size={50} color="#E0F7FA" style={styles.icon} />
          <Text style={styles.cardTitle}>Teachers</Text>
          <Text style={styles.count}>{teacherCount}</Text>
        </LinearGradient>
      </TouchableOpacity>}
      {user?.userType == "principal" && <View style={styles.rightAlign}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Students filter</Text>
          <ModalDropdown
            options={classOptions.map(option => option.label)}
            onSelect={(index, value) => handlePrincipalClassSelect(index, classOptions[index].value)}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownDropdown}
            renderRow={renderPrincipalDropdownRow}
          >
            <Icons name="filter" size={20} color="black" />
          </ModalDropdown>
        </View>
      </View>}
      {user?.userType === "teacher" && (
        <View style={styles.rightAlign}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>Students filter</Text>
            <ModalDropdown
              options={classes} // Bind the classes array here
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownDropdown}
              renderRow={(option, index, isSelected) => (
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownRowText}>{option}</Text>
                </View>
              )}
              onSelect={(index, value) => {
                handleTeacherSelect(index, value);
              }}
            >
              <View style={styles.dropdownButton}>
                <Icons name="filter" size={20} color="black" />
              </View>
            </ModalDropdown>
          </View>
        </View>
      )}


      <TouchableOpacity onPress={() => navigation.navigate('StudentList', { selectedClass })}>
        <LinearGradient colors={['#2a2a2a', '#f0f0f0']} style={styles.card}>
          <Icon name="users" size={50} color="#E0F7FA" style={styles.icon} />
          <Text style={styles.cardTitle}>{getClassDisplayName(selectedClass)}</Text>
          <Text style={styles.count}>{selectedClass === 'all' ? overallStudentCount : studentCount}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 20,
  },
  ageText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  otherInfoText: {
    fontSize: 14,
    color: '#555',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: '#00BCD4',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  count: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'white',
  },
  rightAlign: {
    alignItems: 'flex-end',
    paddingLeft: 240,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderColor: '#004e92',
    borderWidth: 2,
    borderRadius: 10,
  },
  filterText: {
    marginRight: 5,
  },
  dropdown: {
    marginLeft: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownDropdown: {
    width: 150,
    borderColor: '#00BCD4',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownRow: {
    padding: 10,
  },
  dropdownRowText: {
    fontSize: 16,
  },
  selectedItemContainer: {
    backgroundColor: '#E0F7FA',
  },
  selectedItemLabel: {
    fontWeight: 'bold',
    color: '#00BCD4',
  },
});

export default Home;

