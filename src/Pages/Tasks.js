import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select } from 'antd';
import { SaveOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { getTasksForUser, deleteTask, updateTaskStatus, createTask } from '../Services/taskService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [updatedStatusMap, setUpdatedStatusMap] = useState({});
  const [editTaskForm] = Form.useForm();

  const { Option } = Select;

  const fetchTasks = async () => {
    try {
      const userTasks = await getTasksForUser();
      setTasks(userTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleNewTask = async (values) => {
    try {
      await createTask(values.title, values.description);
      setNewTaskModalVisible(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating new task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      fetchTasks();
      clearUpdatedStatus(taskId); // Clear updated status after successful update
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const clearUpdatedStatus = (taskId) => {
    setUpdatedStatusMap((prevMap) => {
      const updatedMap = { ...prevMap };
      delete updatedMap[taskId];
      return updatedMap;
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text, record) => {
      const longestOption = Math.max("TODO".length, "IN_PROGRESS".length, "DONE".length);
      const selectWidth = `${longestOption * 2}ch`;
      return (
        <Select
          defaultValue={record.status}
          style={{ width: selectWidth }}
          onChange={(value) => setUpdatedStatusMap({ ...updatedStatusMap, [record._id]: value })}
        >
          <Option value="TODO">TODO</Option>
          <Option value="IN_PROGRESS">IN_PROGRESS</Option>
          <Option value="DONE">DONE</Option>
        </Select>
      );
    }},
    { title: 'Actions', key: 'actions', render: (text, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setSelectedTask(record)} />
          <Button
          icon={<SaveOutlined />}
          disabled={updatedStatusMap[record._id] === undefined || updatedStatusMap[record._id] === record.status}
          onClick={() => handleUpdateTaskStatus(record._id, updatedStatusMap[record._id])}
          />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ margin: '2em', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
        <h2>Tasks</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewTaskModalVisible(true)}>New Task</Button>
      </div>
      <Table
        dataSource={tasks}
        columns={columns}
        loading={loading}
        rowKey="_id"
        style={{ width: '100%' }}
      />
      <Modal
        title="New Task"
        visible={newTaskModalVisible}
        onOk={() => editTaskForm.submit()}
        onCancel={() => {
          setNewTaskModalVisible(false);
          editTaskForm.resetFields();
        }}
      >
        <Form form={editTaskForm} onFinish={handleNewTask}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Task Details"
        visible={selectedTask !== null}
        onCancel={() => setSelectedTask(null)}
        footer={null}
      >
        {selectedTask && (
          <div>
            <p><strong>Title:</strong> {selectedTask.title}</p>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Status:</strong> {selectedTask.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tasks;