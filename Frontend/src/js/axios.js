import Axios from 'axios'

export default function getAxiosInstance(store, user) {
  let instance = Axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
    timeout: 5000,
  });
  // Deal with 401 unauthorized
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error && error.response && error.response.status === 401) {
        if (process.env.VUE_ENV === 'client') {
          store.commit('logout', false);
          store.commit('show_modal_login', true);
          return new Promise(() => {});
        }
      }
      return Promise.reject(error);
    }
  );
  // Always send the cookie. This needs to be set globally, else it won't work
  instance.defaults.withCredentials = true;

  if (user) {
    instance.defaults.headers.common['Cookie'] = 'jwt=' + user.jwt;
  }

  return instance;
}