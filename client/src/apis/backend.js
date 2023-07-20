import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_SERVER_HOST + process.env.REACT_APP_SERVER_API_PATH
});

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_SERVER_HOST + process.env.REACT_APP_SERVER_API_PATH,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});