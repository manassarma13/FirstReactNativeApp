import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Splash = () => {
	const navigation = useNavigation();
	useEffect(() => {
		const splashTimer = setTimeout(() => {
			checkLogin();
		}, 1000);
		return () => {
			clearTimeout(splashTimer);
		};
	}, []);
	const checkLogin = async () => {
		const id = await AsyncStorage.getItem('USERID');
		if (id !== null) {
			const uType = await AsyncStorage.getItem('USERTYPE');
			console.log(id, "UTYPE")
			if(uType === '1'){
				navigation.navigate('UserMain');
			} else {
				navigation.navigate('SecurityMain');
			}
			
		} else {
			navigation.navigate('Login');
		}
	};
	return (
		<View style={styles.container}>
			<Text style={styles.logo}>{'First React Native /n App Yo'}</Text>
		</View>
	);
};

export default Splash;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'purple',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		fontSize: 40,
		color: 'white',
		textAlign: 'center',
	},
});
