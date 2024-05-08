import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Row, Col } from 'antd';
import { SaveOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getTasksForUser, deleteTask, updateTaskStatus, createTask } from '../Services/taskService';

const { Option } = Select;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [updatedStatusMap, setUpdatedStatusMap] = useState({});
  const [editTaskForm] = Form.useForm();
  const [searchValue, setSearchValue] = useState(''); // State for search value
  const [filterValue, setFilterValue] = useState('All'); // State for filter value

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

  // Columns definition
  const columns = [
    { 
      title: 'Title', 
      dataIndex: 'title', 
      key: 'title', 
      render: (text, record) => (
        <div>
          <p>{record.title}</p>
          <Space>
            <Button
              icon={<SaveOutlined />}
              disabled={updatedStatusMap[record._id] === undefined || updatedStatusMap[record._id] === record.status}
              onClick={() => handleUpdateTaskStatus(record._id, updatedStatusMap[record._id])}
            />
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger />
          </Space>
        </div>
      ),
      width: 200
    },
    { 
      title: 'Description', 
      dataIndex: 'description', 
      key: 'description', 
      width: 300 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      width: 150,
      render: (text, record) => {
        return (
          <Select
            defaultValue={record.status}
            onChange={(value) => handleUpdateTaskStatus(record._id, value)} // Update status directly from the dropdown
          >
            <Option value="TODO">TODO</Option>
            <Option value="IN_PROGRESS">IN_PROGRESS</Option>
            <Option value="DONE">DONE</Option>
          </Select>
        );
      }
    },
  ];

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
      clearUpdatedStatus(taskId);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleReset = () => {
    setSearchValue(''); // Reset search value
    setFilterValue('All'); // Reset filter value
  };

  const filteredTasks = tasks.filter((task) => {
    // Filter tasks based on search value and filter value
    const searchCondition = task.title.toLowerCase().includes(searchValue.toLowerCase());
    const filterCondition = filterValue === 'All' ? true : task.status === filterValue;
    return searchCondition && filterCondition;
  });

  return (
    <div style={{ margin: '2em' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
        <h2>Tasks</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewTaskModalVisible(true)}>New Task</Button>
      </div>
      <div style={{ display: 'flex', marginBottom: '1em' }}>
        <Input.Search placeholder="Search tasks" style={{ width: '60%' }} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <Select defaultValue="All" style={{ width: '40%' }} onChange={(value) => setFilterValue(value)}>
          <Option value="All">All</Option>
          <Option value="TODO">TODO</Option>
          <Option value="IN_PROGRESS">IN_PROGRESS</Option>
          <Option value="DONE">DONE</Option>
        </Select>
        <Button onClick={handleReset}>Reset</Button> {/* Reset button */}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          dataSource={filteredTasks} // Use filtered tasks
          columns={columns}
          loading={loading}
          rowKey="_id"
        />
      </div>
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
