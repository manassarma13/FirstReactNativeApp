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
import CheckBox from '@react-native-community/checkbox'
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import { ScrollView } from 'react-native-gesture-handler';
const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSelected, setSelection] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('');
    const navigation = useNavigation();

    const registerUser = () => {
        const userId = uuid.v4();
        firestore()
            .collection('users')
            .doc(userId)
            .set({
                name: name,
                email: email,
                password: password,
                mobile: mobile,
                userId: userId,
                userType: selectedRadio
            })
            .then(res => {
                console.log('user created ');
                navigation.navigate('Login');
            })
            .catch(error => {
                console.log(error);
            });
    };
    const validate = () => {
        let isValid = true;
        if (name == '') {
            isValid = false;
        }
        if (email == '') {
            isValid = false;
        }
        if (mobile == '') {
            isValid = false;
        }
        if (password == '') {
            isValid = false;
        }
        if (confirmPassword == '') {
            isValid = false;
        }
        if (confirmPassword !== password) {
            isValid = false;
        }
        return isValid;
    };
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                placeholder="Enter Name"
                style={[styles.input, { marginTop: 50 }]}
                value={name}
                onChangeText={txt => setName(txt)}
            />
            <TextInput
                placeholder="Enter Email"
                style={[styles.input, { marginTop: 20 }]}
                value={email}
                onChangeText={txt => setEmail(txt)}
            />
            <TextInput
                placeholder="Enter Mobile"
                keyboardType={'number-pad'}
                style={[styles.input, { marginTop: 20 }]}
                value={mobile}
                onChangeText={txt => setMobile(txt)}
            />
            <TextInput
                placeholder="Enter Password"
                style={[styles.input, { marginTop: 20 }]}
                value={password}
                onChangeText={txt => setPassword(txt)}
            />
            <TextInput
                placeholder="Enter Confirm Password"
                style={[styles.input, { marginTop: 20 }]}
                value={confirmPassword}
                onChangeText={txt => setConfirmPassword(txt)}
            />

            <View style={styles.radioMain}>
                <TouchableOpacity onPress={()=>{setSelectedRadio(1)}}>
                    <View style={styles.radioWrapper}>
                        <View style={styles.radioCircle}>
                            {selectedRadio === 1? <View style={styles.radioCircleBg}></View> : null}
                        </View>
                        <Text style={styles.radioText}>Tenant</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelectedRadio(2)}}>
                    <View style={styles.radioWrapper}>
                        <View style={styles.radioCircle}>
                            {selectedRadio === 2? <View style={styles.radioCircleBg}></View> : null}
                        </View>
                        <Text style={styles.radioText}>Security Guard</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 40 }}>
                <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={{ alignSelf: 'center' }}
                />
                <Text style={{ alignSelf: 'center' }}>I agree to the </Text>
                <Text style={{ alignSelf: 'center', color: 'blue' }}>Terms and Conditions</Text>
            </View>

            <TouchableOpacity
                disabled={!isSelected}
                style={styles.btn}
                onPress={() => {
                    if (validate()) {
                        registerUser();
                    } else {
                        Alert.alert('Please fill in all the credentials');
                    }
                }}>
                <Text style={styles.btnText}>Sign up</Text>
            </TouchableOpacity>
            <Text
                style={styles.orLogin}
                onPress={() => {
                    navigation.goBack();
                }}>
                Or Login
            </Text>
        </ScrollView>
    );
};

export default Signup;
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
        backgroundColor: 'black',
    },
    btnText: {
        color: 'white',
        fontSize: 20,
    },
    orLogin: {
        alignSelf: 'center',
        marginTop:10,
        fontSize: 20,
        textDecorationLine: 'underline',
        fontWeight: '600',
        color: 'black',
    },
    radioMain:{
        flex:1,
        alignItems:'flex-start',
        justifyContent:'center',
        marginTop: 10,
        marginLeft: 20

    },
    radioText:{
        fontSize:20
    },
    radioCircle:{
        height:15,
        width:15,
        borderRadius:8,
        borderColor: "black",
        borderWidth:2,
        marginTop:5
    },
    radioWrapper:{
        flexDirection:'row',
        gap: 5
    },
    radioCircleBg:{
        backgroundColor:'black',
        height: 7,
        width: 7,
        borderRadius: 4,
        margin: 2
    }
});
