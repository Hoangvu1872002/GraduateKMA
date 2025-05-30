import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho session
interface Session {
  sessionId: string;
  token: string;
}

// API URL
const API_BASE_URL = 'http://localhost:3000/api/auth';

const ProfileScreen = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const userId = '123'; // Giả sử bạn có userId của người dùng hiện tại

  // Lấy danh sách các thiết bị đang đăng nhập
  const fetchSessions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sessions`, {
        params: {userId},
      });
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      Alert.alert('Error', 'Could not fetch sessions. Please try again later.');
    }
  }, [userId]);

  // Xử lý đăng xuất thiết bị cụ thể
  const logoutDevice = useCallback(
    async (sessionId: string) => {
      try {
        await axios.post(`${API_BASE_URL}/logoutDevice`, {
          userId,
          sessionId,
        });

        Alert.alert('Success', 'Device has been logged out.');
        fetchSessions(); // Refresh danh sách sau khi đăng xuất
      } catch (error) {
        console.error('Failed to logout device:', error);
        Alert.alert('Error', 'Could not log out device. Please try again.');
      }
    },
    [userId, fetchSessions],
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const renderSessionItem = ({item}: {item: Session}) => (
    <View style={styles.sessionItem}>
      <Text style={styles.deviceText}>Device ID: {item.sessionId}</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert(
            'Confirm Logout',
            `Are you sure you want to logout this device?`,
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Logout',
                onPress: () => logoutDevice(item.sessionId),
              },
            ],
          )
        }>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logged-in Devices</Text>
      <FlatList
        data={sessions}
        keyExtractor={item => item.sessionId}
        renderItem={renderSessionItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No devices logged in.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  deviceText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default ProfileScreen;
