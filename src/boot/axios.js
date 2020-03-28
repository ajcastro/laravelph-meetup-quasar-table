import axios from 'axios';
import { token } from 'src/services/Token';

export default async ({ Vue }) => {
  axios.defaults.headers = {};
  axios.defaults.headers['Content-type'] = 'application/json';
  axios.defaults.headers.Accept = 'application/json';
  axios.defaults.baseURL = process.env.API_URL;
  if (token.get()) {
    axios.defaults.headers.Authorization = `Bearer ${token.get()}`;
  }

  Vue.prototype.$axios = axios;
};
