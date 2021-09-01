export function getPermission (siteId) {
  const selSiteId = parseInt(JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId)
  return parseInt(siteId) === selSiteId
}
