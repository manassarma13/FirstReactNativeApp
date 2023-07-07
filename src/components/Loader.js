import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from 'react-native';

const Loader = ({ visible }) => {
    return (
        <Modal visible={visible} transparent>
            <View style={styles.modalView}>
                <View style={styles.mainView}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </View>
        </Modal>
    );
};

export default Loader;

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    mainView: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
