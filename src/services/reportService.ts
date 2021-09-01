import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const reportService = {
  getClients,
  getLicences,
  getZones  
}

function getClients (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/reports/clients/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getLicences (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/reports/licences/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getZones (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/reports/zones/${id}`, requestOptions).then(handleResponse)
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
