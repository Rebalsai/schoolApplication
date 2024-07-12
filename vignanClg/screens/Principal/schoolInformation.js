import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator,
    Button,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
const defaultBackCoverImage = require('../../assets/images/coverPicture.png');
const defaultProfileImage = require('../../assets/images/profilePic.png');

const SchoolInformation = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [dateOfRegistration, setDateOfRegistration] = useState('');
    const [principalName, setPrincipalName] = useState('');
    const [director, setDirector] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [backCover, setBackCover] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const user = useSelector(state => state?.user);
    let principalId = user?.principalId ? user?.principalId : user?.id
    // Extracting date
    const formatDate = isoString => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Getting school information data
    const fetchSchoolDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://10.0.2.2:5000/principal/schools/${principalId}`,
            );
            const schoolInformation = response.data.response.schoolInformation;
            setSchoolName(schoolInformation.schoolName);
            setDateOfRegistration(formatDate(schoolInformation.dateOfRegistration));
            setPrincipalName(schoolInformation.principalName);
            setDirector(schoolInformation.directorOfSchool);
            setCity(schoolInformation.city);
            setState(schoolInformation.state);
            setPincode(schoolInformation.pincode);

            const profilePath = schoolInformation.profile?.trim();
            const backgroundImagePath = schoolInformation.backgroundImage?.trim();
            const profilePicUrl = profilePath
                ? `http://10.0.2.2:5000/${profilePath}`
                : null;
            const backCoverUrl = backgroundImagePath
                ? `http://10.0.2.2:5000/${backgroundImagePath}`
                : null;

            setProfilePic(profilePicUrl);
            setBackCover(backCoverUrl);

            console.log('Profile Pic URL:', profilePicUrl); // Debugging output
            console.log('Back Cover URL:', backCoverUrl); // Debugging output
        } catch (error) {
            console.error('Failed to fetch school details:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchoolDetails();
    }, [principalId]);

    const handleEdit = () => {
        setModalVisible(true);
    };

    // Updating school information data
    const handleUpdate = async () => {
        try {
            // Fetch current school information
            const currentResponse = await axios.get(
                `http://10.0.2.2:5000/principal/schools/${principalId}`,
            );
            const currentSchoolInfo = currentResponse.data.response.schoolInformation;

            // Preserve existing profile and background image paths if not updated
            const updatedProfilePic = profilePic?.startsWith('http://10.0.2.2:5000/')
                ? currentSchoolInfo?.profile
                : profilePic?.replace('http://10.0.2.2:5000/', '');

            const updatedBackCover = backCover?.startsWith('http://10.0.2.2:5000/')
                ? currentSchoolInfo?.backgroundImage
                : backCover?.replace('http://10.0.2.2:5000/', '');

            console.log('Updating Image :', updatedProfilePic);
            const updatedSchoolInfo = {
                schoolInformation: {
                    schoolName,
                    dateOfRegistration,
                    principalName,
                    directorOfSchool: director,
                    city,
                    state,
                    pincode,
                    profile: updatedProfilePic,
                    backgroundImage: updatedBackCover,
                },
            };

            await axios.put(
                `http://10.0.2.2:5000/principal/update/${principalId}`,
                updatedSchoolInfo,
            );

            setModalVisible(false);
            fetchSchoolDetails();
        } catch (error) {
            console.error('Failed to update details:', error.message);
        }
    };

    const handleSelectImage = () => {
        launchImageLibrary({}, async response => {
            if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                setProfilePic(imageUri);

                const formData = new FormData();
                formData.append('image', {
                    uri: imageUri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                });
                formData.append('key', 'profile');
                formData.append('action', 'update'); // Add the action parameter

                try {
                    await axios.post(
                        `http://10.0.2.2:5000/principal/image/${principalId}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        },
                    );
                    fetchSchoolDetails();
                } catch (error) {
                    console.error('Failed to upload image:', error.message);
                }
            }
        });
    };

    const handleSelectBackCoverImage = () => {
        launchImageLibrary({}, async response => {
            if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                setBackCover(imageUri);

                const formData = new FormData();
                formData.append('image', {
                    uri: imageUri,
                    name: 'backcover.jpg',
                    type: 'image/jpeg',
                });
                formData.append('key', 'background');
                formData.append('action', 'update'); // Add the action parameter

                try {
                    await axios.post(
                        `http://10.0.2.2:5000/principal/image/${principalId}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        },
                    );
                    fetchSchoolDetails();
                } catch (error) {
                    console.error('Failed to upload image:', error.message);
                }
            }
        });
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(dateOfRegistration);
        setShowDatePicker(false);
        setDateOfRegistration(formatDate(currentDate));
    };

    const handleRemoveImage = async () => {
        try {
            const deleteUrl = `http://10.0.2.2:5000/principal/image/${principalId}`;
            const response = await axios.post(deleteUrl, {
                key: 'profile',
                action: 'remove', // Add the action parameter
            });
            console.log('Delete response:', response.data);
            setProfilePic(null); // Reset profilePic to null
            fetchSchoolDetails();
        } catch (error) {
            console.error('Failed to remove image:', error.message);
        }
    };

    const handleRemoveBackCoverImage = async () => {
        try {
            const deleteUrl = `http://10.0.2.2:5000/principal/image/${principalId}`;
            const response = await axios.post(deleteUrl, {
                key: 'background',
                action: 'remove', // Add the action parameter
            });
            console.log('Delete response:', response.data);
            setBackCover(null); // Reset backCover to null
            fetchSchoolDetails();
        } catch (error) {
            console.error('Failed to remove background image:', error.message);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.outerContainer}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <View>
                    <View style={styles.imageAndBackcoverContainer}>
                        <View style={styles.container}>
                            <Image
                                source={backCover ? { uri: backCover } : defaultBackCoverImage}
                                style={styles.backCoverImage}
                            />
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    onPress={handleSelectBackCoverImage}
                                    style={styles.cameraIconContainer}>
                                    <MaterialIcons name="photo-camera" size={24} color="orange" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleRemoveBackCoverImage}
                                    style={styles.removeButton}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileContainer}>
                                <Image
                                    source={profilePic ? { uri: profilePic } : defaultProfileImage}
                                    style={styles.profileImage}
                                />
                                <View style={styles.profileCameraIconContainer}>
                                    <TouchableOpacity onPress={handleSelectImage}>
                                        <MaterialIcons
                                            name="photo-camera"
                                            size={24}
                                            color="orange"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={handleRemoveImage}
                                    style={styles.profileRemoveButton}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                                <Text style={styles.name}>{principalName}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.header}>
                            <Text style={styles.heading}>School Details</Text>
                            {user?.userType == "principal" && <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                                <Feather name="edit" size={20} color="orange" />
                            </TouchableOpacity>}
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.labelAndItsValue}>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>School Name</Text>
                                <Text style={styles.value}>{schoolName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Date of Registration</Text>
                                <Text style={styles.value}>{dateOfRegistration}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Principal Name</Text>
                                <Text style={styles.value}>{principalName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Director</Text>
                                <Text style={styles.value}>{director}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>City</Text>
                                <Text style={styles.value}>{city}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>State</Text>
                                <Text style={styles.value}>{state}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Pincode</Text>
                                <Text style={styles.value}>{pincode}</Text>
                            </View>
                        </View>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(false);
                        }}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalInnerContainer}>
                                <View>
                                    <Text style={styles.modalTitle}>Edit School Information</Text>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.modellabel}>School Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={schoolName}
                                        onChangeText={setSchoolName}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.modellabel}>Date of Registration</Text>
                                    <View style={styles.datePickerWrapper}>
                                        <Text style={styles.dateText}>{dateOfRegistration}</Text>
                                        <TouchableOpacity
                                            onPress={showDatePickerModal}
                                            style={styles.datePickerIcon}>
                                            <AntDesign name="calendar" size={24} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={new Date(dateOfRegistration)}
                                            mode="date"
                                            display="default"
                                            onChange={handleDateChange}
                                        />
                                    )}
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.modellabel}>Principal Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={principalName}
                                        onChangeText={setPrincipalName}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.modellabel}>Director</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={director}
                                        onChangeText={setDirector}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.modellabel}>City</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={city}
                                        onChangeText={setCity}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.modellabel}>State</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={state}
                                        onChangeText={setState}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.modellabel}>Pincode</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={pincode}
                                        onChangeText={setPincode}
                                        keyboardType="numeric"
                                    />
                                </View>
                                {/* <View style={styles.buttonContainer}>
                    <Button title="Update" onPress={handleUpdate} />
                  </View> */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={handleUpdate}
                                        style={styles.updateButton}>
                                        <Text style={styles.updateButtonText}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleCancel}
                                        style={styles.cancelButton}>
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageAndBackcoverContainer: {
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    container: {
        alignItems: 'center',
        marginBottom: 16,
    },
    backCoverImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 7,
    },
    iconContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
    },
    cameraIconContainer: {
        marginHorizontal: 8,
    },
    profileCameraIconContainer: {
        position: 'absolute',
        right: 5,
        top: 35,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
    },
    removeButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
    },
    profileRemoveButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
        marginTop: 15,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: -50,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontWeight: 'bold',
        marginTop: 15,
    },
    detailsContainer: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderRadius: 8,
        padding: 10,
        height: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        left: 10,
    },
    editButton: {
        flexDirection: 'row',
        right: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    labelAndItsValue: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 20,
        marginLeft: 15,
    },
    label: {
        width: 140,
        fontSize: 14,
    },
    value: {
        flex: 1,
        textAlign: 'left',
        marginLeft: 16,
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalInnerContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
    modellabel: {
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        padding: 10,
    },
    datePickerContainer: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        padding: 10,
    },
    datePickerWrapper: {
        flexDirection: 'row', // Arrange text and icon horizontally
        alignItems: 'center', // Align items vertically center
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        padding: 10,
        height: 40,
    },
    dateText: {
        flex: 1, // Take up available space
        marginRight: 10, // Add some space between text and icon
    },
    datePickerIcon: {
        // padding: 5, // Add padding around the icon
    },
    divider: {
        height: 1,
        backgroundColor: '#d3d3d3',
        width: '100%',
    },
    updateButton: {
        backgroundColor: 'green',
        borderRadius: 8,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 95,
    },
    updateButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'red',
        borderRadius: 8,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row', // Align buttons in a row
        marginTop: 10,
    },
});

export default SchoolInformation;
