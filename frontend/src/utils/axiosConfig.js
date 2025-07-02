import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://my-todo-app-backend-lfou.onrender.com/api', 
});

// Clear auth data when switching to different backend
const currentBaseURL = localStorage.getItem('currentBaseURL');
if (currentBaseURL && currentBaseURL !== axiosInstance.defaults.baseURL) {
  // Base URL changed, clear auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axiosInstance.defaults.headers.common['Authorization'];
  console.log('Backend URL changed. Cleared authentication data.');
}
localStorage.setItem('currentBaseURL', axiosInstance.defaults.baseURL);

export default axiosInstance;