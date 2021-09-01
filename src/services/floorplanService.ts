import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const floorplanService = {
  getById,
  update,
  updateSite
}

function getById (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/floorplans/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function update (site) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(site)
  }

  return fetch(
    `${config.apiUrl}/floorplans/${site.siteId}`,
    requestOptions
  ).then(handleResponse)
}

function updateSite (site) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(site)
  }

  return fetch(
    `${config.apiUrl}/floorplans/updateSite/${site.siteId}`,
    requestOptions
  ).then(handleResponse)
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
