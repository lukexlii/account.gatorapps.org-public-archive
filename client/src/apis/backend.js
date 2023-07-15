import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_SERVER_HOST
});

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_SERVER_HOST,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});