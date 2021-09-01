import moment from 'moment'

export function getDate (date) {
  if (date) return moment(date).format('YYYY-MM-DD')
  else return '-'
}
