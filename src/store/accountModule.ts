import { userService } from '../services'
import router from '../router'

const user = JSON.parse(localStorage.getItem('user'))
const state = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null }

const actions = {
  login ({ dispatch, commit }, { email, password }) {
    commit('loginRequest', { email })

    userService.login(email, password).then(
      user => {
        commit('loginSuccess', user)
        dispatch('alert/success', 'Login successful', { root: true })
        router.push('/site-select')
      },
      error => {
        commit('loginFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  logout ({ dispatch, commit }) {
    userService.logout()
    commit('logout')
  },
}

const mutations = {
  loginRequest (state, user) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess (state, user) {
    state.status = { loggedIn: true }
    state.user = user
  },
  loginFailure (state) {
    state.status = {}
    state.user = null
  },
  logout (state) {
    state.status = {}
    state.user = null
  },
}

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
}
