import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const loginUser = () => {
        setVisible(true);
        firestore()
            .collection('users')
            .where('email', '==', email)
            .where('password', '==', password)
            .get()
            .then(res => {
                setVisible(false);
                if (!res.empty) {
                    console.log('User found!');
                    const userData = res.docs[0].data();
                    console.log(userData.selectedApartment);
                    goToNext(
                        userData.name,
                        userData.email,
                        userData.userId,
                        userData.userType,
                        userData.selectedApartment,
                        userData.flatID
                    );
                } else {
                    Alert.alert('User not found!');
                }
            })
            .catch(error => {
                setVisible(false);
                console.log(error);
                Alert.alert('Oops! An error occurred. Try Again!');
            });
    };

    const goToNext = async (name, email, userId, userType, selectedApartment, flatID) => {
        await AsyncStorage.setItem('NAME', name);
        await AsyncStorage.setItem('EMAIL', email);
        await AsyncStorage.setItem('USERID', userId);
        await AsyncStorage.setItem('USERTYPE', userType.toString());
        await AsyncStorage.setItem('SELECTEDAPARTMENT', selectedApartment);
        if (flatID) { await AsyncStorage.setItem('FLATID', flatID); }

        if (userType == 1) {
            navigation.navigate('UserMain');
        } else if (userType == 2) {
            navigation.navigate('SecurityMain');
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Enter Email"
                style={[styles.input, { marginTop: 100 }]}
                value={email}
                onChangeText={txt => setEmail(txt)}
            />

            <TextInput
                placeholder="Enter Password"
                style={[styles.input, { marginTop: 20 }]}
                value={password}
                onChangeText={txt => setPassword(txt)}
            />

            <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                    loginUser();
                }}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
            <Text
                style={styles.orLogin}
                onPress={() => {
                    navigation.navigate('Signup');
                }}>
                Or Sign Up
            </Text>
            <Loader visible={visible} />
        </View>
    );
};

export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 30,
        color: 'black',
        alignSelf: 'center',
        marginTop: 100,
        fontWeight: '600',
    },
    input: {
        width: '90%',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,

        alignSelf: 'center',
        paddingLeft: 20,
    },
    btn: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        backgroundColor: '#FFF000',
    },
    btnText: {
        color: 'white',
        fontSize: 20,
    },
    orLogin: {
        alignSelf: 'center',
        marginTop: 50,
        fontSize: 20,
        textDecorationLine: 'underline',
        fontWeight: '600',
        color: 'black',
    },
});
