import moment from 'moment'

export function formatDate (date) {
  if (date) {
    return moment(date).format('DD/MM/YYYY')
  } else {
    return '-'
  }
}
