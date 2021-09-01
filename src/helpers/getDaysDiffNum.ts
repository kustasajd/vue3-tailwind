import moment from 'moment'

export function getDaysDiffNum (startDate, endDate) {
  if (startDate && endDate) {
    const start = moment(startDate).format("YYYY-MM-DD");
    const end = moment(endDate).format("YYYY-MM-DD");
    let number = (moment(end).diff(moment(start), 'days'))
    return number
  } else {
    return 0
  }
}
