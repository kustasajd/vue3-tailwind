import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const clientService = {
  getAll,  
  getById,
  create,
  update,
  getAllClientGroupTypes,
  getGroupById,
  createClientGroup,
  deleteClientGroup,
  createClientUser,
  deleteClientUser,
  getUserById,
  getSiteClients,
}

//client
function getAll (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/clients/all/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getById (clientId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/clients/${clientId}`, requestOptions).then(
    handleResponse
  )
}

function create (client) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  }

  return fetch(`${config.apiUrl}/clients/create`, requestOptions).then(
    handleResponse
  )
}

function update (client) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  }

  return fetch(`${config.apiUrl}/clients/${client.clientId}`, requestOptions).then(
    handleResponse
  )
}

function getSiteClients (clientId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/clients/siteClients/${clientId}`, requestOptions).then(
    handleResponse
  )
}

//client group types
function getAllClientGroupTypes () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/clientGroupTypes`, requestOptions).then(handleResponse)
}

//Client Groups
function getGroupById (clientId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/clientGroups/groups/${clientId}`, requestOptions).then(
    handleResponse
  )
}

function createClientGroup (clientGroup) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(clientGroup)
  }

  return fetch(`${config.apiUrl}/clientGroups/create`, requestOptions).then(
    handleResponse
  )
}

function deleteClientGroup (clientGroup) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(clientGroup)
  }

  return fetch(`${config.apiUrl}/clientGroups/delete`, requestOptions).then(
    handleResponse
  )
}


//Client users
function createClientUser (clientUser) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(clientUser)
  }

  return fetch(`${config.apiUrl}/clientUsers/create`, requestOptions).then(
    handleResponse
  )
}

function deleteClientUser (clientUser) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(clientUser)
  }

  return fetch(`${config.apiUrl}/clientUsers/delete`, requestOptions).then(
    handleResponse
  )
}

function getUserById (clientId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/clientUsers/users/${clientId}`, requestOptions).then(
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
        location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
