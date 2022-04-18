import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    tokenExp: localStorage.getItem('tokenExp') || '',
    user: {},
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, token, user) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
    },
  },
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        const path = 'http://dc-pg-dev:3000/login';
        axios.post(path, payload)
          .then((res) => {
            const message = res.data.message;
            const token = res.data.token;
            const login = res.data.login;
            const tokenExpiraiton = res.data.tokenExp;
            // eslint-disable-next-line
            const userGroups = res.data.userGroups;
            localStorage.setItem('token', token);
            localStorage.setItem('login', login);
            localStorage.setItem('tokenExp', tokenExpiraiton);
            commit('auth_success', token, message);
            resolve(res);
            // eslint-disable-next-line
            console.log(res);
            return userGroups;
          })
          .catch((err) => {
            commit('auth_error');
            // eslint-disable-next-line
            console.error(err);
            localStorage.removeItem('token');
            reject(err);
          });
      });
    },
    logout({ commit }) {
      // eslint-disable-next-line
      return new Promise((resolve, reject) => {
        commit('logout');
        localStorage.removeItem('token');
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
});
