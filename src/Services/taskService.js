import axios from 'axios';
import { auth } from '../Firebase';

// API base URL
const BASE_URL = 'http://localhost:3000';

// Function to get the current user token
const getToken = () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return currentUser.getIdToken();
  } else {
    return Promise.reject(new Error('No user signed in.'));
  }
};

// Function to create task for the current user
export const createTask = async (title, description) => {
  try {
    const token = await getToken();
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : '';
    const response = await axios.post(`${BASE_URL}/tasks/create`, {
      userId,
      title,
      description,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Function to fetch tasks for the current user
export const getTasksForUser = async () => {
    try {
      const token = await getToken();
      const currentUser = auth.currentUser;
      const userId = currentUser ? currentUser.uid : '';
      const response = await axios.get(`${BASE_URL}/tasks/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
};

// Function to update task status by task ID
export const updateTaskStatus = async (taskId, taskStatus) => {
  try {
    console.log("taskId: ", taskId, " status: ", taskStatus);
    const token = await getToken();
    const response = await axios.put(`${BASE_URL}/tasks/status`, {
      taskId: taskId,
      status: taskStatus,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};


// Function to delete a task by ID
export const deleteTask = async (taskId) => {
    try {
      const token = await getToken();
      const response = await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
};
