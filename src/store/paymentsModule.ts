import { paymentService } from '../services'

const state = {
  all: {},
  payment: {},
  paymentTypes: {}
}

const actions = {

  getAll ({ dispatch, commit }, {id}) {
    commit('getAllRequest')

    paymentService.getAll(id).then(
      payments => commit('getAllSuccess', payments),
      error => {
        commit('getAllFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  create ({ dispatch, commit }, payment) {
    commit('createRequest', { payment })

    paymentService.create(payment).then(
      payment => {
        commit('createSuccess', payment)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getPaymentTypes ({ dispatch, commit }) {
    commit('getPaymentTypesRequest')

    paymentService.getPaymentTypes().then(
      paymentTypes => commit('getPaymentTypesSuccess', paymentTypes),
      error => {
        commit('getPaymentTypesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {
  getAllRequest (state) {
    state.all = { loading: true }
  },
  getAllSuccess (state, payments) {
    state.all = { items: payments }
  },
  getAllFailure (state, error) {
    state.all = { error }
  },

  createRequest (state) {
    state.payment = { loading: true }
  },
  createSuccess (state, payment) {
    state.payment = {payment : payment}
  },
  createFailure (state, error) {
    state.payment = { error }
  },

  getPaymentTypesRequest (state) {
    state.paymentTypes = { loading: true }
  },
  getPaymentTypesSuccess (state, paymentTypes) {
    state.paymentTypes = { paymentTypes: paymentTypes }
  },
  getPaymentTypesFailure (state, error) {
    state.paymentTypes = { error }
  },

}

export const payments = {
  namespaced: true,
  state,
  actions,
  mutations
}
