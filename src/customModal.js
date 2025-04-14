import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const CustomModal = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure it's above all other content
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 5,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default CustomModal;
