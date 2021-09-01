import Data from '../../config'
const config = Data

import { authHeader } from '../helpers/index'

export const permissionService = {
  getAll, 
  getById,
  addUserRolePermission,
  deleteUserRolePermission
}

//permission
function getAll () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/permissions`, requestOptions).then(handleResponse)
}

function getById (permissionId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/permissions/${permissionId}`, requestOptions).then(
    handleResponse
  )
}

function addUserRolePermission (userRolePermission) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(userRolePermission)
  }

  return fetch(`${config.apiUrl}/permissions/addUserRolePermission`, requestOptions).then(
    handleResponse
  )
}

function deleteUserRolePermission (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/permissions/deleteUserRolePermission/${id}`, requestOptions).then(
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
