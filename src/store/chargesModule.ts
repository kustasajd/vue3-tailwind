import { chargeService } from '../services'

const state = {
  charges: {},
  charge: {},
}

const actions = {

  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    chargeService.getById(id).then(
      charges => {
        commit('getByIdSuccess', charges)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  filter ({ dispatch, commit }, params) {
    commit('filterRequest', { params })

    chargeService.filter(params).then(
      charges => {
        commit('filterSuccess', charges)
      },
      error => {
        commit('filterFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  create ({ dispatch, commit }, charge) {
    commit('createRequest', { charge })

    chargeService.create(charge).then(
      charge => {
        commit('createSuccess', charge)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getDetail ({ dispatch, commit }, { id }) {
    commit('getDetailRequest', { id })

    chargeService.getDetail(id).then(
      charge => {
        commit('getDetailSuccess', charge)
      },
      error => {
        commit('getDetailFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  update ({ dispatch, commit }, charge) {
    commit('updateRequest', { charge })

    chargeService.update(charge).then(
      charge => {
        commit('updateSuccess', charge)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  deleteCharge ({ dispatch, commit }, { id }) {
    commit('deleteChargeRequest', { id })

    chargeService.deleteCharge(id).then(
      charge => {
        commit('deleteChargeSuccess', charge)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteChargeFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {

  getByIdRequest (state) {
    state.charges = { loading: true }
  },
  getByIdSuccess (state, charges) {
    state.charges = { charges: charges }
  },
  getByIdFailure (state, error) {
    state.charges = { error }
  },

  filterRequest (state) {
    state.charges = { loading: true }
  },
  filterSuccess (state, charges) {
    state.charges = { charges: charges }
  },
  filterFailure (state, error) {
    state.charges = { error }
  },

  createRequest (state) {
    state.charge = { loading: true }
  },
  createSuccess (state, charge) {
    state.charge = {charge : charge}
  },
  createFailure (state, error) {
    state.charge = { error }
  },

  getDetailRequest (state) {
    state.charge = { loading: true }
  },
  getDetailSuccess (state, charge) {
    state.charge = { charge: charge }
  },
  getDetailFailure (state, error) {
    state.charge = { error }
  },

  updateRequest (state) {
    state.charge = { loading: true }
  },
  updateSuccess (state, charge) {
    state.charge = { charge: charge }
  },
  updateFailure (state, error) {
    state.charge = { error }
  },

  deleteChargeRequest (state) {
    state.charge = { loading: true }
  },
  deleteChargeSuccess (state, charge) {
    state.charge = { charge: charge }
  },
  deleteChargeFailure (state, error) {
    state.charge = { error }
  },

}

export const charges = {
  namespaced: true,
  state,
  actions,
  mutations
}
