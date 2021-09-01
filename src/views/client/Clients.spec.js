import { shallowMount } from '@vue/test-utils'
import Clients from './Clients.vue'
import { createStore } from 'vuex'
import router from '../../router'
import Data from '../../../config'
const config = Data

import axios from 'axios'
const MockAdapter = require('axios-mock-adapter')
const mock = new MockAdapter(axios)

const store = createStore({
  state () {
    return {
      clients: {
        all: {}
      },
      sites: {
        all: {},
        siteClients: {}
      }
    }
  },
  mutations: {
    'clients/getAllRequest' (state) {
      state.clients.all = { loading: true }
    },
    'clients/getAllSuccess' (state, clients) {
      state.clients.all = { items: clients }
    },
    'clients/getAllFailure' (state, error) {
      state.clients.all = { error }
    },

    'sites/getAllRequest' (state) {
      state.sites.all = { loading: true }
    },
    'sites/getAllSuccess' (state, sites) {
      state.sites.all = { items: sites }
    },
    'sites/getAllFailure' (state, error) {
      state.sites.all = { error }
    },
    'sites/getClientByIdRequest' (state) {
      state.sites.siteClients = { loading: true }
    },
    'sites/getClientByIdSuccess' (state, siteClients) {
      state.sites.siteClients = { siteClients: siteClients }
    },
    'sites/getClientByIdFailure' (state, error) {
      state.sites.siteClients = { error }
    }
  },
  actions: {
    //client
    'clients/getAll' ({ commit }) {
      commit('clients/getAllRequest')

      axios.get(`${config.apiUrl}/clients`).then(
        response => {
          commit('clients/getAllSuccess', response.data)
        },
        error => {
          commit('clients/getAllFailure', error)
        }
      )
    },
    'sites/getAll' ({ commit }) {
      commit('sites/getAllRequest')

      axios.get(`${config.apiUrl}/sites`).then(
        response => {
          commit('sites/getAllSuccess', response.data)
        },
        error => {
          commit('sites/getAllFailure', error)
        }
      )
    },
    'sites/getClientById' ({ commit }) {
      commit('sites/getClientByIdRequest')

      axios.get(`${config.apiUrl}/sites/clients/1`).then(
        response => {
          commit('sites/getClientByIdSuccess', response.data)
        },
        error => {
          commit('sites/getClientByIdFailure', error)
        }
      )
    }
  }
})

describe('Clients', () => {
  afterAll(() => {
    mock.restore()
  })
  beforeEach(() => {
    mock.reset()
  })

  it('loads clients', async () => {
    await mock.onGet(`${config.apiUrl}/clients`).reply(201, [
      {
        clientId: 4,
        clientUsers: [],
        email: 'test1@test.com',
        legalName:
          'Australian Finance Direct Pty Ltd T/As Express Settlements & Vie Capital',
        licences: [],
        phone: '12345678',
        primaryContact: '12345678',
        profilePic: null,
        tradingName: 'Express Settlements',
        website: null
      }
    ])
    await mock.onGet(`${config.apiUrl}/sites`).reply(201, [
      {
        addressStreet: '123 Fake St, Australia',
        brandName: 'Melbourne Queens Road',
        currency: {
          currencyId: 1,
          name: 'Australian Dollar',
          symbol: '$',
          abbreviation: 'AUD '
        },
        currencyId: 1,
        siteClients: [],
        siteId: 1,
        siteUsers: []
      }
    ])
    await mock.onGet(`${config.apiUrl}/sites/clients/1`).reply(201, [
      {
        client: {
          clientId: 6,
          clientUsers: [],
          email: 'test2@test.com',
          legalName: 'Wonder Smile',
          phone: '123-456-7890',
          primaryContact: '121212',
          profilePic: null,
          tradingName: 'Wonder Smile',
          website: 'test'
        },
        clientId: 6,
        siteClientId: 4,
        siteId: 1
      }
    ])

    const wrapper = shallowMount(Clients, {
      global: {
        plugins: [store, router]
      }
    })
    
    let siteId
    wrapper.vm.changeSiteId(siteId)
    expect(wrapper.vm.isLoading).toBeTruthy()
    siteId = 'all'
    wrapper.vm.changeSiteId(siteId)
    expect(wrapper.vm.isLoading).toBeTruthy()
  })
})
