import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

const UserMain = () => {
	const [randomNumber, setRandomNumber] = useState(null);
	const [showShareButton, setShowShareButton] = useState(false);
	const [selectedApartmentState, setSelectedApartmentState] = useState('');
	const [selectedFlat, setSelectedFlat] = useState('');
	const [incomingGuestData, setIncomingGuestData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [shouldWait, setShouldWait] = useState(true);

	const generateRandomNumber = () => {
		const randomNum = Math.floor(100000 + Math.random() * 900000);
		setRandomNumber(randomNum);
		setShowShareButton(true);
	};
	

	const shareNumber = () => {
		const message = `Your secured generated code from XYZ app is: ${randomNumber}`; // Modify the message
		Share.share({
			message: message,
		})
			.then(() => {
				firestore()
					.collection('Codes')
					.add({ code: randomNumber, selectedApartment: selectedApartmentState })
					.then(() => {
						console.log('Random number sent to Firebase successfully!');
					})
					.catch((error) => {
						console.error('Error sending random number to Firebase:', error);
					});
			})
			.catch((error) => console.error('Error sharing:', error));
	};

	console.log(selectedFlat,selectedApartmentState)

	useEffect(() => {
		const getSelectedApartment = async () => {
			try {
				const selectedApartmentL = await AsyncStorage.getItem('SELECTEDAPARTMENT');
				const selectedFlat = await AsyncStorage.getItem('FLATID') || "";

				if (selectedApartmentL !== null) {
					setSelectedApartmentState(selectedApartmentL,);
					if(selectedFlat){
						setSelectedFlat(selectedFlat);
					}
				} else {
					console.log('Selected Apartment not found in AsyncStorage.');
				}
			} catch (error) {
				console.error('Error retrieving selected apartment:', error);
			}
		};

		getSelectedApartment();
	}, []);

	const handleUserResponse = async (response) => {
		try {
			const selectedApartmentL = await AsyncStorage.getItem('SELECTEDAPARTMENT');
			const selectedFlat = await AsyncStorage.getItem('FLATID') || '';
			console.log('User response:', response);

			// Create a new collection named 'result' with the response, name, and timestamp
			const db = firestore();
			const resultCollectionRef = db.collection('result');
			const timestamp = firestore.FieldValue.serverTimestamp(); // Get server timestamp

			await resultCollectionRef.doc(incomingGuestData.guestName).set({
				name: incomingGuestData.guestName,
				response: response === 'accept' ? 'Accepted' : 'Denied',
				timestamp: timestamp,
				apartmentName: selectedApartmentL
			});

			console.log('Added response, name, and timestamp to the "result" collection');

			// Remove the 'formData' field from the document
			const querySnapshot = await db
				.collection('users')
				.where('flatID', '==', selectedFlat)
				.where('selectedApartment', '==', selectedApartmentL)
				.get();

			if (!querySnapshot.empty) {
				const documentRef = querySnapshot.docs[0].ref;
				await documentRef.update({
					formData: firestore.FieldValue.delete(),
				});

				console.log('Removed formData from the Firestore document');
				setIncomingGuestData(null);
			}
		} catch (error) {
			console.error('Error handling user response:', error.message);
		}
	};

	console.log(incomingGuestData);
	const fetchIncomingGuestData = async () => {
		try {
			const guestDataSnapshot = await firestore().collection('users')
				.where('flatID', '==', selectedFlat)
				.where('selectedApartment', '==', selectedApartmentState)
				.get();

			if (!guestDataSnapshot.empty) {
				const myDataDoc = guestDataSnapshot.docs[0];
				const myData = myDataDoc.data();
				const guestData = myData.formData || {};

				setIncomingGuestData(guestData);
			}

			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching incoming guest data:', error);
		}
	};

	useEffect(() => {
		// Wait for 2 seconds before fetching data
		const delay = setTimeout(() => {
			setShouldWait(false);
		}, 2000);

		// Cleanup the timeout to avoid memory leaks
		return () => clearTimeout(delay);
	}, []);

	useEffect(() => {
		if (!shouldWait) {
			fetchIncomingGuestData();
		}
	}, [shouldWait]);

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={generateRandomNumber}>
				<Text style={styles.buttonText}>Generate OTP</Text>
			</TouchableOpacity>

			{randomNumber && (
				<View style={styles.numberContainer}>
					<Text style={styles.numberText}>{randomNumber}</Text>
				</View>
			)}

			{showShareButton && (
				<TouchableOpacity style={styles.shareButton} onPress={shareNumber}>
					<Text style={styles.shareButtonText}>Share</Text>
				</TouchableOpacity>
			)}
			{shouldWait ? (
				<Text>Loading...</Text>
			) : (incomingGuestData && Object.keys(incomingGuestData).length > 0 && (
				<View style={styles.incomingGuestContainer}>
					<Text style={styles.incomingGuestText}>Incoming Guest:</Text>
					<Text>Name: {incomingGuestData.guestName}</Text>
					<Text>Phone: {incomingGuestData.guestPhone}</Text>
					<Text>Purpose: {incomingGuestData.guestPurpose}</Text>

					<View style={styles.responseButtons}>
						<TouchableOpacity style={[styles.responseButton, styles.acceptButton]} onPress={() => handleUserResponse('accept')}>
							<Text style={styles.responseButtonText}>Accept</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.responseButton, styles.denyButton]} onPress={() => handleUserResponse('deny')}>
							<Text style={styles.responseButtonText}>Deny</Text>
						</TouchableOpacity>
					</View>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		backgroundColor: 'blue',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
	},
	numberContainer: {
		marginVertical: 10,
	},
	numberText: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	shareButton: {
		backgroundColor: 'green',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
	},
	shareButtonText: {
		color: 'white',
		fontSize: 16,
	},
	incomingGuestContainer: {
		backgroundColor: 'lightgray',
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
		width: '90%',
	},
	incomingGuestText: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	guestInfoText: {
		fontSize: 16,
		marginBottom: 5,
	},
	responseButtons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 10,
	},
	responseButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
		width: '40%',
		alignItems: 'center',
	},
	acceptButton: {
		backgroundColor: 'green',
	},
	denyButton: {
		backgroundColor: 'red',
	},
	responseButtonText: {
		color: 'white',
		fontSize: 16,
	},
});

export default UserMain;

