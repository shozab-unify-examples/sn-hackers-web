import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { getConfig } from './config'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user')),
    loggedIn: !!localStorage.getItem('loggedIn')
  },
  mutations: {
    loginSuccess(state, user) {
      state.user = user
      state.loggedIn = true
    },
    loginFailure(state) {
      state.user = null
      state.loggedIn = false
    },
    logout(state) {
      state.user = null
      state.loggedIn = false
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const { authUrl } = getConfig()
        const response = await axios.post(`${authUrl}/login`, {
          username,
          password
        })

        const { user, token } = response.data
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('loggedIn', 'true')
        commit('loginSuccess', user)
        router.push('/')
        window.location.reload(false)
      } catch (error) {
        console.error('Login failed:', error)
        commit('loginFailure')
      }
    },
    logout({ commit }) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('loggedIn')
      commit('logout')
      router.push('/')
      window.location.reload(false)
    }
  }
})
