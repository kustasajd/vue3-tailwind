import { productService } from '../services'

const state = {
  all: {},
  product: {},
  siteProducts: {}
}

const actions = {

  //product
  getAll ({ dispatch, commit }) {
    commit('getAllRequest')

    productService.getAll().then(
      products => commit('getAllSuccess', products),
      error => {
        commit('getAllFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getProductsBySiteId ({ commit }, {id}) {
    commit('getProductsBySiteIdRequest', { id })

    productService.getProductsBySiteId(id).then(
      siteProducts => commit('getProductsBySiteIdSuccess', siteProducts),
      error => commit('getProductsBySiteIdFailure', error)
    )
  },
  getSiteProducts ({ commit }, {id}) {
    commit('getSiteProductsRequest', { id })

    productService.getSiteProducts(id).then(
      siteProducts => commit('getSiteProductsSuccess', siteProducts),
      error => commit('getSiteProductsFailure', error)
    )
  },
  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    productService.getById(id).then(
      product => {
        commit('getByIdSuccess', product)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  update ({ dispatch, commit }, product) {
    commit('updateRequest', { product })

    productService.update(product).then(
      product => {
        commit('updateSuccess', product)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  create ({ dispatch, commit }, product) {
    commit('createRequest', { product })

    productService.create(product).then(
      product => {
        commit('createSuccess', product)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  createSite ({ dispatch, commit }, siteProduct) {
    commit('createSiteRequest', { siteProduct })

    productService.createSite(siteProduct).then(
      siteProduct => {
        commit('createSiteSuccess', siteProduct)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createSiteFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {
  //product
  getAllRequest (state) {
    state.all = { loading: true }
  },
  getAllSuccess (state, products) {
    state.all = { items: products }
  },
  getAllFailure (state, error) {
    state.all = { error }
  },


  getProductsBySiteIdRequest (state) {
    state.siteProducts = { loading: true }
  },
  getProductsBySiteIdSuccess (state, siteProducts) {
    state.siteProducts = { siteProducts: siteProducts }
  },
  getProductsBySiteIdFailure (state, error) {
    state.siteProducts = { error }
  },

  getSiteProductsRequest (state) {
    state.siteProducts = { loading: true }
  },
  getSiteProductsSuccess (state, siteProducts) {
    state.siteProducts = { siteProducts: siteProducts }
  },
  getSiteProductsFailure (state, error) {
    state.siteProducts = { error }
  },

  getByIdRequest (state) {
    state.product = { loading: true }
  },
  getByIdSuccess (state, product) {
    state.product = { product: product }
  },
  getByIdFailure (state, error) {
    state.product = { error }
  },

  updateRequest (state) {
    state.product = { loading: true }
  },
  updateSuccess (state, product) {
    state.product = { product: product }
  },
  updateFailure (state, error) {
    state.product = { error }
  },

  createRequest (state) {
    state.product = { loading: true }
  },
  createSuccess (state, product) {
    state.product = {product : product}
  },
  createFailure (state, error) {
    state.product = { error }
  },

  createSiteRequest (state) {
    state.siteProduct = { loading: true }
  },
  createSiteSuccess (state, siteProduct) {
    state.siteProducts.siteProducts.push(siteProduct.siteProduct)
  },
  createSiteFailure (state, error) {
    state.siteProduct = { error }
  },

}

export const products = {
  namespaced: true,
  state,
  actions,
  mutations
}
