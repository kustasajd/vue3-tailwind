export function removeDuplicates (data, property) {
  let unique = []
  data.forEach(element => {
    if (
      unique.filter(item => {
        return item[property] === element[property]
      }).length === 0
    ) {
      unique.push(element)
    }
  })
  return unique
}
