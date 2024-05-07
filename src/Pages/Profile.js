import React, { useState } from 'react';
import { useAuth } from '../Components/Contexts/AuthContext';
import { Form, Input, Button, message, Avatar, Card, Space } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Logic to update user profile information
      // Example: await updateUserProfile(values);
      message.success('Profile updated successfully');
      setShowForm(false); // Hide the form after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Profile"
      extra={<Button icon={<EditOutlined />} onClick={() => setShowForm(true)}>Edit</Button>}
      style={{ width: 400, margin: 'auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Display profile picture */}
        <Avatar size={64} icon={<UserOutlined />} src={user.photoURL} />
      </div>
      <Form
        initialValues={{
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          // Add other fields as needed
        }}
        onFinish={onFinish}
        style={{ display: showForm ? 'block' : 'none' }}
      >
        <Form.Item label="Display Name" name="displayName">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input />
        </Form.Item>
        {/* Add other form fields as needed */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Profile
            </Button>
            <Button onClick={() => setShowForm(false)}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
      <div style={{ display: showForm ? 'none' : 'block' }}>
        {/* Display user details */}
        <p><strong>Display Name:</strong> {user.displayName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
        {/* Add other user details as needed */}
        {/* Display email verification status */}
        {user.emailVerified ? (
          <p>Email verified</p>
        ) : (
          <p>Email not verified. <a href="/#">Resend verification email</a></p>
        )}
      </div>
    </Card>
  );
};

export default Profile;
