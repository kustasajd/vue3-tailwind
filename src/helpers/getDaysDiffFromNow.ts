import moment from 'moment'

export function getDaysDiffFromNow (date) {
  if (date) {
    const start = moment(new Date()).format("YYYY-MM-DD");
    const end = moment(date).format("YYYY-MM-DD");
    let number = (moment(end).diff(moment(start), 'days'))
    return number
  } else {
    return 0
  }
}
