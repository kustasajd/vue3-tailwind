import { licenceService } from '../services'
import { zones } from './zonesModule'

const state = {
  licenceStatusTypes: {},
  licences: {},
  licence: {},
  licenceStatusHistories: {},
  clientLicences: {},
  pdf: {},
  licenceTypes: {},
  licenceProductTypes: {},
  licenceProduct: {},
  licenceDocument: {},
  licenceZones: {}
}

const actions = {

  getLicenceBySite ({ dispatch, commit }, { id }) {
    commit('getLicenceBySiteRequest', { id })

    licenceService.getLicenceBySite(id).then(
      licences => {
        commit('getLicenceBySiteSuccess', licences)
      },
      error => {
        commit('getLicenceBySiteFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getZones ({ dispatch, commit }, { id }) {
    commit('getZonesRequest', { id })

    licenceService.getZones(id).then(
      zones => {
        commit('getZonesSuccess', zones)
      },
      error => {
        commit('getZonesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    licenceService.getById(id).then(
      licence => {
        commit('getByIdSuccess', licence)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getHistory ({ dispatch, commit }, { id }) {
    commit('getHistoryRequest', { id })

    licenceService.getHistory(id).then(
      licenceStatusHistories => {
        commit('getHistorySuccess', licenceStatusHistories)
      },
      error => {
        commit('getHistoryFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  create ({ dispatch, commit }, licence) {
    commit('createRequest', { licence })

    licenceService.create(licence).then(
      licence => {
        commit('createSuccess', licence)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  update ({ dispatch, commit }, licence) {
    commit('updateRequest', { licence })

    licenceService.update(licence).then(
      licence => {
        commit('updateSuccess', licence)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getLicencesbyClient ({ dispatch, commit }, { clientId }) {
    commit('getLicencesbyClientRequest', { clientId })
    licenceService.getLicencesbyClient(clientId).then(
      clientLicences => {
        commit('getLicencesbyClientSuccess', clientLicences)
      },
      error => {
        commit('getLicencesbyClientFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getLicenceStatusType ({ dispatch, commit }) {
    commit('getLicenceStatusTypeRequest')

    licenceService.getLicenceStatusType().then(
      licenceStatusTypes => commit('getLicenceStatusTypeSuccess', licenceStatusTypes),
      error => {
        commit('getLicenceStatusTypeFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  exportPdf ({ dispatch, commit }, pdf) {
    commit('exportPdfRequest', { pdf })

    licenceService.exportPdf(pdf).then(
      pdf => {
        commit('exportPdfSuccess', pdf)
        dispatch('alert/success', 'Upload successful', { root: true })
      },
      error => {
        commit('exportPdfFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getLicenceType ({ dispatch, commit }) {
    commit('getLicenceTypeRequest')
    licenceService.getLicenceType().then(
      licenceTypes => commit('getLicenceTypeSuccess', licenceTypes),
      error => {
        commit('getLicenceTypeFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getLicenceProductType ({ dispatch, commit }) {
    commit('getLicenceProductTypeRequest')
    licenceService.getLicenceProductType().then(
      licenceProductTypes => commit('getLicenceProductTypeSuccess', licenceProductTypes),
      error => {
        commit('getLicenceProductTypeFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  createLicenceProduct ({ dispatch, commit }, licenceProduct) {
    commit('createLicenceProductRequest', { licenceProduct })

    licenceService.createLicenceProduct(licenceProduct).then(
      licenceProduct => {
        commit('createLicenceProductSuccess', licenceProduct)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createLicenceProductFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  updateLicenceProduct ({ dispatch, commit }, licenceProduct) {
    commit('updateLicenceProductRequest', { licenceProduct })

    licenceService.updateLicenceProduct(licenceProduct).then(
      licenceProduct => {
        commit('updateLicenceProductSuccess', licenceProduct)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateLicenceProductFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  deleteLicenceProduct ({ dispatch, commit }, { id }) {
    commit('deleteLicenceProductRequest', { id })

    licenceService.deleteLicenceProduct(id).then(
      licenceProduct => {
        commit('deleteLicenceProductSuccess', licenceProduct)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteLicenceProductFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  createLicenceDocument ({ dispatch, commit }, licenceDocument) {
    commit('createLicenceDocumentRequest', { licenceDocument })

    licenceService.createLicenceDocument(licenceDocument).then(
      licenceDocument => {
        commit('createLicenceDocumentSuccess', licenceDocument)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createLicenceDocumentFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },  

  licenceDocumentDetail ({ dispatch, commit }, id) {
    commit('licenceDocumentDetailRequest', { id })

    licenceService.getLicenceDocumentDetail(id).then(
      licenceDocument => {
        commit('licenceDocumentDetailSuccess', licenceDocument)
      },
      error => {
        commit('licenceDocumentDetailFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  licenceProductDetail ({ dispatch, commit }, id) {
    commit('licenceProductDetailRequest', { id })

    licenceService.getLicenceProductDetail(id).then(
      licenceProduct => {
        commit('licenceProductDetailSuccess', licenceProduct)
      },
      error => {
        commit('licenceProductDetailFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getLicenceZonesByClient ({ dispatch, commit }, data) {
    commit('getLicenceZonesByClientRequest', { data })

    licenceService.getLicenceZonesByClient(data).then(
      licenceZones => {
        commit('getLicenceZonesByClientSuccess', licenceZones)
      },
      error => {
        commit('getLicenceZonesByClientFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  terminate ({ dispatch, commit }, terminateDetail) {
    commit('terminateRequest', { terminateDetail })

    licenceService.terminate(terminateDetail).then(
      licence => {
        commit('terminateSuccess', licence)
        dispatch('alert/success', 'Termination successful', { root: true })
      },
      error => {
        commit('terminateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {

  getLicenceBySiteRequest (state) {
    state.licences = { loading: true }
  },
  getLicenceBySiteSuccess (state, licences) {
    state.licences = { licences: licences }
  },
  getLicenceBySiteFailure (state, error) {
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

  getByIdRequest (state) {
    state.licence = { loading: true }
  },
  getByIdSuccess (state, licence) {
    state.licence = { licence: licence }
  },
  getByIdFailure (state, error) {
    state.licence = { error }
  },

  getHistoryRequest (state) {
    state.licenceStatusHistories = { loading: true }
  },
  getHistorySuccess (state, licenceStatusHistories) {
    state.licenceStatusHistories = { licenceStatusHistories: licenceStatusHistories }
  },
  getHistoryFailure (state, error) {
    state.licenceStatusHistories = { error }
  },

  createRequest (state) {
    state.licence = { loading: true }
  },
  createSuccess (state, licence) {
    state.licence = {licence : licence}
  },
  createFailure (state, error) {
    state.licence = { error }
  },

  updateRequest (state) {
    state.licence = { loading: true }
  },
  updateSuccess (state, licence) {
    state.licence = { licence: licence }
  },
  updateFailure (state, error) {
    state.licence = { error }
  },

  getLicencesbyClientRequest (state) {
    state.clientLicences = { loading: true }
  },
  getLicencesbyClientSuccess (state, clientLicences) {
    state.clientLicences = { clientLicences: clientLicences }
  },
  getLicencesbyClientFailure (state, error) {
    state.clientLicences = { error }
  },

  getLicenceStatusTypeRequest (state) {
    state.licenceStatusTypes = { loading: true }
  },
  getLicenceStatusTypeSuccess (state, licenceStatusTypes) {
    state.licenceStatusTypes = { licenceStatusTypes: licenceStatusTypes }
  },
  getLicenceStatusTypeFailure (state, error) {
    state.licenceStatusTypes = { error }
  },

  exportPdfRequest (state) {
    state.pdf = { loading: true }
  },
  exportPdfSuccess (state, pdf) {
    state.pdf = { pdf: pdf }
  },
  exportPdfFailure (state, error) {
    state.pdf = { error }
  },

  getLicenceTypeRequest (state) {
    state.licenceTypes = { loading: true }
  },
  getLicenceTypeSuccess (state, licenceTypes) {
    state.licenceTypes = { licenceTypes: licenceTypes }
  },
  getLicenceTypeFailure (state, error) {
    state.licenceTypes = { error }
  },

  getLicenceProductTypeRequest (state) {
    state.licenceProductTypes = { loading: true }
  },
  getLicenceProductTypeSuccess (state, licenceProductTypes) {
    state.licenceProductTypes = { licenceProductTypes: licenceProductTypes }
  },
  getLicenceProductTypeFailure (state, error) {
    state.licenceProductTypes = { error }
  },

  createLicenceProductRequest (state) {
    state.licenceProduct = { loading: true }
  },
  createLicenceProductSuccess (state, licenceProduct) {
    state.licenceProduct = { licenceProduct: licenceProduct }
  },
  createLicenceProductFailure (state, error) {
    state.licenceProduct = { error }
  },

  updateLicenceProductRequest (state) {
    state.licenceProduct = { loading: true }
  },
  updateLicenceProductSuccess (state, licenceProduct) {
    state.licenceProduct = { licenceProduct: licenceProduct }
  },
  updateLicenceProductFailure (state, error) {
    state.licenceProduct = { error }
  },

  deleteLicenceProductRequest (state) {
    state.licenceProduct = { loading: true }
  },
  deleteLicenceProductSuccess (state, licenceProduct) {
    state.licenceProduct = { licenceProduct: licenceProduct }
  },
  deleteLicenceProductFailure (state, error) {
    state.licenceProduct = { error }
  },

  createLicenceDocumentRequest (state) {
    state.licenceDocument = { loading: true }
  },
  createLicenceDocumentSuccess (state, licenceDocument) {
    state.licenceDocument = { licenceDocument: licenceDocument }
  },
  createLicenceDocumentFailure (state, error) {
    state.licenceDocument = { error }
  },

  licenceDocumentDetailRequest (state) {
    state.licenceDocument = { loading: true }
  },
  licenceDocumentDetailSuccess (state, licenceDocument) {
    state.licenceDocument = { licenceDocument: licenceDocument }
  },
  licenceDocumentDetailFailure (state, error) {
    state.licenceDocument = { error }
  },

  licenceProductDetailRequest (state) {
    state.licenceProduct = { loading: true }
  },
  licenceProductDetailSuccess (state, licenceProduct) {
    state.licenceProduct = { licenceProduct: licenceProduct }
  },
  licenceProductDetailFailure (state, error) {
    state.licenceProduct = { error }
  },

  getLicenceZonesByClientRequest (state) {
    state.licenceZones = { loading: true }
  },
  getLicenceZonesByClientSuccess (state, licenceZones) {
    state.licenceZones = { licenceZones: licenceZones }
  },
  getLicenceZonesByClientFailure (state, error) {
    state.licenceZones = { error }
  },

  terminateRequest (state) {
    state.licence = { loading: true }
  },
  terminateSuccess (state, licence) {
    state.licence = {licence : licence}
  },
  terminateFailure (state, error) {
    state.licence = { error }
  },

}

export const licences = {
  namespaced: true,
  state,
  actions,
  mutations
}
