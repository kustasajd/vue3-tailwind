import { siteService } from '../services'

const state = {
  all: {},
  currencies: {},
  site: {},
  siteLogo: {},
  siteUsers: {},
  siteClients: {},
  siteProductsBySiteId: {},
  siteProductPricing: {},
  licenceTemplates: {},
  licenceTemplateDetail: {},
  licenceTemplate: {},
  licenceDocument: {},
  licenceDocumentDetail: {},
  licenceProduct: {},
  licenceProductDetail: {},
  taxRates: {},
  productChargeTypes: {},
  siteProduct: {}
}

const actions = {

  //site
  getAll ({ dispatch, commit }) {
    commit('getAllRequest')

    siteService.getAll().then(
      sites => commit('getAllSuccess', sites),
      error => {
        commit('getAllFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
  getCurrencies ({ dispatch, commit }) {
    commit('getCurrenciesRequest')

    siteService.getCurrencies().then(
      currencies => commit('getCurrenciesSuccess', currencies),
      error => {
        commit('getCurrenciesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    siteService.getById(id).then(
      site => {
        commit('getByIdSuccess', site)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getSiteLogo ({ dispatch, commit }, { id }) {
    commit('getSiteLogoRequest', { id })

    siteService.getSiteLogo(id).then(
      siteLogo => {
        commit('getSiteLogoSuccess', siteLogo)
      },
      error => {
        commit('getSiteLogoFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  update ({ dispatch, commit }, site) {
    commit('updateRequest', { site })

    siteService.update(site).then(
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

  // site users
  createSiteUser ({ dispatch, commit }, siteUser) {
    commit('createSiteUserRequest', { siteUser })

    siteService.createSiteUser(siteUser).then(
      siteUser => {
        commit('createSiteUserSuccess', siteUser)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createSiteUserFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  updateSiteUser ({ dispatch, commit }, siteUser) {
    commit('updateSiteUserRequest', { siteUser })

    siteService.updateSiteUser(siteUser).then(
      siteUser => {
        commit('updateSiteUserSuccess', siteUser)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateSiteUserFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  deleteSiteUser ({ dispatch, commit }, siteUser) {
    commit('deleteSiteUserRequest', { siteUser })

    siteService.deleteSiteUser(siteUser).then(
      siteUser => {
        commit('deleteSiteUserSuccess', siteUser)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteSiteUserFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getUserById ({ dispatch, commit }, {id}) {
    commit('getUserByIdRequest', { id })

    siteService.getUserById(id).then(
      siteUsers => {
        commit('getUserByIdSuccess', siteUsers)
      },
      error => {
        commit('getUserByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  // site clients
  createSiteClient ({ dispatch, commit }, siteClient) {
    commit('createSiteClientRequest', { siteClient })

    siteService.createSiteClient(siteClient).then(
      siteClient => {
        commit('createSiteClientSuccess', siteClient)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createSiteClientFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  deleteSiteClient ({ dispatch, commit }, siteClient) {
    commit('deleteSiteClientRequest', { siteClient })

    siteService.deleteSiteClient(siteClient).then(
      siteClient => {
        commit('deleteSiteClientSuccess', siteClient)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteSiteClientFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getClientById ({ dispatch, commit }, {id}) {
    commit('getClientByIdRequest', { id })

    siteService.getClientById(id).then(
      siteClients => {
        commit('getClientByIdSuccess', siteClients)
      },
      error => {
        commit('getClientByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getSitesByClient ({ dispatch, commit }, {id}) {
    commit('getSitesByClientRequest', { id })

    siteService.getSitesByClient(id).then(
      siteClients => {
        commit('getSitesByClientSuccess', siteClients)
      },
      error => {
        commit('getSitesByClientFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  //site products
  getSiteProductsBySiteId ({ commit }, {id}) {
    commit('getSiteProductsBySiteIdRequest', { id })

    siteService.getSiteProductsBySiteId(id).then(
      siteProductsBySiteId => commit('getSiteProductsBySiteIdSuccess', siteProductsBySiteId),
      error => commit('getSiteProductsBySiteIdFailure', error)
    )
  },
  getSiteProductById ({ commit }, {siteId, siteProductId}) {
    commit('getSiteProductByIdRequest', { siteId, siteProductId })

    siteService.getSiteProductById(siteId, siteProductId).then(
      siteProduct => commit('getSiteProductByIdSuccess', siteProduct),
      error => commit('getSiteProductByIdFailure', error)
    )
  },
  getSiteProductPricingById ({ commit }, {siteId, siteProductPricingId}) {
    commit('getSiteProductPricingByIdRequest', { siteId, siteProductPricingId })

    siteService.getSiteProductPricingById(siteId, siteProductPricingId).then(
      siteProductPricing => commit('getSiteProductPricingByIdSuccess', siteProductPricing),
      error => commit('getSiteProductPricingByIdFailure', error)
    )
  },
  getSiteProductPricing ({ dispatch, commit }, siteProduct) {
    commit('getSiteProductPricingRequest', { siteProduct })

    siteService.getSiteProductPricing(siteProduct).then(
      siteProductPricing => {
        commit('getSiteProductPricingSuccess', siteProductPricing)
      },
      error => {
        commit('getSiteProductPricingFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  //siteLicenceTemplates
  getLicenceTemplate ({ dispatch, commit }, {id}) {
    commit('getLicenceTemplateRequest', { id })

    siteService.getLicenceTemplate(id).then(
      licenceTemplates => {
        commit('getLicenceTemplateSuccess', licenceTemplates)
      },
      error => {
        commit('getLicenceTemplateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  licenceTemplateDetail ({ dispatch, commit }, licenceTemplate) {
    commit('licenceTemplateDetailRequest', { licenceTemplate })

    siteService.licenceTemplateDetail(licenceTemplate).then(
      licenceTemplateDetail => {
        commit('licenceTemplateDetailSuccess', licenceTemplateDetail)
      },
      error => {
        commit('licenceTemplateDetailFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  createLicenceTemplate ({ dispatch, commit }, licenceTemplate) {
    commit('createLicenceTemplateRequest', { licenceTemplate })

    siteService.createLicenceTemplate(licenceTemplate).then(
      licenceTemplate => {
        commit('createLicenceTemplateSuccess', licenceTemplate)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createLicenceTemplateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  updateLicenceTemplate ({ dispatch, commit }, licenceTemplate) {
    commit('updateLicenceTemplateRequest', { licenceTemplate })

    siteService.updateLicenceTemplate(licenceTemplate).then(
      licenceTemplate => {
        commit('updateLicenceTemplateSuccess', licenceTemplate)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateLicenceTemplateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  // SiteLicenceDocument

  createLicenceDocument ({ dispatch, commit }, licenceDocument) {
    commit('createLicenceDocumentRequest', { licenceDocument })

    siteService.createSiteLicenceDocument(licenceDocument).then(
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

  updateLicenceDocument ({ dispatch, commit }, licenceDocument) {
    commit('updateLicenceDocumentRequest', { licenceDocument })

    siteService.updateSiteLicenceDocument(licenceDocument).then(
      licenceDocument => {
        commit('updateLicenceDocumentSuccess', licenceDocument)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateLicenceDocumentFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  licenceDocumentDetail ({ dispatch, commit }, id) {
    commit('licenceDocumentDetailRequest', { id })

    siteService.siteLicenceDocumentDetail(id).then(
      licenceDocumentDetail => {
        commit('licenceDocumentDetailSuccess', licenceDocumentDetail)
      },
      error => {
        commit('licenceDocumentDetailFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  // SiteLicenceProduct

  createLicenceProduct ({ dispatch, commit }, licenceProduct) {
    commit('createLicenceProductRequest', { licenceProduct })

    siteService.createSiteLicenceProduct(licenceProduct).then(
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

    siteService.updateSiteLicenceProduct(licenceProduct).then(
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

  licenceProductDetail ({ dispatch, commit }, id) {
    commit('licenceProductDetailRequest', { id })

    siteService.siteLicenceProductDetail(id).then(
      licenceProductDetail => {
        commit('licenceProductDetailSuccess', licenceProductDetail)
      },
      error => {
        commit('licenceProductDetailFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  // Get Tax Rate and Product Charge Type
  getAllTaxRate ({ dispatch, commit }) {
    commit('getAllTaxRateRequest')

    siteService.getAllTaxRate().then(
      taxRates => commit('getAllTaxRateSuccess', taxRates),
      error => {
        commit('getAllTaxRateFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  getAllProductChargeType ({ dispatch, commit }) {
    commit('getAllProductChargeTypeRequest')

    siteService.getAllProductChargeType().then(
      productChargeTypes => commit('getAllProductChargeTypeSuccess', productChargeTypes),
      error => {
        commit('getAllProductChargeTypeFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  createSiteProduct ({ dispatch, commit }, siteProduct) {
    commit('createSiteProductRequest', { siteProduct })

    siteService.createSiteProduct(siteProduct).then(
      siteProduct => {
        commit('createSiteProductSuccess', siteProduct)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createSiteProductFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  createSiteProductPricing ({ dispatch, commit }, siteProductPricing) {
    commit('createSiteProductPricingRequest', { siteProductPricing })

    siteService.createSiteProductPricing(siteProductPricing).then(
      siteProductPricing => {
        commit('createSiteProductPricingSuccess', siteProductPricing)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createSiteProductPricingFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  updateSiteProductPricing ({ dispatch, commit }, siteProductPricing) {
    commit('updateSiteProductPricingRequest', { siteProductPricing })

    siteService.updateSiteProductPricing(siteProductPricing).then(
      siteProductPricing => {
        commit('updateSiteProductPricingSuccess', siteProductPricing)
        dispatch('alert/success', 'Update successful', { root: true })
      },
      error => {
        commit('updateSiteProductPricingFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
}

const mutations = {
  //site
  getAllRequest (state) {
    state.all = { loading: true }
  },
  getAllSuccess (state, sites) {
    state.all = { items: sites }
  },
  getAllFailure (state, error) {
    state.all = { error }
  },

  getCurrenciesRequest (state) {
    state.currencies = { loading: true }
  },
  getCurrenciesSuccess (state, currencies) {
    state.currencies = { currencies: currencies }
  },
  getCurrenciesFailure (state, error) {
    state.all = { error }
  },

  getByIdRequest (state) {
    state.site = { loading: true }
  },
  getByIdSuccess (state, site) {
    state.site = { site: site }
  },
  getByIdFailure (state, error) {
    state.site = { error }
  },

  getSiteLogoRequest (state) {
    state.siteLogo = { loading: true }
  },
  getSiteLogoSuccess (state, siteLogo) {
    state.siteLogo = { siteLogo: siteLogo }
  },
  getSiteLogoFailure (state, error) {
    state.siteLogo = { error }
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

  //site users
  createSiteUserRequest (state) {
    state.siteUser = { loading: true }
  },
  createSiteUserSuccess (state, siteUser) {
    if (!state.siteUsers.siteUsers) {
      state.siteUsers.siteUsers = []
    }
    state.siteUsers.siteUsers.push(siteUser)
  },
  createSiteUserFailure (state, error) {
    state.siteUsers = { error }
  },

  updateSiteUserRequest (state) {
    state.siteUser = { loading: true }
  },
  updateSiteUserSuccess (state, siteUser) {
    state.siteUser = { siteUser: siteUser }
  },
  updateSiteUserFailure (state, error) {
    state.siteUser = { error }
  },

  deleteSiteUserRequest (state) {
  },
  deleteSiteUserSuccess (state, siteUser) {
    const index = state.siteUsers.siteUsers.indexOf(siteUser.siteUser);
    state.siteUsers.siteUsers.splice(index, 1);
  },
  deleteSiteUserFailure (state, error) {
    state.siteUsers = { error }
  },

  getUserByIdRequest (state) {
    state.siteUsers = { loading: true }
  },
  getUserByIdSuccess (state, siteUsers) {
    state.siteUsers = { siteUsers: siteUsers }
  },
  getUserByIdFailure (state, error) {
    state.siteUsers = { error }
  },

  //site clients
  createSiteClientRequest (state) {
  },
  createSiteClientSuccess (state, siteClients) {
    if (!state.siteClients.siteClients) {
      state.siteClients.siteClients = []
    }
    state.siteClients.siteClients.push(siteClients.siteClients)
  },
  createSiteClientFailure (state, error) {
    state.siteClients = { error }
  },

  deleteSiteClientRequest (state) {
  },
  deleteSiteClientSuccess (state, siteClient) {
    const index = state.siteClients.siteClients.indexOf(siteClient.siteClient);
    state.siteClients.siteClients.splice(index, 1);
  },
  deleteSiteClientFailure (state, error) {
    state.siteClients = { error }
  },

  getClientByIdRequest (state) {
    state.siteClients = { loading: true }
  },
  getClientByIdSuccess (state, siteClients) {
    state.siteClients = { siteClients: siteClients }
  },
  getClientByIdFailure (state, error) {
    state.siteClients = { error }
  },

  getSitesByClientRequest (state) {
    state.siteClients = { loading: true }
  },
  getSitesByClientSuccess (state, siteClients) {
    state.siteClients = { siteClients: siteClients }
  },
  getSitesByClientFailure (state, error) {
    state.siteClients = { error }
  },

  //site products
  getSiteProductsBySiteIdRequest (state) {
    state.siteProductsBySiteId = { loading: true }
  },
  getSiteProductsBySiteIdSuccess (state, siteProductsBySiteId) {
    state.siteProductsBySiteId = { siteProductsBySiteId: siteProductsBySiteId }
  },
  getSiteProductsBySiteIdFailure (state, error) {
    state.siteProductsBySiteId = { error }
  },

  getSiteProductByIdRequest (state) {
    state.siteProduct = { loading: true }
  },
  getSiteProductByIdSuccess (state, siteProduct) {
    state.siteProduct = { siteProduct: siteProduct }
  },
  getSiteProductByIdFailure (state, error) {
    state.siteProduct = { error }
  },

  getSiteProductPricingByIdRequest (state) {
    state.siteProductPricing = { loading: true }
  },
  getSiteProductPricingByIdSuccess (state, siteProductPricing) {
    state.siteProductPricing = { siteProductPricing: siteProductPricing }
  },
  getSiteProductPricingByIdFailure (state, error) {
    state.siteProductPricing = { error }
  },

  getSiteProductPricingRequest (state) {
    state.siteProductPricing = { loading: true }
  },
  getSiteProductPricingSuccess (state, siteProductPricing) {
    state.siteProductPricing = { siteProductPricing: siteProductPricing }
  },
  getSiteProductPricingFailure (state, error) {
    state.siteProductPricing = { error }
  },

  //siteLicenceTemplates
  getLicenceTemplateRequest (state) {
    state.licenceTemplates = { loading: true }
  },
  getLicenceTemplateSuccess (state, licenceTemplates) {
    state.licenceTemplates = { licenceTemplates: licenceTemplates }
  },
  getLicenceTemplateFailure (state, error) {
    state.licenceTemplates = { error }
  },

  licenceTemplateDetailRequest (state) {
    state.licenceTemplateDetail = { loading: true }
  },
  licenceTemplateDetailSuccess (state, licenceTemplateDetail) {
    state.licenceTemplateDetail = { licenceTemplateDetail: licenceTemplateDetail }
  },
  licenceTemplateDetailFailure (state, error) {
    state.licenceTemplateDetail = { error }
  },

  createLicenceTemplateRequest (state) {
    state.licenceTemplate = { loading: true }
  },
  createLicenceTemplateSuccess (state, licenceTemplate) {
    state.licenceTemplate = { licenceTemplate: licenceTemplate }
  },
  createLicenceTemplateFailure (state, error) {
    state.licenceTemplate = { error }
  },

  updateLicenceTemplateRequest (state) {
    state.licenceTemplate = { loading: true }
  },
  updateLicenceTemplateSuccess (state, licenceTemplate) {
    state.licenceTemplate = { licenceTemplate: licenceTemplate }
  },
  updateLicenceTemplateFailure (state, error) {
    state.licenceTemplate = { error }
  },

  //Licence Documents

  createLicenceDocumentRequest (state) {
    state.licenceDocument = { loading: true }
  },
  createLicenceDocumentSuccess (state, licenceDocument) {
    state.licenceDocument = { licenceDocument: licenceDocument }
  },
  createLicenceDocumentFailure (state, error) {
    state.licenceDocument = { error }
  },

  updateLicenceDocumentRequest (state) {
    state.licenceDocument = { loading: true }
  },
  updateLicenceDocumentSuccess (state, licenceDocument) {
    state.licenceDocument = { licenceDocument: licenceDocument }
  },
  updateLicenceDocumentFailure (state, error) {
    state.licenceDocument = { error }
  },

  licenceDocumentDetailRequest (state) {
    state.licenceDocumentDetail = { loading: true }
  },
  licenceDocumentDetailSuccess (state, licenceDocumentDetail) {
    state.licenceDocumentDetail = { licenceDocumentDetail: licenceDocumentDetail }
  },
  licenceDocumentDetailFailure (state, error) {
    state.licenceDocumentDetail = { error }
  },

  //Licence Products

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

  licenceProductDetailRequest (state) {
    state.licenceProductDetail = { loading: true }
  },
  licenceProductDetailSuccess (state, licenceProductDetail) {
    state.licenceProductDetail = { licenceProductDetail: licenceProductDetail }
  },
  licenceProductDetailFailure (state, error) {
    state.licenceProductDetail = { error }
  },


  //Get Tax Rate and Product Charge Type
  getAllTaxRateRequest (state) {
    state.taxRates = { loading: true }
  },
  getAllTaxRateSuccess (state, taxRates) {
    state.taxRates = { taxRates: taxRates }
  },
  getAllTaxRateFailure (state, error) {
    state.taxRates = { error }
  },

  getAllProductChargeTypeRequest (state) {
    state.productChargeTypes = { loading: true }
  },
  getAllProductChargeTypeSuccess (state, productChargeTypes) {
    state.productChargeTypes = { productChargeTypes: productChargeTypes }
  },
  getAllProductChargeTypeFailure (state, error) {
    state.productChargeTypes = { error }
  },

  createSiteProductRequest (state) {
    state.siteProduct = { loading: true }
  },
  createSiteProductSuccess (state, siteProduct) {
    state.siteProduct = { siteProduct: siteProduct }
  },
  createSiteProductFailure (state, error) {
    state.siteProduct = { error }
  },

  createSiteProductPricingRequest (state) {
    state.siteProductPricing = { loading: true }
  },
  createSiteProductPricingSuccess (state, siteProductPricing) {
    state.siteProductPricing = { siteProductPricing: siteProductPricing }
  },
  createSiteProductPricingFailure (state, error) {
    state.siteProductPricing = { error }
  },

  updateSiteProductPricingRequest (state) {
    state.siteProductPricing = { loading: true }
  },
  updateSiteProductPricingSuccess (state, siteProductPricing) {
    state.siteProductPricing = { siteProductPricing: siteProductPricing }
  },
  updateSiteProductPricingFailure (state, error) {
    state.siteProductPricing = { error }
  },
}

export const sites = {
  namespaced: true,
  state,
  actions,
  mutations
}
