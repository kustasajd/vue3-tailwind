import { invoiceService } from '../services'

const state = {
  invoices: {},
  invoice: {},
  outstandingClients: [],
  outStandings: [],
  pdf: {},
  pdfs: {},
  invoicesbyClient: {},
  generatedInvoices: {},
  invoiceStatusTypes: {}
}

const actions = {

  create ({ dispatch, commit }, invoice) {
    commit('createRequest', { invoice })

    invoiceService.create(invoice).then(
      invoice => {
        commit('createSuccess', invoice)
        dispatch('alert/success', 'Create successful', { root: true })
      },
      error => {
        commit('createFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getById ({ dispatch, commit }, { id }) {
    commit('getByIdRequest', { id })

    invoiceService.getById(id).then(
      invoices => {
        commit('getByIdSuccess', invoices)
      },
      error => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  filter ({ dispatch, commit }, query) {
    commit('filterRequest', { query })

    invoiceService.filter(query).then(
      invoices => {
        commit('filterSuccess', invoices)
      },
      error => {
        commit('filterFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getDetailById ({ dispatch, commit }, { id }) {
    commit('getDetailByIdRequest', { id })

    invoiceService.getDetailById(id).then(
      invoice => {
        commit('getDetailByIdSuccess', invoice)
      },
      error => {
        commit('getDetailByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  deleteInvoice ({ dispatch, commit }, { id }) {
    commit('deleteInvoiceRequest', { id })

    invoiceService.deleteInvoice(id).then(
      invoice => {
        commit('deleteInvoiceSuccess', invoice)
        dispatch('alert/success', 'Delete successful', { root: true })
      },
      error => {
        commit('deleteInvoiceFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getOutstandingClients ({ dispatch, commit }, { id }) {
    commit('getOutstandingClientsRequest', { id })

    invoiceService.getOutstandingClients(id).then(
      outstandingClients => {
        commit('getOutstandingClientsSuccess', outstandingClients)
      },
      error => {
        commit('getOutstandingClientsFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getOutStandings ({ dispatch, commit }, data) {
    commit('getOutStandingsRequest', { data })

    invoiceService.getOutStandings(data).then(
      outStandings => {
        commit('getOutStandingsSuccess', outStandings)
      },
      error => {
        commit('getOutStandingsFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  exportPdf ({ dispatch, commit }, pdf) {
    commit('exportPdfRequest', { pdf })

    invoiceService.exportPdf(pdf).then(
      pdf => {
        commit('exportPdfSuccess', pdf)
        dispatch('alert/success', 'Upload successful', { root: true })
      },
      error => {
        commit('exportPdfFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  exportPdfs ({ dispatch, commit }, pdfs) {
    commit('exportPdfsRequest', { pdfs })

    invoiceService.exportPdfs(pdfs).then(
      pdfs => {
        commit('exportPdfsSuccess', pdfs)
        dispatch('alert/success', 'Upload successful', { root: true })
      },
      error => {
        commit('exportPdfsFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  downloadPdf ({ dispatch, commit }, pdf) {
    commit('downloadPdfRequest', { pdf })

    invoiceService.downloadPdf(pdf).then(
      pdf => {
        commit('downloadPdfSuccess', pdf)
        dispatch('alert/success', 'Download successful', { root: true })
      },
      error => {
        commit('downloadPdfFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getInvoicesbyClient ({ dispatch, commit }, data) {
    commit('getInvoicesbyClientRequest', { data })

    invoiceService.getInvoicesbyClient(data).then(
      invoicesbyClient => {
        commit('getInvoicesbyClientSuccess', invoicesbyClient)
      },
      error => {
        commit('getInvoicesbyClientFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  generateInvoices ({ dispatch, commit }, generatedInvoices) {
    commit('generateInvoicesRequest', { generatedInvoices })

    invoiceService.generateInvoices(generatedInvoices).then(
      generatedInvoices => {
        commit('generateInvoicesSuccess', generatedInvoices)
        dispatch('alert/success', 'generate successful', { root: true })
      },
      error => {
        commit('generateInvoicesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

  getAllInvoiceStatusTypes ({ dispatch, commit }) {
    commit('getAllInvoiceStatusTypesRequest')

    invoiceService.getAllInvoiceStatusTypes().then(
      invoiceStatusTypes => commit('getAllInvoiceStatusTypesSuccess', invoiceStatusTypes),
      error => {
        commit('getAllInvoiceStatusTypesFailure', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },

}

const mutations = {

  createRequest (state) {
    state.invoice = { loading: true }
  },
  createSuccess (state, invoice) {
    state.invoice = {invoice : invoice}
  },
  createFailure (state, error) {
    state.invoice = { error }
  },

  getByIdRequest (state) {
    state.invoices = { loading: true }
  },
  getByIdSuccess (state, invoices) {
    state.invoices = { invoices: invoices }
  },
  getByIdFailure (state, error) {
    state.invoices = { error }
  },

  filterRequest (state) {
    state.invoices = { loading: true }
  },
  filterSuccess (state, invoices) {
    state.invoices = { invoices: invoices }
  },
  filterFailure (state, error) {
    state.invoices = { error }
  },

  getDetailByIdRequest (state) {
    state.invoice = { loading: true }
  },
  getDetailByIdSuccess (state, invoice) {
    state.invoice = { invoice: invoice }
  },
  getDetailByIdFailure (state, error) {
    state.invoice = { error }
  },

  deleteInvoiceRequest (state) {
    state.invoice = { loading: true }
  },
  deleteInvoiceSuccess (state, invoice) {
    state.invoice = { invoice: invoice }
  },
  deleteInvoiceFailure (state, error) {
    state.invoice = { error }
  },

  getOutstandingClientsRequest (state) {
    state.outstandingClients = { loading: true }
  },
  getOutstandingClientsSuccess (state, outstandingClients) {
    state.outstandingClients = { outstandingClients: outstandingClients }
  },
  getOutstandingClientsFailure (state, error) {
    state.outstandingClients = { error }
  },

  getOutStandingsRequest (state) {
    state.outStandings = { loading: true }
  },
  getOutStandingsSuccess (state, outStandings) {
    state.outStandings = { outStandings: outStandings }
  },
  getOutStandingsFailure (state, error) {
    state.outStandings = { error }
  },

  exportPdfRequest (state) {
    state.pdf = { loading: true }
  },
  exportPdfSuccess (state, pdf) {
    state.pdf = { pdf: pdf }
  },
  exportPdfFailure (state, error) {
    state.pdf = { error }
  },

  exportPdfsRequest (state) {
    state.pdfs = { loading: true }
  },
  exportPdfsSuccess (state, pdfs) {
    state.pdfs = { pdfs: pdfs }
  },
  exportPdfsFailure (state, error) {
    state.pdfs = { error }
  },

  downloadPdfRequest (state) {
    state.pdf = { loading: true }
  },
  downloadPdfSuccess (state, pdf) {
    state.pdf = { pdf: pdf }
  },
  downloadPdfFailure (state, error) {
    state.pdf = { error }
  },

  getInvoicesbyClientRequest (state) {
    state.invoicesbyClient = { loading: true }
  },
  getInvoicesbyClientSuccess (state, invoicesbyClient) {
    state.invoicesbyClient = { invoicesbyClient: invoicesbyClient }
  },
  getInvoicesbyClientFailure (state, error) {
    state.invoicesbyClient = { error }
  },

  generateInvoicesRequest (state) {
    state.generatedInvoices = { loading: true }
  },
  generateInvoicesSuccess (state, generatedInvoices) {
    state.generatedInvoices = { generatedInvoices: generatedInvoices }
  },
  generateInvoicesFailure (state, error) {
    state.generatedInvoices = { error }
  },

  getAllInvoiceStatusTypesRequest (state) {
    state.invoiceStatusTypes = { loading: true }
  },
  getAllInvoiceStatusTypesSuccess (state, invoiceStatusTypes) {
    state.invoiceStatusTypes = { invoiceStatusTypes: invoiceStatusTypes }
  },
  getAllInvoiceStatusTypesFailure (state, error) {
    state.invoiceStatusTypes = { error }
  },

}

export const invoices = {
  namespaced: true,
  state,
  actions,
  mutations
}
