
// store/index.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        isLoggedIn: false,
        username: '',
    },
    mutations: {
        SET_LOGIN(state, { isLoggedIn, username }) {
            state.isLoggedIn = isLoggedIn;
            state.username = username;
        },
        setLoginState(state, payload) {
            state.isLoggedIn = payload.isLoggedIn;
            state.username = payload.username || '';
        },
    },
    actions: {
        login({ commit }, user) {
            // 这里可以进行异步请求，完成登录逻辑
            commit('setLoginState', { isLoggedIn: true, username: user.username });
        },
        logout({ commit }) {
            commit('setLoginState', { isLoggedIn: false, username: '' });
        },
    },
    getters: {
        isLoggedIn: (state) => state.isLoggedIn,
        username: (state) => state.username,
    },
});
export default store;