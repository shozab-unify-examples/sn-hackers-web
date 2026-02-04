<template>
  <div class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-6">
          <div class="box">
            <h1 class="title is-2">Login</h1>
            <hr class="hr">
            <div v-if="error" class="notification is-warning">
              <p><strong>Auth Service Currently Unavailable</strong></p>
              <p>{{ error }}</p>
              <button class="button is-warning mt-4" @click="retryFetch">Retry</button>
            </div>
            <form v-else class="form" @submit="handleLogin({username, password})" @submit.prevent>
              <div class="field">
                <label for="username" class="label">Username</label>
                <div class="control">
                  <input v-model="username" type="text" id="username" name="username" class="input" required>
                </div>
              </div>
              <div class="field">
                <label for="password" class="label">Password</label>
                <div class="control">
                  <input v-model="password" type="password" id="password" name="password" class="input" required>
                </div>
              </div>
              <div class="field">
                <button class="button is-dark" :disabled="loading">
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>
              <div v-if="loginError" class="notification is-danger">
                {{ loginError }}
              </div>
              <div v-if="loadingUsers" class="has-text-centered">
                <small>Loading available users...</small>
              </div>
              <template v-else>
                <p v-for="user in users" :key="user.username">
                  <a><small @click="fillCredentials(user)">{{ user.username }}/{{ user.password }}</small></a>
                </p>
              </template>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import { getConfig } from '../config'

export default {
  data () {
    return {
      username: '',
      password: '',
      users: [],
      loading: false,
      loadingUsers: false,
      error: null,
      loginError: null
    }
  },
  methods: {
    fillCredentials (user) {
      this.username = user.username
      this.password = user.password
    },
    async fetchUsers() {
      this.loadingUsers = true
      this.error = null
      try {
        const { authUrl } = getConfig()
        const response = await axios.get(`${authUrl}/users`)
        this.users = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
        this.error = 'Unable to connect to the authentication service. Please try again later.'
      } finally {
        this.loadingUsers = false
      }
    },
    async handleLogin(credentials) {
      this.loading = true
      this.loginError = null
      try {
        await this.login(credentials)
      } catch (error) {
        this.loginError = 'Login failed. Please check your credentials.'
      } finally {
        this.loading = false
      }
    },
    async retryFetch() {
      this.error = null
      await this.fetchUsers()
    },
    ...mapActions([
      'login'
    ])
  },
  async created () {
    await this.fetchUsers()
  }
}
</script>
<style scoped>
.notification {
  margin-top: 1rem;
}
a small {
  cursor: pointer;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
