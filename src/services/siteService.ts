import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const siteService = {
  getAll,  
  getCurrencies,
  getById,
  getSiteLogo,
  update,
  createSiteUser,
  updateSiteUser,
  deleteSiteUser,
  getUserById,
  createSiteClient,
  deleteSiteClient,
  getClientById,
  getSitesByClient,
  getSiteProductsBySiteId,
  getSiteProductById,
  getSiteProductPricingById,
  getSiteProductPricing,
  getLicenceTemplate,
  licenceTemplateDetail,
  createLicenceTemplate,
  updateLicenceTemplate,
  createSiteLicenceDocument,
  updateSiteLicenceDocument,
  siteLicenceDocumentDetail,
  createSiteLicenceProduct,
  updateSiteLicenceProduct,
  siteLicenceProductDetail,
  getAllTaxRate,
  getAllProductChargeType,
  createSiteProduct,
  createSiteProductPricing,
  updateSiteProductPricing
}

//site
function getAll () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/sites`, requestOptions).then(handleResponse)
}

function getCurrencies () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/currencies`, requestOptions).then(handleResponse)
}

function getById (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getSiteLogo (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/logo/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function update (site) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(site)
  }

  return fetch(`${config.apiUrl}/sites/${site.siteId}`, requestOptions).then(
    handleResponse
  )
}

//Site users
function createSiteUser (siteUser) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteUser)
  }

  return fetch(`${config.apiUrl}/sites/createUser`, requestOptions).then(
    handleResponse
  )
}

function updateSiteUser (siteUser) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteUser)
  }

  return fetch(`${config.apiUrl}/sites/updateUser`, requestOptions).then(
    handleResponse
  )
}

function deleteSiteUser (siteUser) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteUser)
  }

  return fetch(`${config.apiUrl}/sites/deleteUser`, requestOptions).then(
    handleResponse
  )
}

function getUserById (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/users/${siteId}`, requestOptions).then(
    handleResponse
  )
}

//Site clients
function createSiteClient (siteClient) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteClient)
  }

  return fetch(`${config.apiUrl}/sites/createClient`, requestOptions).then(
    handleResponse
  )
}

function deleteSiteClient (siteClient) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteClient)
  }

  return fetch(`${config.apiUrl}/sites/deleteClient`, requestOptions).then(
    handleResponse
  )
}

function getClientById (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/clients/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getSitesByClient (clientId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/siteClients/${clientId}`, requestOptions).then(
    handleResponse
  )
}

//sit product

function getSiteProductsBySiteId (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/products/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getSiteProductById (siteId, siteProductId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/${siteId}/siteProduct/${siteProductId}`, requestOptions).then(
    handleResponse
  )
}

function getSiteProductPricingById (siteId, siteProductPricingId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/${siteId}/siteProductPricing/${siteProductPricingId}`, requestOptions).then(
    handleResponse
  )
}

function getSiteProductPricing (siteProduct) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteProduct)
  }
  return fetch(`${config.apiUrl}/sites/productPricing/`, requestOptions).then(
    handleResponse
  )
}

//siteLicenceTemplates

function getLicenceTemplate (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/sites/licenceTemplates/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function licenceTemplateDetail (licenceTemplate) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceTemplate)
  }

  return fetch(`${config.apiUrl}/sites/licenceTemplate/detail`, requestOptions).then(
    handleResponse
  )
}

function createLicenceTemplate (licenceTemplate) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceTemplate)
  }

  return fetch(`${config.apiUrl}/sites/licenceTemplate/create`, requestOptions).then(
    handleResponse
  )
}

function updateLicenceTemplate (licenceTemplate) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceTemplate)
  }

  return fetch(`${config.apiUrl}/sites/licenceTemplate/update`, requestOptions).then(
    handleResponse
  )
}

// SiteLicenceDocument

function createSiteLicenceDocument (licenceDocument) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceDocument)
  }

  return fetch(`${config.apiUrl}/sites/siteLicenceDocuments/create`, requestOptions).then(
    handleResponse
  )
}

function updateSiteLicenceDocument (licenceDocument) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceDocument)
  }

  return fetch(`${config.apiUrl}/sites/siteLicenceDocuments/update`, requestOptions).then(
    handleResponse
  )
}

function siteLicenceDocumentDetail (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/sites/siteLicenceDocuments/${id}/detail`, requestOptions).then(
    handleResponse
  )
}

// SiteLicenceProduct

function createSiteLicenceProduct (licenceProduct) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceProduct)
  }

  return fetch(`${config.apiUrl}/sites/siteLicenceProducts/create`, requestOptions).then(
    handleResponse
  )
}

function updateSiteLicenceProduct (licenceProduct) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceProduct)
  }

  return fetch(`${config.apiUrl}/sites/siteLicenceProducts/update`, requestOptions).then(
    handleResponse
  )
}

function siteLicenceProductDetail (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/sites/siteLicenceProducts/${id}/detail`, requestOptions).then(
    handleResponse
  )
}

// Get Tax Rate and Product Charge Type

function getAllTaxRate () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/taxRates`, requestOptions).then(handleResponse)
}

function getAllProductChargeType () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/productChargeTypes`, requestOptions).then(handleResponse)
}

function createSiteProduct (siteProduct) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteProduct)
  }

  return fetch(`${config.apiUrl}/sites/createProduct`, requestOptions).then(
    handleResponse
  )
}

function createSiteProductPricing (siteProductPricing) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteProductPricing)
  }

  return fetch(`${config.apiUrl}/sites/createProductPricing`, requestOptions).then(
    handleResponse
  )
}

function updateSiteProductPricing (siteProductPricing) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(siteProductPricing)
  }

  return fetch(`${config.apiUrl}/sites/updateProductPricing/${siteProductPricing.siteProductPricingId}`, requestOptions).then(
    handleResponse
  )
}

//common
function handleResponse (response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        // auto logout if 403 response returned from api
        logout()
        location.reload(true)
      } else if (response.status === 400) {
        // location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
