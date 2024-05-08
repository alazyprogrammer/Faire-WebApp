import React, { useState, useEffect } from 'react';
import { useAuth } from '../Components/Contexts/AuthContext';
import { message, Avatar, Card, Tooltip, Typography, Modal, Button } from 'antd';
import { UserOutlined, CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getTasksForUser } from '../Services/taskService';
import { sendVerificationEmail, updateUserProfilePicture } from '../Firebase/auth';

const { Text } = Typography;

const Profile = () => {
  const { user } = useAuth();
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState(0);
  const [joinDate, setJoinDate] = useState('');
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasksForUser(user.uid);
        setTotalTasks(tasks.length);
        setCompletedTasks(tasks.filter(task => task.status === 'DONE').length);
        setInProgressTasks(tasks.filter(task => task.status === 'IN_PROGRESS').length);
        setUpcomingTasks(tasks.filter(task => task.status === 'TODO').length);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const formattedJoinDate = new Date(user.metadata.creationTime).toLocaleDateString();
    setJoinDate(formattedJoinDate);

    fetchTasks();
  }, [user.uid, user.metadata.creationTime]);

  const resendVerificationEmail = (email) => {
    sendVerificationEmail(email)
      .then(() => {
        message.success('Verification email sent.');
      })
      .catch((error) => {
        console.error('Error sending verification email:', error);
        message.error('Failed to send verification email. Please try again.');
      });
  };

  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePicFile) {
      message.error('Please select a profile picture.');
      return;
    }

    try {
      await updateUserProfilePicture(profilePicFile, user);
      message.success('Profile picture updated successfully');
      setShowProfilePicModal(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      message.error('Failed to update profile picture. Please try again.');
    }
  };

  return (
    <Card
      title="Profile"
      style={{ width: '100%', margin: '1em' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Tooltip title="Change Profile Picture">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={user.photoURL}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowProfilePicModal(true)}
          />
        </Tooltip>
        <div style={{ marginTop: '10px' }}>
          <Text strong>{user.displayName ? user.displayName : (user.email ? user.email.split('@')[0] : "Display name")}</Text>
          {user.emailVerified ? (
            <Tooltip title="Email verified">
              <CheckCircleOutlined style={{ marginLeft: '5px', color: '#52c41a' }} />
            </Tooltip>
          ) : (
            <Tooltip title="Email not verified">
              <QuestionCircleOutlined
                style={{ marginLeft: '5px', color: '#faad14', cursor: 'pointer' }}
                onClick={() => resendVerificationEmail(user.email)}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {joinDate}</p>
        <p><strong>Total Tasks:</strong> {totalTasks}</p>
        <p><strong>Completed Tasks:</strong> {completedTasks}</p>
        <p><strong>In Progress Tasks:</strong> {inProgressTasks}</p>
        <p><strong>Upcoming Tasks:</strong> {upcomingTasks}</p>
      </div>
      <Modal
        title="Change Profile Picture"
        visible={showProfilePicModal}
        onCancel={() => setShowProfilePicModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowProfilePicModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateProfilePicture}>
            Update
          </Button>,
        ]}
      >
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
      </Modal>
    </Card>
  );
};

export default Profile;
