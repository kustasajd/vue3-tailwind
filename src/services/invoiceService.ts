import Data from '../../config'
const config = Data

import { authHeader } from '../helpers/index'

export const invoiceService = {
  create,
  getById,
  filter,
  getDetailById,
  deleteInvoice,
  getOutstandingClients,
  getOutStandings,
  exportPdf,
  exportPdfs,
  downloadPdf,
  getInvoicesbyClient,
  generateInvoices,
  getAllInvoiceStatusTypes
}

function create (invoice) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice)
  }

  return fetch(`${config.apiUrl}/invoices/create`, requestOptions).then(
    handleResponse
  )
}

function getById (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/invoices/all/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function filter (query) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(query)
  }
  return fetch(`${config.apiUrl}/invoices/filter`, requestOptions).then(
    handleResponse
  )
}

function getDetailById (invoiceId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/invoices/${invoiceId}`, requestOptions).then(
    handleResponse
  )
}

function deleteInvoice (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${config.apiUrl}/invoices/deleteInvoice/${id}`, requestOptions).then(
    handleResponse
  )
}

function getOutstandingClients (siteId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/invoices/outstandingClients/${siteId}`, requestOptions).then(
    handleResponse
  )
}

function getOutStandings (data) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  return fetch(`${config.apiUrl}/invoices/${data.siteId}/generate/${data.clientId}`, requestOptions).then(
    handleResponse
  )
}

function exportPdf (pdf) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(pdf)
  }

  return fetch(`${config.apiUrl}/invoices/exportPdf`, requestOptions).then(
    handleResponse
  )
}

function exportPdfs (pdfs) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(pdfs)
  }

  return fetch(`${config.apiUrl}/invoices/exportPdfs`, requestOptions).then(
    handleResponse
  )
}

function downloadPdf (pdf) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(pdf)
  }

  return fetch(`${config.apiUrl}/invoices/downloadPdf`, requestOptions).then(
    handleResponse
  )
}

function getInvoicesbyClient (data) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  return fetch(`${config.apiUrl}/invoices/${data.siteId}/getByClient/${data.clientId}`, requestOptions).then(
    handleResponse
  )
}

function generateInvoices (outstandingClients) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(outstandingClients)
  }

  return fetch(`${config.apiUrl}/invoices/generate`, requestOptions).then(
    handleResponse
  )
}

function getAllInvoiceStatusTypes () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/invoices/invoiceStatusTypes`, requestOptions).then(handleResponse)
}

//common
function logout () {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}

function handleResponse (response) {
  return response.text().then(text => {
    try {
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
    } catch (error) {
      if (text) return text
    }
  })
}
