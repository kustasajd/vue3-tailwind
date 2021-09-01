import { userService } from '../services'

const state = {
  all: {},
  user: {},
  allUserRoleTypes: {},
  clientUserTypes: {},
  userDetail: {}
}

const actions = {
  getAll ({ dispatch, commit }, {id}) {
    commit('getAllRequest', { id })

    userService.getAll(id).then(
      users => commit('getAllSuccess', users),
      error => {
        commit('getAllFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    userService.getById(id).then(
      user => {
        commit('getByIdSuccess', user)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  update ({ dispatch, commit }, user) {
    commit('updateRequest', { user })

    userService.update(user).then(
      user => {
        commit('updateSuccess', user)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  //user role types
  getAllUserRoleTypes ({ dispatch, commit }) {
    commit('getAllUserRoleTypesRequest')

    userService.getAllUserRoleTypes().then(
      allUserRoleTypes => commit('getAllUserRoleTypesSuccess', allUserRoleTypes),
      error => {
        commit('getAllUserRoleTypesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  //client user types and create user
  getAllClientUserTypes ({ dispatch, commit }) {
    commit('getAllClientUserTypesRequest')

    userService.getAllClientUserTypes().then(  
      clientUserTypes => commit('getAllClientUserTypesSuccess', clientUserTypes),
      error => {
        commit('getAllClientUserTypesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  create ({ dispatch, commit }, user) {
    commit('createRequest', { user })

    userService.create(user).then(
      user => {
        commit('createSuccess', user)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getSites ({ dispatch, commit }, { userId }) {
    commit('getSitesRequest', { userId })

    userService.getSites(userId).then(
      userDetail => {
        commit('getSitesSuccess', userDetail)
      },
      error => {
        commit('getSitesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
}


const mutations = {
  getAllRequest (state) {
    state.all = { loading: true }
  },
  getAllSuccess (state, users) {
    state.all = { items: users }
  },
  getAllFailure (state, error) {
    state.all = { error }
  },

  getByIdRequest (state) {
    state.user = { loading: true }
  },
  getByIdSuccess (state, user) {
    state.user = { user: user }
  },
  getByIdFailure (state, error) {
    state.user = { error }
  },

  updateRequest (state) {
    state.user = { loading: true }
  },
  updateSuccess (state, user) {
    state.user = { user: user }
  },
  updateFailure (state, error) {
    state.user = { error }
  },

  //user role types
  getAllUserRoleTypesRequest (state) {
    state.allUserRoleTypes = { loading: true }
  },
  getAllUserRoleTypesSuccess (state, allUserRoleTypes) {
    state.allUserRoleTypes = { allUserRoleTypes: allUserRoleTypes }
  },
  getAllUserRoleTypesFailure (state, error) {
    state.allUserRoleTypes = { error }
  },

  //client user types and create user
  getAllClientUserTypesRequest (state) {
    state.clientUserTypes = { loading: true }
  },
  getAllClientUserTypesSuccess (state, clientUserTypes) {
    state.clientUserTypes = { clientUserTypes: clientUserTypes }
  },
  getAllClientUserTypesFailure (state, error) {
    state.clientUserTypes = { error }
  },
  createRequest (state) {
    state.user = { loading: true }
  },
  createSuccess (state, user) {
    state.user = { user: user }
  },
  createFailure (state, error) {
    state.user = { error }
  },
  getSitesRequest (state) {
    state.userDetail = { loading: true }
  },
  getSitesSuccess (state, userDetail) {
    state.userDetail = { userDetail: userDetail }
  },
  getSitesFailure (state, error) {
    state.userDetail = { error }
  },
}

export const users = {
  namespaced: true,
  state,
  actions,
  mutations
}
