import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskAPI = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data.data || [];
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  toggleTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  deleteCompletedTasks: async () => {
    const response = await api.delete('/tasks');
    return response.data;
  },
};

export default api;