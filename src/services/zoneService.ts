import Data from '../../config'
const config = Data

import { authHeader } from '../helpers/index'

export const zoneService = {
  getZonesBySite,  
  getById,
  create,
  update,
  getZoneTypes,
  createSiteZoneRate,
  deleteSiteZoneRate,
  createLicenceZone,
  getLicenceZone,
  updateLicenceZone,
  deleteLicenceZone
}

//zone
function getZonesBySite (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/zones/${id}/all`, requestOptions).then(handleResponse)
}

function getById (siteZoneId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/zones/${siteZoneId}`, requestOptions).then(
    handleResponse
  )
}

function create (zone) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(zone)
  }

  return fetch(`${config.apiUrl}/zones/create`, requestOptions).then(
    handleResponse
  )
}

function update (zone) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(zone)
  }

  return fetch(`${config.apiUrl}/zones/${zone.siteZoneId}`, requestOptions).then(
    handleResponse
  )
}

function getZoneTypes () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/zones/zoneTypes`, requestOptions).then(handleResponse)
}

function createSiteZoneRate (siteZoneRate) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteZoneRate)
  }

  return fetch(`${config.apiUrl}/zones/siteZoneRate/create`, requestOptions).then(
    handleResponse
  )
}

function deleteSiteZoneRate (siteZoneRate) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(siteZoneRate)
  }

  return fetch(`${config.apiUrl}/zones/siteZoneRate/delete`, requestOptions).then(
    handleResponse
  )
}

function createLicenceZone (licenceZone) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(licenceZone)
  }

  return fetch(`${config.apiUrl}/zones/licenceZone/create`, requestOptions).then(
    handleResponse
  )
}

function getLicenceZone (licenceZoneId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/zones/licenceZone/${licenceZoneId}`, requestOptions).then(
    handleResponse
  )
}

function updateLicenceZone (licenceZone) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(licenceZone)
  }

  return fetch(`${config.apiUrl}/zones/licenceZone/${licenceZone.licenceZoneId}`, requestOptions).then(
    handleResponse
  )
}

function deleteLicenceZone (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/zones/deleteLicenceZone/${id}`, requestOptions).then(
    handleResponse
  )
}

//common
function logout () {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}

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
