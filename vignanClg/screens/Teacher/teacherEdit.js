import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Card, Modal, Portal, Provider, RadioButton } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const TeacherEdit = ({ navigation }) => {
    const userId = useSelector(state => state?.user?.id);

    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        gender: '',
        address: '',
        state: '',
        pinCode: '',
        className: '',
        principalId: userId
    });

    const [profileImage, setProfileImage] = useState('');
    const [galleryImage, setGalleryImage] = useState('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUMh2eeRfc6F-RerCp58Ot90bhrLMAQSAvK1RIvRTSOqd4yyot');
    const [loading, setLoading] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [classModalVisible, setClassModalVisible] = useState(false);
    const [gender, setGender] = useState('');
    const [title, setTitle] = useState('');
    const [className, setClassName] = useState('');


    // Handle form field changes
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validation function
    const validateForm = () => {
        const errors = [];
        if (!formData.title) errors.push('Title is required');
        if (!formData.firstName) errors.push('First Name is required');
        if (!formData.lastName) errors.push('Last Name is required');
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.push('Valid Email is required');
        if (!formData.phoneNo || formData.phoneNo.length < 10) errors.push('Phone Number must be at least 10 digits');
        if (!formData.gender) errors.push('Gender is required');
        if (!formData.address) errors.push('Address is required');
        if (!formData.state) errors.push('State is required');
        if (!formData.pinCode || formData.pinCode.length < 6) errors.push('Pin Code must be at least 6 digits');
        if (!formData.className) errors.push('Class Name is required');

        return errors;
    };

    // Handle form submission
    const handleSubmit = async () => {
        const errors = validateForm();
        if (errors.length > 0) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: errors.join(', '),
            });
            return;
        }

        try {
            setLoading(true);

            const form = new FormData();
            for (const key in formData) {
                form.append(key, formData[key]);
            }

            if (profileImage) {
                form.append('image', {
                    uri: profileImage,
                    type: 'image/jpeg',
                    name: 'profile.jpg',
                });
            }

            if (galleryImage && galleryImage !== 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUMh2eeRfc6F-RerCp58Ot90bhrLMAQSAvK1RIvRTSOqd4yyot') {
                form.append('bagroundImage', {
                    uri: galleryImage,
                    type: 'image/jpeg',
                    name: 'gallery.jpg',
                });
            }

            // Make the API request
            const response = await axios.post('http://10.0.2.2:5000/teacher/create', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle the response
            console.log(response.data);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Teacher created successfully!',
            });
            setLoading(false);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong!',
            });
            setLoading(false);
        }
    };

    // Handle image picking
    const handleImagePick = (setter, key) => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
        })
            .then((image) => {
                setter(image.path.toString());
                handleChange(key, image.path.toString());
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Show and hide modals
    const showGenderModal = () => setGenderModalVisible(true);
    const hideGenderModal = () => setGenderModalVisible(false);

    const handleGenderSelect = (value) => {
        setGender(value);
        handleChange('gender', value);
        hideGenderModal();
    };

    const showTitleModal = () => setTitleModalVisible(true);
    const hideTitleModal = () => setTitleModalVisible(false);

    const handleTitleSelect = (value) => {
        setTitle(value);
        handleChange('title', value);
        hideTitleModal();
    };

    const showClassModal = () => setClassModalVisible(true);
    const hideClassModal = () => setClassModalVisible(false);

    const handleClassSelect = (value) => {
        setClassName(value);
        handleChange('className', value);
        hideClassModal();
    };

    return (
        <Provider>
            {/* <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover"> */}
            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.card}>
                    {/* Gallery Image Section */}
                    <View style={styles.galleryContainer}>
                        {/* <Image source={{ uri: galleryImage }} style={styles.galleryImage} /> */}
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => handleImagePick(setGalleryImage, 'bagroundImage')}>
                                <AntDesign name='camera' size={24} color="orange" style={styles.camera} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.removeButton} onPress={() => setGalleryImage('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUMh2eeRfc6F-RerCp58Ot90bhrLMAQSAvK1RIvRTSOqd4yyot')}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Profile Image Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={() => handleImagePick(setProfileImage, 'image')} style={styles.imagePicker}>
                                {/* <Image source={{ uri: profileImage || Image.resolveAssetSource(defaultProfileImage).uri }} style={styles.profileImage} /> */}
                                <AntDesign name='camera' size={24} color="orange" style={styles.cameraIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.removeButton} onPress={() => setProfileImage('')}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Title Input */}
                        <TouchableOpacity style={styles.titleInput} onPress={showTitleModal}>
                            <TextInput
                                style={styles.input}
                                placeholder="Title"
                                value={title}
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>

                        {/* Form Fields */}
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            value={formData.firstName}
                            onChangeText={(value) => handleChange('firstName', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChangeText={(value) => handleChange('lastName', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(value) => handleChange('email', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={formData.phoneNo}
                            onChangeText={(value) => handleChange('phoneNo', value)}
                        />

                        {/* Gender and Class Inputs */}
                        <TouchableOpacity style={styles.genderInput} onPress={showGenderModal}>
                            <TextInput
                                style={styles.input}
                                placeholder="Gender"
                                value={gender}
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.classInput} onPress={showClassModal}>
                            <TextInput
                                style={styles.input}
                                placeholder="Class"
                                value={className}
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={formData.address}
                            onChangeText={(value) => handleChange('address', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="State"
                            value={formData.state}
                            onChangeText={(value) => handleChange('state', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Pin Code"
                            value={formData.pinCode}
                            onChangeText={(value) => handleChange('pinCode', value)}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Gender Modal */}
                <Portal>
                    <Modal visible={genderModalVisible} onDismiss={hideGenderModal} contentContainerStyle={styles.modalContainer}>
                        <RadioButton.Group onValueChange={handleGenderSelect} value={gender}>
                            <RadioButton.Item label="Male" value="male" />
                            <RadioButton.Item label="Female" value="female" />
                            <RadioButton.Item label="Other" value="other" />
                        </RadioButton.Group>
                    </Modal>
                </Portal>

                {/* Title Modal */}
                <Portal>
                    <Modal visible={titleModalVisible} onDismiss={hideTitleModal} contentContainerStyle={styles.modalContainer}>
                        <RadioButton.Group onValueChange={handleTitleSelect} value={title}>
                            <RadioButton.Item label="Mr" value="Mr" />
                            <RadioButton.Item label="Ms" value="Ms" />
                            <RadioButton.Item label="Mrs" value="Mrs" />
                            <RadioButton.Item label="Miss" value="Miss" />
                            <RadioButton.Item label="Dr" value="Dr" />
                        </RadioButton.Group>
                    </Modal>
                </Portal>

                {/* Class Modal */}
                <Portal>
                    <Modal visible={classModalVisible} onDismiss={hideClassModal} contentContainerStyle={styles.modalContainer}>
                        <RadioButton.Group onValueChange={handleClassSelect} value={className}>
                            <RadioButton.Item label="Nursery" value="Nursery" />
                            <RadioButton.Item label="L.K.G" value="L.K.G" />
                            <RadioButton.Item label="U.K.G" value="U.K.G" />
                            <RadioButton.Item label="Class I" value="Class I" />
                            <RadioButton.Item label="Class II" value="Class II" />
                            <RadioButton.Item label="Class III" value="Class III" />
                            <RadioButton.Item label="Class IV" value="Class IV" />
                            <RadioButton.Item label="Class V" value="Class V" />
                        </RadioButton.Group>
                    </Modal>
                </Portal>
            </ScrollView>
            {/* </ImageBackground> */}
        </Provider>
    );
};

// Styling
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 20,
    },
    card: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    galleryContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    galleryImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    iconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    camera: {
        marginRight: 10,
    },
    removeButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePicker: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    genderInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    titleInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    classInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default TeacherEdit;

