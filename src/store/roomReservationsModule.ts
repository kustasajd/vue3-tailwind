import { roomReservationService } from '../services'

const state = {
  all: {},
  roomReservation: {},
  zones: {}
}

const actions = {

  getAll ({ dispatch, commit }, { id }) {
    commit('getAllRequest', {id})

    roomReservationService.getAll(id).then(
      roomReservations => commit('getAllSuccess', roomReservations),
      error => {
        commit('getAllFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    roomReservationService.getById(id).then(
      roomReservation => {
        commit('getByIdSuccess', roomReservation)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  create ({ dispatch, commit }, roomReservation) {
    commit('createRequest', { roomReservation })

    roomReservationService.create(roomReservation).then(
      roomReservation => {
        commit('createSuccess', roomReservation)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  update ({ dispatch, commit }, roomReservation) {
    commit('updateRequest', { roomReservation })

    roomReservationService.update(roomReservation).then(
      roomReservation => {
        commit('updateSuccess', roomReservation)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  updateTime ({ dispatch, commit }, roomReservation) {
    commit('updateTimeRequest', { roomReservation })

    roomReservationService.updateTime(roomReservation).then(
      roomReservation => {
        commit('updateTimeSuccess', roomReservation)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateTimeFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getZones ({ dispatch, commit }, {id}) {
    commit('getZonesRequest', { id })

    roomReservationService.getZones(id).then(
      zones => commit('getZonesSuccess', zones),
      error => {
        commit('getZonesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {
  getAllRequest (state) {
    state.all = { loading: true }
  },
  getAllSuccess (state, roomReservations) {
    state.all = { items: roomReservations }
  },
  getAllFailure (state, error) {
    state.all = { error }
  },

  getByIdRequest (state) {
    state.roomReservation = { loading: true }
  },
  getByIdSuccess (state, roomReservation) {
    state.roomReservation = { roomReservation: roomReservation }
  },
  getByIdFailure (state, error) {
    state.roomReservation = { error }
  },

  createRequest (state) {
    state.roomReservation = { loading: true }
  },
  createSuccess (state, roomReservation) {
    state.roomReservation = {roomReservation : roomReservation}
  },
  createFailure (state, error) {
    state.roomReservation = { error }
  },

  updateRequest (state) {
    state.roomReservation = { loading: true }
  },
  updateSuccess (state, roomReservation) {
    state.roomReservation = { roomReservation: roomReservation }
  },
  updateFailure (state, error) {
    state.roomReservation = { error }
  },

  updateTimeRequest (state) {
    state.roomReservation = { loading: true }
  },
  updateTimeSuccess (state, roomReservation) {
    state.all.items.forEach(element => {
      if (element.roomReservationId === roomReservation.roomReservationId) {
        element.timeStart = roomReservation.timeStart
        element.timeEnd = roomReservation.timeEnd
        return;
      }
    });
    state.roomReservation = { roomReservation: roomReservation }
  },
  updateTimeFailure (state, error) {
    state.roomReservation = { error }
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

export const roomReservations = {
  namespaced: true,
  state,
  actions,
  mutations
}
