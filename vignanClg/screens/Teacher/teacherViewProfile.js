import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button, ActivityIndicator, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import { Card, Modal, Portal, Provider, RadioButton } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setStudentData } from '../../store/actions/StudentAction/studentActions';

const TeacherProfile = () => {

    const [profileImage, setProfileImage] = useState('');
    const [galleryImage, setGalleryImage] = useState('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUMh2eeRfc6F-RerCp58Ot90bhrLMAQSAvK1RIvRTSOqd4yyot');
    const [updateloading, setUpdateLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [backgroundImageLoading, setBackgroundImageLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const defaultGalleryImage = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUMh2eeRfc6F-RerCp58Ot90bhrLMAQSAvK1RIvRTSOqd4yyot';
    const defaultProfileImage = 'https://cdn.pixabay.com/photo/2017/06/13/12/54/profile-2398783_1280.png';
    const [profileData, setProfileData] = useState({
        gender: '',
        dob: new Date().toISOString(),
        firstName: '',
        lastName: '',
        fullName: '',
        phoneNo: '',
        email: '',
        teacherRole: '',
        address: '',
        city: '',
        pinCode: '',
        State: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dob, setDob] = useState('');
    const students = useSelector(state => state.students?.data);
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const showGenderModal = () => setGenderModalVisible(true);
    const hideGenderModal = () => setGenderModalVisible(false);

    const handleGenderSelect = (value) => {
        setProfileData({ ...profileData, gender: value });
        hideGenderModal();
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setProfileData({ ...profileData, dob: selectedDate.toISOString() });
        }
    };

    useEffect(() => {
        handlegetUserData()
    }, [])

    useEffect(() => {
        if (students) {
            setProfileData({
                firstName: students?.firstName,
                lastName: students?.lastName,
                fullName: students?.fullName,
                phoneNo: students?.phoneNo,
                email: students?.email,
                gender: students?.gender,
                teacherRole: students?.teacherRole,
                address: students?.address,
                city: students?.city,
                pinCode: students?.pinCode,
                State: students?.State
            });
            setProfileImage(students?.image);
            setGalleryImage(students?.background);
            setDob(students?.dob);
        }
    }, [students]);

    const handlegetUserData = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:5000/teacher/information/${user?.id}`);

            if (response.status === 200) {
                dispatch(setStudentData(response.data));
            }

        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const updateProfile = async () => {
        setUpdateLoading(true);
        try {
            const response = await axios.put(`http://10.0.2.2:5000/teacher/update`, {
                _id: students?._id,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                fullName: profileData.fullName,
                dob: date.toISOString(),
                phoneNo: profileData.phoneNo,
                email: profileData.email,
                gender: profileData.gender,
                teacherRole: profileData.teacherRole,
                address: profileData.address,
                city: profileData.city,
                pinCode: profileData.pinCode,
                State: profileData.State,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            if (response.status === 200 && data.status === 'Success') {
                dispatch(setStudentData(response.data));
                Toast.show({
                    type: 'success',
                    text1: 'Profile Updated',
                    text2: 'Your profile has been successfully updated.',
                });
                hideModal();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                    text2: data.message || 'An error occurred while updating your profile.',
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Toast.show({
                type: 'error',
                text1: 'Network Error',
                text2: 'An error occurred while updating your profile. Please try again later.',
            });
        } finally {
            setUpdateLoading(false);
        }
    };


    const selectProfileImage = async () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            cropping: true,
            cropperCircleOverlay: true,
            compressImageQuality: 1,
        }).then(async response => {
            if (!response.didCancel) {
                const source = { uri: response.path };
                setProfileImage(source.uri);
                const formData = new FormData();
                formData.append('key', 'profile');
                formData.append('image', {
                    uri: response.path,
                    type: response.mime,
                    name: response.filename || response.path.split('/').pop(),
                });

                setImageLoading(true);
                await axios.post(`http://10.0.2.2:5000/Teacher/upload/${students._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(async response => {
                        setImageLoading(false);
                        if (response.status === 200) {
                            await handlegetUserData();
                            Toast.show({
                                type: 'success',
                                text1: 'Profile Image Updated',
                                text2: 'Your profile image has been successfully updated.',
                            });
                            setImageLoading(false);
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: 'Upload Failed',
                                text2: response.data.message || 'An error occurred while uploading the image.',
                            });
                        }
                    })
                    .catch(error => {
                        setImageLoading(false);
                        console.error('Image upload error:', error);
                        Toast.show({
                            type: 'error',
                            text1: 'Network Error',
                            text2: 'An error occurred while uploading the image. Please try again later.',
                        });
                    });
            }
        }).catch(error => {
            console.log('ImagePicker Error: ', error);
        });
    };

    const removeProfileImage = async () => {
        try {
            setProfileImage('');
            const formData = new FormData();
            formData.append('key', 'profile');
            formData.append('image', '');
            const uploadResponse = await axios.post(`http://10.0.2.2:5000/Teacher/upload/${students._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (uploadResponse.status === 200) {
                await handlegetUserData();
                Toast.show({
                    type: 'success',
                    text1: 'Profile Image Removed',
                    text2: 'Your profile image has been successfully removed.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Upload Failed',
                    text2: uploadResponse.data.message || 'An error occurred while removing the image.',
                });
            }
        } catch (error) {
            console.log('Error removing or uploading image:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred while removing or uploading the image. Please try again.',
            });
        }
    };


    const selectBackgroundImage = async () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            cropping: true,
            compressImageQuality: 1,
        }).then(async response => {
            if (!response.didCancel) {
                const source = { uri: response.path };
                setGalleryImage(source.uri);

                const formData = new FormData();
                formData.append('key', 'background');
                formData.append('image', {
                    uri: response.path,
                    type: response.mime,
                    name: response.filename || response.path.split('/').pop(),
                });
                setBackgroundImageLoading(true);

                await axios.post(`http://10.0.2.2:5000/Teacher/upload/${students._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(async response => {
                    setBackgroundImageLoading(false);
                    if (response.status === 200) {
                        await handlegetUserData();
                        Toast.show({
                            type: 'success',
                            text1: 'Background Image Updated',
                            text2: 'Your background image has been successfully updated.',
                        });
                        setBackgroundImageLoading(false);
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Upload Failed',
                            text2: response.data.message || 'An error occurred while uploading the image.',
                        });
                    }
                }).catch(error => {
                    setBackgroundImageLoading(false);
                    console.error('Image upload error:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Network Error',
                        text2: 'An error occurred while uploading the image. Please try again later.',
                    });
                });
            } else {
                setGalleryImage('');
            }
        }).catch(error => {
            console.log('ImagePicker Error: ', error);
        });
    };

    const removeBackgroundImage = async () => {
        try {
            setGalleryImage('');
            const formData = new FormData();
            formData.append('key', 'background');
            formData.append('image', '');
            const uploadResponse = await axios.post(`http://10.0.2.2:5000/Teacher/upload/${students._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (uploadResponse.status === 200) {
                await handlegetUserData();
                Toast.show({
                    type: 'success',
                    text1: 'Background Image Removed',
                    text2: 'Your background image has been successfully removed.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Upload Failed',
                    text2: uploadResponse.data.message || 'An error occurred while removing the image.',
                });
            }
        } catch (error) {
            console.log('Error removing or uploading image:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred while removing or uploading the image. Please try again.',
            });
        }
    };

    return (
        <Provider>
            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.card}>
                    <View style={styles.galleryContainer}>
                        <Image
                            source={{ uri: galleryImage ? `http://192.168.1.56:5000/${galleryImage || students?.background}` : defaultGalleryImage }}
                            style={styles.galleryImage}
                        />
                        {backgroundImageLoading && (
                            <View style={styles.imageLoadingContainer}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )}
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={selectBackgroundImage}>
                                <AntDesign
                                    name='camera'
                                    size={24}
                                    color={"orange"}
                                    style={styles.camera}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.removeButton} onPress={removeBackgroundImage}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.profileSection}>
                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={selectProfileImage} style={styles.imagePicker}>
                                <Image
                                    source={{ uri: profileImage ? `http://192.168.1.56:5000/${profileImage || students?.background}` : defaultProfileImage }}
                                    style={styles.profileImage}
                                />
                                {imageLoading && (
                                    <View style={styles.imageLoadingContainer}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                    </View>
                                )}
                                <AntDesign
                                    name='camera'
                                    size={24}
                                    color={"orange"}
                                    style={styles.cameraIcon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.removeButton} onPress={removeProfileImage}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.fullName}>{students?.fullName}</Text>
                    </View>
                </Card>
                <Card style={styles.detailsCard}>
                    <Card.Title
                        title="Profile details"
                        right={() => (
                            <Button title="    Edit    " onPress={showModal} color="#4CAF50" />
                        )}
                    />
                    <Card.Content>
                        <Text style={styles.label}>Email: <Text style={styles.value}>{students?.email}</Text></Text>
                        <Text style={styles.label}>phone No: <Text style={styles.value}>{students?.phoneNo}</Text></Text>
                    </Card.Content>
                </Card>
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Profile Edit</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                value={profileData.firstName}
                                onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                value={profileData.lastName}
                                onChangeText={(text) => setProfileData({ ...profileData, lastName: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={profileData.email}
                                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="phone No"
                                value={profileData.phoneNo}
                                onChangeText={(text) => setProfileData({ ...profileData, phoneNo: text })}
                            />
                            <TouchableOpacity onPress={showGenderModal}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Gender"
                                    value={profileData.gender}
                                    editable={false}
                                    onChangeText={(text) => setProfileData({ ...profileData, gender: text })}
                                />
                            </TouchableOpacity>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputWithIcon} placeholder="Dob" value={date.toDateString()} editable={false} />
                                <TouchableOpacity onPress={showDatePickerModal}>
                                    <AntDesign name="calendar" size={24} color="gray" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Role"
                                value={profileData.teacherRole}
                                onChangeText={(text) => setProfileData({ ...profileData, teacherRole: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address"
                                value={profileData.address}
                                onChangeText={(text) => setProfileData({ ...profileData, address: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="City"
                                value={profileData.city}
                                onChangeText={(text) => setProfileData({ ...profileData, city: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="pinCode"
                                value={profileData.pinCode}
                                onChangeText={(text) => setProfileData({ ...profileData, pinCode: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="State"
                                value={profileData.State}
                                onChangeText={(text) => setProfileData({ ...profileData, State: text })}
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={hideModal}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
                                    <View style={styles.buttonContent}>
                                        {updateloading && <ActivityIndicator size="small" color="#FFF" />}
                                        <Text style={[styles.buttonText, updateloading && styles.loadingText]}>Update</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </Modal>
                    <Modal visible={genderModalVisible} onDismiss={hideGenderModal} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Gender</Text>
                        <RadioButton.Group onValueChange={value => handleGenderSelect(value)} value={profileData.gender}>
                            <RadioButton.Item label="Male" value="Male" />
                            <RadioButton.Item label="Female" value="Female" />
                        </RadioButton.Group>
                        <View style={styles.closeContainer}>
                            <TouchableOpacity style={[styles.closeButton, styles.centeredButton]} onPress={hideGenderModal}>
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </Portal>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                        style={styles.dateTimePicker}
                    />
                )}
            </ScrollView>
        </Provider>
    );

};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        marginLeft: 10, // Adjust the margin as needed
    },
    imageLoadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 50,
    },
    card: {
        marginBottom: 20,
        width: '100%',
    },
    galleryContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -60,
        position: 'relative',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    camera: {
        marginRight: 10,
    },
    removeButton: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: '#ff5252',
        borderRadius: 5,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    profileSection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    imagePicker: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'white',
    },
    cameraIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
    },
    fullName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    detailsCard: {
        marginTop: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    value: {
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 25,
        margin: 32,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ff5252',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10,
    },
    closeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    closeButton: {
        backgroundColor: '#ff5252',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    closeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        position: 'absolute',
        right: 10,

    },
    inputWithIcon: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        paddingRight: 40,
    },
    dateTimePicker: {
        width: '100%',
    },
});
export default TeacherProfile;
