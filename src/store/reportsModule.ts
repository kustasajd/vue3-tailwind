import { reportService } from '../services'
import { licences } from './licencesModule'
import { zones } from './zonesModule'

const state = {
  clients: {},
  licences: {},
  zones: {}
}

const actions = {

  getClients ({ dispatch, commit }, {id}) {
    commit('getClientsRequest', { id })

    reportService.getClients(id).then(
      clients => commit('getClientsSuccess', clients),
      error => {
        commit('getClientsFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getLicences ({ dispatch, commit }, {id}) {
    commit('getLicencesRequest', { id })

    reportService.getLicences(id).then(
      licences => commit('getLicencesSuccess', licences),
      error => {
        commit('getLicencesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getZones ({ dispatch, commit }, {id}) {
    commit('getZonesRequest', { id })

    reportService.getZones(id).then(
      zones => commit('getZonesSuccess', zones),
      error => {
        commit('getZonesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {
  getClientsRequest (state) {
    state.clients = { loading: true }
  },
  getClientsSuccess (state, clients) {
    state.clients = { clients: clients }
  },
  getClientsFailure (state, error) {
    state.clients = { error }
  },

  getLicencesRequest (state) {
    state.licences = { loading: true }
  },
  getLicencesSuccess (state, licences) {
    state.licences = { licences: licences }
  },
  getLicencesFailure (state, error) {
    state.licences = { error }
  },

  getZonesRequest (state) {
    state.zones = { loading: true }
  },
  getZonesSuccess (state, zones) {
    state.zones = { zones: zones }
  },
  getZonesFailure (state, error) {
    state.zones = { error }
  },
}

export const reports = {
  namespaced: true,
  state,
  actions,
  mutations
}
