import { floorplanService } from '../services'

const state = {
  site: {},
  udpatedFloorplan: {}
}

const actions = {
  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    floorplanService.getById(id).then(
      site => {
        commit('getByIdSuccess', site)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  update ({ dispatch, commit }, site) {
    commit('updateRequest', { site })

    floorplanService.update(site).then(
      site => {
        commit('updateSuccess', site)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  updateSite ({ dispatch, commit }, site) {
    commit('updateSiteRequest', { site })

    floorplanService.updateSite(site).then(
      site => {
        commit('updateSiteSuccess', site)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('updateSiteFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  }
}

const mutations = {
  getByIdRequest (state) {
    state.site = { loading: true }
  },
  getByIdSuccess (state, site) {
    state.site = { site: site }
  },
  getByIdFailure (state, error) {
    state.site = { error }
  },

  updateRequest (state) {
    state.site = { loading: true }
  },
  updateSuccess (state, site) {
    state.site = { site: site }
  },
  updateFailure (state, error) {
    state.site = { error }
  },

  updateSiteRequest (state) {
    state.udpatedFloorplan = { loading: true }
  },
  updateSiteSuccess (state, udpatedFloorplan) {
    state.site.site.floorplanPolygons = udpatedFloorplan
  },
  updateSiteFailure (state, error) {
    state.udpatedFloorplan = { error }
  }
}

export const floorplans = {
  namespaced: true,
  state,
  actions,
  mutations
}
