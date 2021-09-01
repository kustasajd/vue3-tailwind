import { zoneService } from '../services'

const state = {
  zones: {},
  zone: {},
  updatedZone: {},
  zoneTypes: {},
  siteZoneRate: {},
  licenceZone: {}
}

const actions = {

  //zone
  getZonesBySite ({ dispatch, commit }, {id}) {
    commit('getZonesBySiteRequest')

    zoneService.getZonesBySite(id).then(
      zones => commit('getZonesBySiteSuccess', zones),
      error => {
        commit('getZonesBySiteFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getById ({ dispatch, commit }, { siteZoneId }) {
    commit('getByIdRequest', { siteZoneId })

    zoneService.getById(siteZoneId).then(
      zone => {
        commit('getByIdSuccess', zone)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  create ({ dispatch, commit }, zone) {
    commit('createRequest', { zone })

    zoneService.create(zone).then(
      zone => {
        commit('createSuccess', zone)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  update ({ dispatch, commit }, zone) {
    commit('updateRequest', { zone })

    zoneService.update(zone).then(
      updatedZone => {
        commit('updateSuccess', updatedZone)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getZoneTypes ({ dispatch, commit }) {
    commit('getZoneTypesRequest')

    zoneService.getZoneTypes().then(
      zoneTypes => commit('getZoneTypesSuccess', zoneTypes),
      error => {
        commit('getZoneTypesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  createSiteZoneRate ({ dispatch, commit }, siteZoneRate) {
    commit('createSiteZoneRateRequest', { siteZoneRate })

    zoneService.createSiteZoneRate(siteZoneRate).then(
      siteZoneRate => {
        commit('createSiteZoneRateSuccess', siteZoneRate)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createSiteZoneRateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  deleteSiteZoneRate ({ dispatch, commit }, siteZoneRate) {
    commit('deleteSiteZoneRateRequest', { siteZoneRate })

    zoneService.deleteSiteZoneRate(siteZoneRate).then(
      siteZoneRate => {
        commit('deleteSiteZoneRateSuccess', siteZoneRate)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteSiteZoneRateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  createLicenceZone ({ dispatch, commit }, licenceZone) {
    commit('createLicenceZoneRequest', { licenceZone })

    zoneService.createLicenceZone(licenceZone).then(
      licenceZone => {
        commit('createLicenceZoneSuccess', licenceZone)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createLicenceZoneFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getLicenceZone ({ dispatch, commit }, { licenceZoneId }) {
    commit('getLicenceZoneRequest', { licenceZoneId })

    zoneService.getLicenceZone(licenceZoneId).then(
      licenceZone => {
        commit('getLicenceZoneSuccess', licenceZone)
      },
      error => {
        commit('getLicenceZoneFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  updateLicenceZone ({ dispatch, commit }, licenceZone) {
    commit('updateLicenceZoneRequest', { licenceZone })

    zoneService.updateLicenceZone(licenceZone).then(
      licenceZone => {
        commit('updateLicenceZoneSuccess', licenceZone)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateLicenceZoneFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  deleteLicenceZone ({ dispatch, commit }, { id }) {
    commit('deleteLicenceZoneRequest', { id })

    zoneService.deleteLicenceZone(id).then(
      licenceZone => {
        commit('deleteLicenceZoneSuccess', licenceZone)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteLicenceZoneFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
}

const mutations = {
  //zone
  getZonesBySiteRequest (state) {
    state.zones = { loading: true }
  },
  getZonesBySiteSuccess (state, zones) {
    state.zones = { zones: zones }
  },
  getZonesBySiteFailure (state, error) {
    state.zones = { error }
  },

  getByIdRequest (state) {
    state.zone = { loading: true }
  },
  getByIdSuccess (state, zone) {
    state.zone = { zone: zone }
  },
  getByIdFailure (state, error) {
    state.zone = { error }
  },

  createSiteZoneRateRequest (state) {
    state.siteZoneRate = { loading: true }
  },
  createSiteZoneRateSuccess (state, siteZoneRate) {
    state.zone.zone.siteZoneRates.push(siteZoneRate)
  },
  createSiteZoneRateFailure (state, error) {
    state.siteZoneRate = { error }
  },

  updateRequest (state) {
    state.updatedZone = { loading: true }
  },
  updateSuccess (state, updatedZone) {
    state.updatedZone = { updatedZone: updatedZone }
  },
  updateFailure (state, error) {
    state.updatedZone = { error }
  },

  getZoneTypesRequest (state) {
    state.zoneTypes = { loading: true }
  },
  getZoneTypesSuccess (state, zoneTypes) {
    state.zoneTypes = { zoneTypes: zoneTypes }
  },
  getZoneTypesFailure (state, error) {
    state.zoneTypes = { error }
  },

  createRequest (state) {
    state.zone = { loading: true }
  },
  createSuccess (state, zone) {
    state.zone = { zone: zone }
  },
  createFailure (state, error) {
    state.zone = { error }
  },

  deleteSiteZoneRateRequest (state) {
    state.siteZoneRate = { loading: true }
  },
  deleteSiteZoneRateSuccess (state, siteZoneRate) {
    state.zone.zone.siteZoneRates.forEach((element, index) => {
      if (element.siteZoneRateId === siteZoneRate.siteZoneRateId) {
        state.zone.zone.siteZoneRates.splice(index, 1);
        return
      }
    });
  },
  deleteSiteZoneRateFailure (state, error) {
    state.siteZoneRate = { error }
  },

  createLicenceZoneRequest (state) {
    state.licenceZone = { loading: true }
  },
  createLicenceZoneSuccess (state, licenceZone) {
    state.licenceZone = { licenceZone: licenceZone }
  },
  createLicenceZoneFailure (state, error) {
    state.licenceZone = { error }
  },

  getLicenceZoneRequest (state) {
    state.licenceZone = { loading: true }
  },
  getLicenceZoneSuccess (state, licenceZone) {
    state.licenceZone = { licenceZone: licenceZone }
  },
  getLicenceZoneFailure (state, error) {
    state.licenceZone = { error }
  },

  updateLicenceZoneRequest (state) {
    state.licenceZone = { loading: true }
  },
  updateLicenceZoneSuccess (state, licenceZone) {
    state.licenceZone = { licenceZone: licenceZone }
  },
  updateLicenceZoneFailure (state, error) {
    state.licenceZone = { error }
  },

  deleteLicenceZoneRequest (state) {
    state.licenceZone = { loading: true }
  },
  deleteLicenceZoneSuccess (state, licenceZone) {
    state.licenceZone = { licenceZone: licenceZone }
  },
  deleteLicenceZoneFailure (state, error) {
    state.licenceZone = { error }
  },

}

export const zones = {
  namespaced: true,
  state,
  actions,
  mutations
}
