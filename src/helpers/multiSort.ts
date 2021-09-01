export function multiSort (data, property1, property2) {
  return data.sort(function (a, b) {
    return (
      a[property1].localeCompare(b[property1]) || b[property2] - a[property2]
    )
  })
}
