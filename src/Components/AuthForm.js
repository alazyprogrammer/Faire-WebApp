import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signUpUserWithEmailAndPassword, signInUserWithEmailAndPassword, sendUserPasswordResetEmail } from '../Firebase/auth';
import { Link } from 'react-router-dom';
import { getUserByEmail } from '../Services/userService';

const { Title, Paragraph } = Typography;

const validatePassword = (_, value) => {
  const errors = [];
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (value.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (!/[a-z]/.test(value)) {
    errors.push('Password must contain at least 1 lowercase letter.');
  }
  if (!/[A-Z]/.test(value)) {
    errors.push('Password must contain at least 1 uppercase letter.');
  }
  if (!/\d/.test(value)) {
    errors.push('Password must contain at least 1 digit.');
  }
  if (!/[@$!%*?&]/.test(value)) {
    errors.push('Password must contain at least one special character.');
  }
  if (!regex.test(value)) {
    return Promise.reject(errors);
  }
  if (errors.length > 0) {
    return Promise.reject(errors);
  }
  return Promise.resolve();
};

const AuthForm = ({ isSignUp }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    const { email, password } = values;
    try {
      if (isSignUp) {
        await signUpUserWithEmailAndPassword(email, password);
      } else {
        await signInUserWithEmailAndPassword(email, password);
      }
    } catch (error) {
      if (error.response && error.response.data && Array.isArray(error.response.data)) {
        setError(
          <ul>
            {error.response.data.map((errorMessage) => (
              <li key={errorMessage}>{errorMessage}</li>
            ))}
          </ul>
        );
      } else {
        setError('Authentication failed. Please check your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

// Handle forgot password action
const handleForgotPassword = async (email) => {
  try {
    // Validate email format
    await form.validateFields(['email']);
    const email = form.getFieldValue('email');
    
    // Check if email exists in Firebase
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Email address not found. Please sign up.');
    }
    
    // If email exists, send password reset email
    await sendUserPasswordResetEmail(email);
    
    // Show success message
    message.success('Password reset email sent. Please check your inbox.');
  } catch (error) {
    // If validation fails or email sending fails, show error message
    message.error(error.message);
  }
};

  return (
    <Card style={{ width: 300, margin: 'auto', marginTop: '100px' }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={2}>{isSignUp ? 'Sign Up' : 'Sign In'}</Title>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={isSignUp ? [ // Apply validator only if it's signup
            { required: true, message: 'Please enter your password' },
            { validator: validatePassword },
          ] : [{ required: true, message: 'Please enter your password' }]} // For signin
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        {isSignUp && (
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords do not match');
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>
        )}
        {!isSignUp && ( // Show forgot password link only on sign-in page
          <Form.Item>
            <Button type="link" onClick={() => handleForgotPassword(form.getFieldValue('email'))}>
              Forgot password?
            </Button>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>
      <Paragraph>
        {isSignUp ? 'Already have an account?' : 'New user?'}{' '}
        <Link to={isSignUp ? '/signin' : '/signup'}>{isSignUp ? 'Sign In' : 'Sign Up'}</Link>
      </Paragraph>
      {error && (
        <Paragraph type="danger">
          {error}
        </Paragraph>
      )}
    </Card>
  );
};

export default AuthForm;
