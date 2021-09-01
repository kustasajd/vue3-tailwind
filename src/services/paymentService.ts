import Data from '../../config'
const config = Data

import { authHeader, logout } from '../helpers/index'

export const paymentService = {
  getAll,
  create,
  getPaymentTypes
}

function getAll (id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/payments/${id}/all`, requestOptions).then(handleResponse)
}

function create (payment) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  }

  return fetch(`${config.apiUrl}/payments/create`, requestOptions).then(
    handleResponse
  )
}

function getPaymentTypes () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/payments/paymentTypes`, requestOptions).then(handleResponse)
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
