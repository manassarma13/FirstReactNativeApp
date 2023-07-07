import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Main = () => {
	const [randomNumber, setRandomNumber] = useState(null);
	const [showShareButton, setShowShareButton] = useState(false);

	const generateRandomNumber = () => {
		const randomNum = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
		setRandomNumber(randomNum);
		setShowShareButton(true);
	};

	const shareNumber = () => {
		// Implement your share functionality here
		console.log('Sharing number:', randomNumber);
	};

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
});

export default Main;
