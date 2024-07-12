import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';

const TeachersList = ({ navigation }) => {
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState('');
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const user = useSelector(state => state?.user);

    useEffect(() => {
        fetchTeachers();
    }, [search, className]);

    const fetchTeachers = async () => {
        setLoading(true);
        setError(null);

        const saveObj = {
            principalId: user?.id,
            search: search || "null",
            className: className || "null"
        }
        try {
            const response = await axios.post(`http://10.0.2.2:5000/filter/search`,saveObj)
               
            if (response.status === 200) {
                if (response.data.teachers && response.data.teachers.length > 0) {
                    setTeachers(response.data.teachers);
                } else {
                    console.log("Teachers not found");
                    setTeachers([]);
                }
            } else if (response.status === 404) {
                console.log(response.data.message); // Log the message "Teachers not found"
                setTeachers([]);
            } else {
                console.log("Unexpected response status:", response.status);
                setTeachers([]);
            }
        } catch (err) {
            console.error(err);
            setTeachers([]); // Clear the teachers list on error
        } finally {
            setLoading(false);
        }
    };

    const classMapping = {
        '1st class': 1,
        '2nd class': 2,
        '3rd class': 3,
        '4th class': 4,
        '5th class': 5,
        '6th class': 6,
        '7th class': 7,
        '8th class': 8,
        '9th class': 9,
        '10th class': 10,
    };

    const handleDropdownSelect = (value) => {
        const classValue = classMapping[value];
        setClassName(classValue);
        setDropdownVisible(false);
    };

    const handleSearchChange = (text) => {
        setSearch(text);
    };

    const openTeacherDetails = (teacher) => {
        setSelectedTeacher(teacher);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const confirmDelete = (teacher) => {
        setTeacherToDelete(teacher);
        setDeleteModalVisible(true);
    };

    const deleteTeacher = async () => {
        try {
            await axios.delete(`http://10.0.2.2:5000/Teacher/delete`, {
                data: { _id: teacherToDelete._id }
            });
            setTeachers(teachers.filter(t => t._id !== teacherToDelete._id));
        } catch (err) {
            console.error('Failed to delete teacher', err);
        } finally {
            setDeleteModalVisible(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.teacherContainer}>
            <View style={styles.teacherDetails}>
                <TouchableOpacity onPress={() => openTeacherDetails(item)}>
                    <Text style={styles.teacherName}>Full Name: {item.fullName}</Text>
                </TouchableOpacity>
                <Text style={styles.teacherEmail}>Email: {item.email}</Text>
                <Text style={styles.teacherPhone}>Phone: {item.phone}</Text>
                <Text style={styles.teacherClass}>Class: {item.class}</Text>
                <Text style={styles.teacherGender}>Gender: {item.gender}</Text>
                <Text style={styles.teacherAddress}>Address: {item.address}</Text>
                <Text style={styles.teacherCity}>City: {item.city}</Text>
                <Text style={styles.teacherStatus}>Status: {item.status}</Text>
            </View>
            <View style={styles.teacherProfile}>
                <View style={styles.editAndDelete}>
                    <TouchableOpacity onPress={() => navigation.navigate('teacherEdit', { teacher: item })}>
                        <Icon name="edit" size={25} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(item)}>
                        <Icon name="delete" size={25} color="black" />
                    </TouchableOpacity>
                </View>
                {item.image && (
                    <TouchableOpacity onPress={() => openTeacherDetails(item)}>
                        <Image source={{ uri: `http://10.0.2.2:5000/${item.image}` }} style={styles.teacherImage} />
                    </TouchableOpacity>
                )}
            </View>
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
                <View style={styles.filter}>
                    <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                        <Icon name="bars" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            {dropdownVisible && (
                <View style={styles.dropdown}>
                    <TouchableOpacity
                        style={[
                            styles.dropdownRow,
                            !className && styles.dropdownRowSelected
                        ]}
                        onPress={() => {
                            setClassName('');
                            setDropdownVisible(false);
                        }}
                    >
                        <Text style={styles.dropdownRowText}>All Classes</Text>
                    </TouchableOpacity>
                    {Object.keys(classMapping).map((key) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.dropdownRow,
                                classMapping[key] === className && styles.dropdownRowSelected
                            ]}
                            onPress={() => handleDropdownSelect(key)}
                        >
                            <Text style={styles.dropdownRowText}>{key}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {loading && <Text style={styles.loadingText}>Loading...</Text>}
            {teachers.length === 0 && !loading && (
                <Text style={styles.notFoundText}>No teachers found</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {/* {!loading && !error && teachers.length === 0 && <Text style={styles.notFoundText}>No teachers found</Text>} */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableWithoutFeedback onPress={closeModal}>
                            <Icon name="close" size={24} color="black" style={styles.closeIcon} />
                        </TouchableWithoutFeedback>
                        {selectedTeacher && (
                            <>
                                <Image
                                    source={{ uri: `http://10.0.2.2:5000/${selectedTeacher.image}` }}
                                    style={styles.modalImage}
                                />
                                <Text style={styles.modalText}>Full Name: {selectedTeacher.fullName}</Text>
                                <Text style={styles.modalText}>Email: {selectedTeacher.email}</Text>
                                <Text style={styles.modalText}>Phone: {selectedTeacher.phone}</Text>
                                <Text style={styles.modalText}>Class: {selectedTeacher.class}</Text>
                                <Text style={styles.modalText}>Gender: {selectedTeacher.gender}</Text>
                                <Text style={styles.modalText}>Address: {selectedTeacher.address}</Text>
                                <Text style={styles.modalText}>City: {selectedTeacher.city}</Text>
                                <Text style={styles.modalText}>Status: {selectedTeacher.status}</Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.deleteModalView}>
                        <Text style={styles.deleteModalText}>Are you sure you want to delete this teacher?</Text>
                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.deleteModalButtonCancel]}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={styles.deleteModalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.deleteModalButtonConfirm]}
                                onPress={deleteTeacher}
                            >
                                <Text style={styles.deleteModalButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={teachers}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    notFoundText: {
        alignSelf: 'center',
        marginVertical: 20,
        fontSize: 18
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderWidth: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        padding: 8,
        flex: 1,
        marginRight: 20,
        marginLeft: 20
    },
    filter: {
        marginLeft: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    searchInput: {
        flex: 1,
        marginRight: 8,
        color: 'black'
    },
    dropdownButton: {
        padding: 8
    },
    dropdown: {
        position: 'absolute',
        marginHorizontal: 200,
        width: '54%',
        top: 80,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10
    },
    dropdownRow: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1'
    },
    dropdownRowSelected: {
        backgroundColor: '#d3d3d3'
    },
    dropdownRowText: {
        color: 'black'
    },
    teacherContainer: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2
    },
    teacherDetails: {
        flex: 3
    },
    teacherName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    teacherEmail: {
        fontSize: 14,
        color: 'black'
    },
    teacherPhone: {
        fontSize: 14,
        color: 'black'
    },
    teacherClass: {
        fontSize: 14,
        color: 'black'
    },
    teacherGender: {
        fontSize: 14,
        color: 'black'
    },
    teacherAddress: {
        fontSize: 14,
        color: 'black'
    },
    teacherCity: {
        fontSize: 14,
        color: 'black'
    },
    teacherStatus: {
        fontSize: 14,
        color: 'black'
    },
    teacherProfile: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    teacherImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginTop: 8
    },
    editAndDelete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 16
    },
    modalText: {
        fontSize: 18,
        color: 'black',
        marginBottom: 8
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    deleteModalView: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    deleteModalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    deleteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    deleteModalButton: {
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 10
    },
    deleteModalButtonCancel: {
        backgroundColor: '#ccc'
    },
    deleteModalButtonConfirm: {
        backgroundColor: 'green'
    },
    deleteModalButtonText: {
        color: 'white'
    },
    loadingText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16
    },
    errorText: {
        textAlign: 'center',
        marginVertical: 20,
        color: 'red',
        fontSize: 16
    }
});

export default TeachersList;

