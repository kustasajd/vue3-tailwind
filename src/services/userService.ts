import Data from '../../config'
const config = Data

import { authHeader } from '../helpers/index'
import moment from 'moment'

export const userService = {
  login,
  logout,
  getAll,
  getById,
  update,
  getAllUserRoleTypes,
  getAllClientUserTypes,
  create,
  getSites
}

function login (email, password) {
  let lastLogin = moment().format('YYYY-MM-DD, h:mm a')
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, lastLogin })
  }

  return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user.user.lastLogin) localStorage.setItem('lastLogin', JSON.stringify(user.user.lastLogin))
        localStorage.setItem('user', JSON.stringify(user))
      }

      return user
    })
}

function logout () {
  localStorage.removeItem('user')
}

function getAll (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/users/all/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getById (userId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/users/${userId}`, requestOptions).then(
    handleResponse
  )
}

function update (user) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }

  return fetch(`${config.apiUrl}/users/${user.userId}`, requestOptions).then(
    handleResponse
  )
}

//U1ser Role types
function getAllUserRoleTypes () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/userRoleTypes`, requestOptions).then(handleResponse)
}

//create user
function getAllClientUserTypes () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/clientUserTypes`, requestOptions).then(handleResponse)
}

function create (user) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(user)
  }

  return fetch(`${config.apiUrl}/users/create`, requestOptions).then(
    handleResponse
  )
}

function getSites (userId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/users/sites/${userId}`, requestOptions).then(
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
