import { permissionService } from '../services'

const state = {
  all: {},
  permission: {},
  userRolePermission: {}
}

const actions = {

  //permission
  getAll ({ dispatch, commit }) {
    commit('getAllRequest')

    permissionService.getAll().then(
      permissions => commit('getAllSuccess', permissions),
      error => {
        commit('getAllFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    permissionService.getById(id).then(
      permission => {
        commit('getByIdSuccess', permission)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  addUserRolePermission ({ dispatch, commit }, userRolePermission) {
    commit('addUserRolePermissionRequest', { userRolePermission })

    permissionService.addUserRolePermission(userRolePermission).then(
      userRolePermission => {
        commit('addUserRolePermissionSuccess', userRolePermission)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('addUserRolePermissionFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  deleteUserRolePermission ({ dispatch, commit }, { id }) {
    commit('deleteUserRolePermissionRequest', { id })

    permissionService.deleteUserRolePermission(id).then(
      userRolePermission => {
        commit('deleteUserRolePermissionSuccess', userRolePermission)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteUserRolePermissionFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {
  //permission
  getAllRequest (state) {
    state.all = { loading: true }
  },
  getAllSuccess (state, permissions) {
    state.all = { items: permissions }
  },
  getAllFailure (state, error) {
    state.all = { error }
  },

  getByIdRequest (state) {
    state.permission = { loading: true }
  },
  getByIdSuccess (state, permission) {
    state.permission = { permission: permission }
  },
  getByIdFailure (state, error) {
    state.permission = { error }
  },

  addUserRolePermissionRequest (state) {
    state.userRolePermission = { loading: true }
  },
  addUserRolePermissionSuccess (state, userRolePermission) {
    if (!state.permission.permission) {
      state.permission.permission.userRolePermissions = []
    }
    state.userRolePermission = { userRolePermission: userRolePermission }
    state.permission.permission.userRolePermissions.push(userRolePermission)
  },
  addUserRolePermissionFailure (state, error) {
    state.userRolePermission = { error }
  },

  deleteUserRolePermissionRequest (state) {
    state.userRolePermission = { loading: true }
  },
  deleteUserRolePermissionSuccess (state, userRolePermission) {
    state.userRolePermission = { userRolePermission: userRolePermission }
  },
  deleteUserRolePermissionFailure (state, error) {
    state.userRolePermission = { error }
  },

}

export const permissions = {
  namespaced: true,
  state,
  actions,
  mutations
}
