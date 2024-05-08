import React, { useState, useEffect } from 'react';
import { Layout, Card } from 'antd';
import { getTasksForUser } from '../Services/taskService';

const { Content } = Layout;

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const userTasks = await getTasksForUser();
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Group tasks by status
  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] ? [...acc[task.status], task] : [task];
    return acc;
  }, {});

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <h1>Welcome to Faire!</h1>
        <div>
        <Card title="Past">
          {groupedTasks['DONE'] &&
            groupedTasks['DONE'].map((task) => (
              <div key={task._id} style={{ marginBottom: '8px' }}>
                <p style={{ color: 'black', margin: '0' }}>{task.title}</p>
              </div>
            ))}
        </Card>
        </div>
        <div>
          <Card title="Today">
            {groupedTasks['IN_PROGRESS'] &&
              groupedTasks['IN_PROGRESS'].map((task) => (
                <p key={task._id}>{task.title}</p>
              ))}
          </Card>
        </div>
        <div> 
          <Card title="Upcoming">
            {groupedTasks['TODO'] &&
              groupedTasks['TODO'].map((task) => (
                <p key={task._id}>{task.title}</p>
              ))}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
