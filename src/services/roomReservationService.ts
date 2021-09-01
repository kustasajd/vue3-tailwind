import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const roomReservationService = {
  getAll,  
  getById,
  create,
  update,
  updateTime,
  getZones
}

function getAll (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/roomReservations/getAll/${id}`, requestOptions).then(handleResponse)
}

function getById (roomReservationId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/roomReservations/${roomReservationId}`, requestOptions).then(
    handleResponse
  )
}

function create (roomReservation) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(roomReservation)
  }

  return fetch(`${config.apiUrl}/roomReservations/create`, requestOptions).then(
    handleResponse
  )
}

function update (roomReservation) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(roomReservation)
  }

  return fetch(`${config.apiUrl}/roomReservations/${roomReservation.roomReservationId}`, requestOptions).then(
    handleResponse
  )
}

function updateTime (roomReservation) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(roomReservation)
  }

  return fetch(`${config.apiUrl}/roomReservations/updateTime/${roomReservation.roomReservationId}`, requestOptions).then(
    handleResponse
  )
}

function getZones (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/roomReservations/zones/${id}`, requestOptions).then(handleResponse)
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
