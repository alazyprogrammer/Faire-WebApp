import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signUpUserWithEmailAndPassword, signInUserWithEmailAndPassword } from '../Firebase/auth';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

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
      setError('Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: 300, margin: 'auto', marginTop: '100px' }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={2}>{isSignUp ? 'Sign Up' : 'Sign In'}</Title>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
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
      {error && <Paragraph type="danger">{error}</Paragraph>}
    </Card>
  );
};

export default AuthForm;
