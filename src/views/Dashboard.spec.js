import { shallowMount } from '@vue/test-utils'
import Dashboard from './Dashboard.vue'
import { createStore } from 'vuex'
import Data from '../../config'
const config = Data

import axios from 'axios'

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
};

global.localStorage = new LocalStorageMock;

const store = createStore({
  state () {
    return {
      users: {
        all: {}
      },
    }
  },
  mutations: {
    'users/getAllRequest' (state) {
      state.users.all = { loading: true }
    },
    'users/getAllSuccess' (state, users) {
      state.users.all = { items: users }
    },
    'users/getAllFailure' (state, error) {
      state.users.all = { error }
    },    
  },
  actions: {
    //client
    'users/getAll' ({ commit }) {
      commit('users/getAllRequest')

      axios.get(`${config.apiUrl}/users`).then(
        response => {
          commit('users/getAllSuccess', response.data)
        },
        error => {
          commit('users/getAllFailure', error)
        }
      )
    },
  }
})

describe('Dashboard', () => {

  it('Last Login null', async () => {
    shallowMount(Dashboard, {
      global: {
        plugins: [store]
      }
    })
  })

  it('Last Login Case Defalt', async () => {
      
    localStorage.setItem('lastLogin', '2021-03-26, 11:04 pm')
    shallowMount(Dashboard, {
      global: {
        plugins: [store]
      }
    })
  })

  it('Last Login Case 1', async () => {
      
    localStorage.setItem('lastLogin', new Date())
    shallowMount(Dashboard, {
      global: {
        plugins: [store]
      }
    })
  })

  it('Last Login Case 0', async () => {
    var d = new Date();
    d.setDate(d.getDate() - 1);

    localStorage.setItem('lastLogin', d)
    shallowMount(Dashboard, {
      global: {
        plugins: [store]
      }
    })
  })

  
})
