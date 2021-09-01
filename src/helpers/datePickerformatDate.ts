import moment from 'moment'

export function datePickerformatDate (date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD')
  } else {
    return '-'
  }
}
