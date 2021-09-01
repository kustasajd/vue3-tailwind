import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const productService = {
  getAll,  
  getProductsBySiteId,
  getById,
  update,
  create,
  getSiteProducts,
  createSite,
}

//product
function getAll () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/products`, requestOptions).then(handleResponse)
}

function getProductsBySiteId (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/products/all/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getSiteProducts (productId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/products/site/${productId}`, requestOptions).then(
    handleResponse
  )
}

function getById (productId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/products/${productId}`, requestOptions).then(
    handleResponse
  )
}

function update (product) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }

  return fetch(`${config.apiUrl}/products/${product.productId}`, requestOptions).then(
    handleResponse
  )
}

function create (product) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }

  return fetch(`${config.apiUrl}/products/create`, requestOptions).then(
    handleResponse
  )
}

function createSite (siteProduct) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(siteProduct)
  }

  return fetch(`${config.apiUrl}/products/site/create`, requestOptions).then(
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
