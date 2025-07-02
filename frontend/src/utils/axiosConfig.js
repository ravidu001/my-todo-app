import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://my-todo-app-backend-lfou.onrender.com/api', 
});

export default axiosInstance;