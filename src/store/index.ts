import { alert } from './alertModule'
import { account } from './accountModule'
import { users } from './usersModule'
import { clients } from './clientsModule'
import { sites } from './sitesModule'
import { products } from './productsModule'
import { licences } from './licencesModule'
import { invoices } from './invoicesModule'
import { zones } from './zonesModule'
import { charges } from './chargesModule'
import { permissions } from './permissionsModule'
import { payments } from './paymentsModule'
import { floorplans } from './floorplansModule'
import { roomReservations } from './roomReservationsModule'
import { reports } from './reportsModule'

import { createStore } from 'vuex'

const store = createStore({
  modules: {
    alert,
    account,
    users,
    clients,
    sites,
    products,
    licences,
    invoices,
    zones,
    charges,
    permissions,
    payments,
    floorplans,
    roomReservations,
    reports
  }
})

export default store
