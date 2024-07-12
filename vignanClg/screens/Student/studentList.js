import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, TextInput, Image, StyleSheet, TouchableOpacity,
    Modal, TouchableWithoutFeedback, Alert
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import ModalDropdown from 'react-native-modal-dropdown';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

const StudentList = () => {
    const route = useRoute();
    const { selectedClass } = route.params || {};
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [className, setClassName] = useState(selectedClass ? selectedClass.toString() : '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isAllClassesSelected, setIsAllClassesSelected] = useState(!selectedClass);
    const [noStudentsMessage, setNoStudentsMessage] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const user = useSelector(state => state?.user);
    const defaultProfileImage = 'https://cdn.pixabay.com/photo/2017/06/13/12/54/profile-2398783_1280.png'
    useEffect(() => {
        fetchStudents();
    }, [search, className, isAllClassesSelected]);

    const fetchStudents = async () => {
        const userId = user?.principalId ? user?.principalId : user?.id
        setLoading(true);
        setError(null);
        setNoStudentsMessage(null);
        const saveobj = {
            id: userId,
            search: search || 'null',
            class: className || 'null'
        };

        try {
            const response = await axios.post('http://10.0.2.2:5000/search/filter', saveobj);

            if (response.data.students.length === 0) {
                setNoStudentsMessage('No students found for the selected class.');
                setStudents([]);
            } else {
                setStudents(response.data.students);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setNoStudentsMessage('No students found for the selected class.');
                setStudents([]);
            } else {
                console.error('Failed to fetch students:', err);
                setError('Failed to fetch students');
            }
        } finally {
            setLoading(false);
        }
    };

    const classMapping = {
        'All Classes': '',
        '1st class': '1', '2nd class': '2', '3rd class': '3',
        '4th class': '4', '5th class': '5', '6th class': '6',
        '7th class': '7', '8th class': '8', '9th class': '9',
        '10th class': '10'
    };

    const handleDropdownSelect = (index, value) => {
        if (value === 'All Classes') {
            setIsAllClassesSelected(true);
            setClassName('');
        } else {
            const classValue = classMapping[value];
            setClassName(classValue);
            setIsAllClassesSelected(false);
        }
    };

    const handleSearchChange = (text) => {
        setSearch(text);
    };

    const openStudentDetails = (student) => {
        setSelectedStudent(student);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            const response = await axios.delete('http://10.0.2.2:5000/Student/delete', {
                data: { _id: studentId }
            });

            if (response.data.Status === 'Success') {
                setStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.data.msg,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.data.msg,
                });
            }
        } catch (error) {
            console.error('Failed to delete student:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete student',
            });
        }
    };

    const confirmDeleteStudent = (studentId) => {
        setStudentToDelete(studentId);
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (studentToDelete) {
            handleDeleteStudent(studentToDelete);
            setDeleteModalVisible(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalVisible(false);
        setStudentToDelete(null);
    };

    const renderItem = ({ item }) => (
        <View style={styles.studentContainer}>
            <View style={styles.studentDetails}>
                <TouchableOpacity onPress={() => openStudentDetails(item)}>
                    <Text style={styles.studentName}>Full Name: {item.fullName}</Text>
                </TouchableOpacity>
                <Text style={styles.studentEmail}>fatherEmail: {item.email}</Text>
                <Text style={styles.studentPhone}>fatherphoneNo: {item.fatherphoneNo}</Text>
                <Text style={styles.studentClass}>Class: {item.class}</Text>
                <Text style={styles.studentGender}>Gender: {item.gender}</Text>
                <Text style={styles.studentAddress}>Address: {item.address}</Text>
                <Text style={styles.studentCity}>City: {item.city}</Text>
                <Text style={styles.studentStatus}>Status: {item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => openStudentDetails(item)} style={styles.imageContainer}>
                {/* {item.image ? (
                    <Image
                        source={{ uri: `http://10.0.2.2:5000/${item.image}` }}
                        style={styles.studentImage}
                        onError={(error) => console.log('Error loading image:', error)}
                    />
                ) : null} */}               
                    <Image
                    source={{ uri: item.image ? `http://10.0.2.2:5000/${item.image}` : defaultProfileImage }}
                        style={styles.studentImage}
                        onError={(error) => console.log('Error loading image:', error)}
                    />
            </TouchableOpacity>
            <TouchableOpacity style={styles.del} onPress={() => confirmDeleteStudent(item._id)}>
                <Icon name="delete" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.edit}>
                <Icon name="edit" size={20} color="black" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="black"
                        value={search}
                        onChangeText={handleSearchChange}
                    />
                </View>
                <ModalDropdown
                    options={[...Object.keys(classMapping)]}
                    onSelect={handleDropdownSelect}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownDropdown}
                    renderRow={(option, index, isSelected) => (
                        <View style={[styles.dropdownRow, isSelected ? { backgroundColor: 'gray' } : null]}>
                            <Text style={styles.dropdownRowText}>{option}</Text>
                        </View>
                    )}
                >
                    <View style={styles.dropdownButton}>
                        <Icon name="bars" size={30} color="black" />
                    </View>
                </ModalDropdown>
            </View>
            {loading && <Text style={styles.loadingText}>Loading...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {noStudentsMessage && <Text style={styles.errorText}>{noStudentsMessage}</Text>}

            <FlatList
                data={students}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.deleteModalView}>
                        <Text style={styles.deleteModalText}>Are you sure you want to delete this student?</Text>
                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, { backgroundColor: 'green' }]}
                                onPress={handleConfirmDelete}
                            >
                                <Text style={styles.deleteModalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, { backgroundColor: 'gray' }]}
                                onPress={handleCancelDelete}
                            >
                                <Text style={styles.deleteModalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Student Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalView}>
                            {selectedStudent && (
                                <>
                                    <Image
                                        source={{ uri: selectedStudent.image ? `http://10.0.2.2:5000/${selectedStudent.image}` : defaultProfileImage }}
                                        style={styles.modalImage}
                                    />
                                    <Text style={styles.modalText}>Full Name: {selectedStudent.fullName}</Text>
                                    <Text style={styles.modalText}>Email: {selectedStudent.email}</Text>
                                    <Text style={styles.modalText}>Father's Phone No: {selectedStudent.fatherphoneNo}</Text>
                                    <Text style={styles.modalText}>Class: {selectedStudent.class}</Text>
                                    <Text style={styles.modalText}>Gender: {selectedStudent.gender}</Text>
                                    <Text style={styles.modalText}>Address: {selectedStudent.address}</Text>
                                    <Text style={styles.modalText}>City: {selectedStudent.city}</Text>
                                    <Text style={styles.modalText}>Status: {selectedStudent.status}</Text>
                                </>
                            )}
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                {/* <Text style={styles.closeButtonText}>Close</Text> */}
                                <Icon name="close" size={25} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E8EBF2',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 7,
        borderRadius: 4,
        marginBottom: 30,
        borderWidth: 2,
        marginTop: 60,
        backgroundColor: "white"
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 200,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flex: 1,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 5,
        color: 'black',
    },
    dropdown: {
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownText: {
        color: 'black',
        fontSize: 18,
    },
    dropdownDropdown: {
        width: 140,
        height: 200,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        marginTop: -40
    },
    dropdownRow: {
        padding: 10,
    },
    dropdownRowText: {
        color: 'black',
        fontSize: 18,
    },
    studentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    studentDetails: {
        flex: 1,
        paddingRight: 10,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    studentEmail: {
        fontSize: 16,
        marginTop: 5,
    },
    studentPhone: {
        fontSize: 16,
        marginTop: 5,
    },
    studentClass: {
        fontSize: 16,
        marginTop: 5,
    },
    studentGender: {
        fontSize: 16,
        marginTop: 5,
    },
    studentAddress: {
        fontSize: 16,
        marginTop: 5,
    },
    studentCity: {
        fontSize: 16,
        marginTop: 5,
    },
    studentStatus: {
        fontSize: 16,
        marginTop: 5,
    },
    studentImage: {
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 8,
        color: 'black',
    },
    modalImage: {
        // width: '70%',
        // height: 150,
        // marginBottom: 10,
        // borderRadius: 5,
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 80
    },
    loadingText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    del: {
        position: "absolute",
        top: 10,
        right: 20
    },
    edit: {
        position: "absolute",
        top: 10,
        right: 70
    },
    closeButton: {
        backgroundColor: 'lightblue',
        position: "absolute",
        top: 15,
        right: 20,
        width: 26,
        height: 26,
        borderRadius: 20

        // padding: 10,
        // borderRadius: 5,
        // alignSelf: 'flex-end',
        // marginTop: 10,
    },
    deleteModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    deleteModalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20
    },
    deleteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    deleteModalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    deleteModalButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
});

export default StudentList;

