import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const chargeService = {
  getById,
  filter,
  create,
  getDetail,
  update,
  deleteCharge
}

function getById (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/charges/all/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function filter (params) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(params)
  }
  return fetch(`${config.apiUrl}/charges/filtered`, requestOptions).then(
    handleResponse
  )
}

function create (charge) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(charge)
  }

  return fetch(`${config.apiUrl}/charges/create`, requestOptions).then(
    handleResponse
  )
}

function getDetail (chargeRegisterId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/charges/${chargeRegisterId}`, requestOptions).then(
    handleResponse
  )
}

function update (charge) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(charge)
  }

  return fetch(`${config.apiUrl}/charges/${charge.chargeRegisterId}`, requestOptions).then(
    handleResponse
  )
}

function deleteCharge (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/charges/${id}`, requestOptions).then(
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
