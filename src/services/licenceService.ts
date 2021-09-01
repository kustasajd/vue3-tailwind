import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const licenceService = {
  getLicenceBySite,
  getZones,
  getById,
  getHistory,
  create,
  getLicenceStatusType,
  getLicencesbyClient,
  exportPdf,
  update,
  getLicenceType,
  getLicenceProductType,
  createLicenceProduct,
  updateLicenceProduct,
  deleteLicenceProduct,
  createLicenceDocument,
  getLicenceDocumentDetail,
  getLicenceProductDetail,
  getLicenceZonesByClient,
  terminate
}

function getLicenceBySite (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/licences/all/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getZones (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/licences/zones/${id}`, requestOptions).then(handleResponse)
}

function getById (licenceId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/licences/${licenceId}`, requestOptions).then(
    handleResponse
  )
}

function getHistory (licenceId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/licences/history/${licenceId}`, requestOptions).then(
    handleResponse
  )
}

function create (licence) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(licence)
  }

  return fetch(`${config.apiUrl}/licences/create`, requestOptions).then(
    handleResponse
  )
}

function update (licence) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(licence)
  }

  return fetch(`${config.apiUrl}/licences/${licence.licenceId}`, requestOptions).then(
    handleResponse
  )
}

function getLicencesbyClient (clientId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/licences/getByClient/${clientId}`, requestOptions).then(
    handleResponse
  )
}

function getLicenceStatusType () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/licenceStatusTypes`, requestOptions).then(handleResponse)
}

function exportPdf (pdf) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(pdf)
  }

  return fetch(`${config.apiUrl}/licences/exportPdf`, requestOptions).then(
    handleResponse
  )
}

function getLicenceType () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/licences/getLicenceType`, requestOptions).then(handleResponse)
}

function getLicenceProductType () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/licences/getLicenceProductType`, requestOptions).then(handleResponse)
}

function createLicenceProduct (licenceProduct) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceProduct)
  }

  return fetch(`${config.apiUrl}/licences/licenceProduct/create`, requestOptions).then(
    handleResponse
  )
}

function updateLicenceProduct (licenceProduct) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(licenceProduct)
  }

  return fetch(`${config.apiUrl}/licences/licenceProduct/${licenceProduct.licenceProductId}`, requestOptions).then(
    handleResponse
  )
}

function deleteLicenceProduct (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/licences/deleteLicenceProduct/${id}`, requestOptions).then(
    handleResponse
  )
}

function createLicenceDocument (licenceDocument) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceDocument)
  }

  return fetch(`${config.apiUrl}/licences/licenceDocument/create`, requestOptions).then(
    handleResponse
  )
}

function getLicenceDocumentDetail (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/licences/licenceDocuments/${id}/detail`, requestOptions).then(
    handleResponse
  )
}

function getLicenceProductDetail (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/licences/licenceProducts/${id}/detail`, requestOptions).then(
    handleResponse
  )
}

function getLicenceZonesByClient (data) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  return fetch(`${config.apiUrl}/licences/${data.siteId}/zones/${data.clientId}`, requestOptions).then(
    handleResponse
  )
}

function terminate (terminateDetail) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(terminateDetail)
  }

  return fetch(`${config.apiUrl}/licences/terminate`, requestOptions).then(
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
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
