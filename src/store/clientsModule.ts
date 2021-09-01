import { clientService } from '../services'

const state = {
  all: {},
  client: {},
  allClientGroupTypes: {},
  clientGroups: {},
  clientUsers: {},
  siteClients: {},
}

const actions = {

  //client
  getAll ({ dispatch, commit }, {id}) {
    commit('getAllRequest', { id })

    clientService.getAll(id).then(
      clients => commit('getAllSuccess', clients),
      error => {
        commit('getAllFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    clientService.getById(id).then(
      client => {
        commit('getByIdSuccess', client)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  create ({ dispatch, commit }, client) {
    commit('createRequest', { client })

    clientService.create(client).then(
      client => {
        commit('createSuccess', client)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  update ({ dispatch, commit }, client) {
    commit('updateRequest', { client })

    clientService.update(client).then(
      client => {
        commit('updateSuccess', client)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  //client group types
  getAllClientGroupTypes ({ dispatch, commit }) {
    commit('getAllClientGroupTypesRequest')

    clientService.getAllClientGroupTypes().then(
      allClientGroupTypes => commit('getAllClientGroupTypesSuccess', allClientGroupTypes),
      error => {
        commit('getAllClientGroupTypesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  //client users
  getGroupById ({ dispatch, commit }, {id}) {
    commit('getGroupByIdRequest', { id })

    clientService.getGroupById(id).then(
      clientGroup => {
        commit('getGroupByIdSuccess', clientGroup)
      },
      error => {
        commit('getGroupByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  createClientGroup ({ dispatch, commit }, clientGroup) {
    commit('createClientGroupRequest', { clientGroup })

    clientService.createClientGroup(clientGroup).then(
      clientGroup => {
        commit('createClientGroupSuccess', clientGroup)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createClientGroupFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  deleteClientGroup ({ dispatch, commit }, clientGroup) {
    commit('deleteClientGroupRequest', { clientGroup })

    clientService.deleteClientGroup(clientGroup).then(
      clientGroup => {
        commit('deleteClientGroupSuccess', clientGroup)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteClientGroupFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  // client users
  createClientUser ({ dispatch, commit }, clientUser) {
    commit('createClientUserRequest', { clientUser })

    clientService.createClientUser(clientUser).then(
      clientUser => {
        commit('createClientUserSuccess', clientUser)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createClientUserFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  deleteClientUser ({ dispatch, commit }, clientUser) {
    commit('deleteClientUserRequest', { clientUser })

    clientService.deleteClientUser(clientUser).then(
      clientUser => {
        commit('deleteClientUserSuccess', clientUser)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteClientUserFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getUserById ({ dispatch, commit }, {id}) {
    commit('getUserByIdRequest', { id })

    clientService.getUserById(id).then(
      clientUser => {
        commit('getUserByIdSuccess', clientUser)
      },
      error => {
        commit('getUserByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  //site clients
  getSiteClients ({ dispatch, commit }, {id}) {
    commit('getSiteClientsRequest', { id })

    clientService.getSiteClients(id).then(
      siteClients => {
        commit('getSiteClientsSuccess', siteClients)
      },
      error => {
        commit('getSiteClientsFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {
  //client
  getAllRequest (state) {
    state.all = { loading: true }
  },
  getAllSuccess (state, clients) {
    state.all = { items: clients }
  },
  getAllFailure (state, error) {
    state.all = { error }
  },

  getByIdRequest (state) {
    state.client = { loading: true }
  },
  getByIdSuccess (state, client) {
    state.client = { client: client }
  },
  getByIdFailure (state, error) {
    state.client = { error }
  },

  createRequest (state) {
    state.client = { loading: true }
  },
  createSuccess (state, client) {
    state.client = {client : client}
  },
  createFailure (state, error) {
    state.client = { error }
  },

  updateRequest (state) {
    state.client = { loading: true }
  },
  updateSuccess (state, client) {
    state.client = { client: client }
  },
  updateFailure (state, error) {
    state.client = { error }
  },

  //client group types
  getAllClientGroupTypesRequest (state) {
    state.allClientGroupTypes = { loading: true }
  },
  getAllClientGroupTypesSuccess (state, allClientGroupTypes) {
    state.allClientGroupTypes = { allClientGroupTypes: allClientGroupTypes }
  },
  getAllClientGroupTypesFailure (state, error) {
    state.allClientGroupTypes = { error }
  },

  //client groups
  getGroupByIdRequest (state) {
    state.clientGroups = { loading: true }
  },
  getGroupByIdSuccess (state, clientGroups) {
    state.clientGroups = { clientGroups: clientGroups }
  },
  getGroupByIdFailure (state, error) {
    state.clientGroups = { error }
  },

  createClientGroupRequest (state) {
  },
  createClientGroupSuccess (state, clientGroup) {
    if (!state.clientGroups.clientGroups) state.clientGroups.clientGroups = []
    state.clientGroups.clientGroups.push(clientGroup.clientGroup)
  },
  createClientGroupFailure (state, error) {
    state.clientGroups = { error }
  },

  deleteClientGroupRequest (state) {
  },
  deleteClientGroupSuccess (state, clientGroup) {
    const index = state.clientGroups.clientGroups.indexOf(clientGroup.clientGroup);
    state.clientGroups.clientGroups.splice(index, 1);
  },
  deleteClientGroupFailure (state, error) {
    state.clientGroups = { error }
  },

  //client users
  createClientUserRequest (state) {
    state.clientUser = { loading: true }
  },
  createClientUserSuccess (state, clientUser) {
    state.clientUser = { clientUser: clientUser }
  },
  createClientUserFailure (state, error) {
    state.clientUser = { error }
  },

  deleteClientUserRequest (state) {
  },
  deleteClientUserSuccess (state, clientUser) {
    const index = state.clientUsers.clientUsers.indexOf(clientUser.clientUser);
    state.clientUsers.clientUsers.splice(index, 1);
  },
  deleteClientUserFailure (state, error) {
    state.clientUsers = { error }
  },

  getUserByIdRequest (state) {
    state.clientUsers = { loading: true }
  },
  getUserByIdSuccess (state, clientUsers) {
    state.clientUsers = { clientUsers: clientUsers }
  },
  getUserByIdFailure (state, error) {
    state.clientUsers = { error }
  },

  //site clients
  getSiteClientsRequest (state) {
    state.siteClients = { loading: true }
  },
  getSiteClientsSuccess (state, siteClients) {
    state.siteClients = { siteClients: siteClients }
  },
  getSiteClientsFailure (state, error) {
    state.siteClients = { error }
  },

}

export const clients = {
  namespaced: true,
  state,
  actions,
  mutations
}
