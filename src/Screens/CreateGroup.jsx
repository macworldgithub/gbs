import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

export default function CreateGroup() {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    // TODO: handle group creation logic here
    alert(`Group "${groupName}" created!`);
    navigation.goBack(); // go back to chat list
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>New Group</Text>

        {/* Group Name */}
        <View style={styles.inputRow}>
          <FontAwesome name="camera" size={20} color="#f43f5e" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Group name"
            value={groupName}
            onChangeText={setGroupName}
            style={styles.input}
          />
        </View>

        {/* Add Members */}
        <TouchableOpacity style={styles.inputRow}>
          <FontAwesome name="user-plus" size={20} color="#f43f5e" style={{ marginRight: 10 }} />
          <Text style={{ color: '#444' }}>Add members</Text>
        </TouchableOpacity>

        {/* Create Button */}
        <TouchableOpacity style={styles.createBtn} onPress={handleCreateGroup}>
          <Text style={styles.createBtnText}>Create Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
  },
  createBtn: {
    backgroundColor: '#f43f5e',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  createBtnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
