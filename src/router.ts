import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import permissionNames from "./helpers/permissionNames";

import Login from "./views/auth/Login.vue";
import Profile from "./views/auth/Profile.vue";
import SiteSelect from "./views/auth/SiteSelect.vue";
import Dashboard from "./views/Dashboard.vue";
import NoPermission from "./views/NoPermission.vue";

import Permissions from "./views/permission/Permissions.vue"
import PermissionDetail from "./views/permission/PermissionDetail.vue"
import AkaraAdmin from "./views/AkaraAdmin.vue";

import Users from "./views/users/Users.vue";
import UserDetail from "./views/users/UserDetail.vue";
import UpdateUser from "./views/users/UpdateUser.vue";
import AddUser from "./views/users/AddUser.vue";

import Clients from "./views/client/Clients.vue";
import ClientDetail from "./views/client/ClientDetail.vue";
import UpdateClient from "./views/client/UpdateClient.vue";
import CreateClient from "./views/client/CreateClient.vue";
import CreateClientUser from "./views/client/CreateClientUser.vue";

import Sites from "./views/site/Sites.vue";
import SiteDetail from "./views/site/SiteDetail.vue";
import UpdateSite from "./views/site/UpdateSite.vue";
import SiteProducts from "./views/site/SiteProducts.vue"
import SiteProductPricing from "./views/site/SiteProductPricing.vue"
import AddSiteProduct from "./views/site/AddSiteProduct.vue";
import AddProductPricing from "./views/site/AddProductPricing.vue";
import UpdateProductPricing from "./views/site/UpdateProductPricing.vue";

import Products from "./views/product/Products.vue";
import ProductDetail from "./views/product/ProductDetail.vue";
import UpdateProduct from "./views/product/UpdateProduct.vue";
import CreateProduct from "./views/product/CreateProduct.vue";

import LicenceTemplates from "./views/licence/LicenceTemplates.vue"
import CreateLicenceTemplate from "./views/licence/CreateLicenceTemplate.vue"
import LicenceTemplateDetail from "./views/licence/LicenceTemplateDetail.vue"
import UpdateLicenceTemplate from "./views/licence/UpdateLicenceTemplate.vue"
import CreateSiteLicenceProduct from "./views/licence/CreateSiteLicenceProduct.vue"
import UpdateSiteLicenceProduct from "./views/licence/UpdateSiteLicenceProduct.vue"
import CreateSiteLicenceDocument from "./views/licence/CreateSiteLicenceDocument.vue"
import UpdateSiteLicenceDocument from "./views/licence/UpdateSiteLicenceDocument.vue"
import Licences from "./views/licence/Licences.vue";
import LicenceDetail from "./views/licence/LicenceDetail.vue";
import LicencePdf from "./views/licence/LicencePdf.vue";
import AddLicence from "./views/licence/AddLicence.vue";
import UpdateLicence from "./views/licence/UpdateLicence.vue";
import CreateLicenceZone from "./views/licence/CreateLicenceZone.vue";
import UpdateLicenceZone from "./views/licence/UpdateLicenceZone.vue";
import CreateLicenceDocument from "./views/licence/CreateLicenceDocument.vue"
import CreateLicenceProduct from "./views/licence/CreateLicenceProduct.vue"
import UpdateLicenceProduct from "./views/licence/UpdateLicenceProduct.vue"
import LicenceTerminate from "./views/licence/LicenceTerminate.vue";

import Invoices from "./views/invoice/Invoices.vue";
import InvoiceDetail from "./views/invoice/InvoiceDetail.vue";
import UpdateInvoice from "./views/invoice/UpdateInvoice.vue";
import GenerateInvoice from "./views/invoice/GenerateInvoice.vue";
import GenerateByClient from "./views/invoice/GenerateByClient.vue";
import InvoicePdf from "./views/invoice/InvoicePdf.vue";
import GenerateCharge from "./views/invoice/GenerateCharge.vue"

import Zones from "./views/zones/Zones.vue";
import ZoneDetail from "./views/zones/ZoneDetail.vue";
import UpdateZone from "./views/zones/UpdateZone.vue";
import AddZone from "./views/zones/AddZone.vue";

import Charges from "./views/chargeRegister/Charges.vue";
import AddCharge from "./views/chargeRegister/AddCharge.vue";
import UpdateCharge from "./views/chargeRegister/UpdateCharge.vue";

import Payments from "./views/payment/Payments.vue";
import CreatePayment from "./views/payment/CreatePayment.vue";

import Reports from "./views/report/Reports.vue";
import Report1 from "./views/report/Report1.vue";
import Report2 from "./views/report/Report2.vue";
import Report3 from "./views/report/Report3.vue";
import Report4 from "./views/report/Report4.vue";

import Floorplans from "./views/floorPlan/FloorPlans.vue";
import UpdateFloorplan from "./views/floorPlan/UpdateFloorPlan.vue";

import RoomReservations from "./views/roomReservation/RoomReservations.vue";
import RoomReservationDetail from "./views/roomReservation/RoomReservationDetail.vue";
import UpdateRoomReservation from "./views/roomReservation/UpdateRoomReservation.vue";
import CreateRoomReservation from "./views/roomReservation/CreateRoomReservation.vue";


import NotFound from "./views/NotFound.vue";

const routes: RouteRecordRaw[] = [

  // Auth
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { 
      layout: "empty",
      title: 'Login'
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: "/site-select",
    name: "SiteSelect",
    component: SiteSelect,
    meta: { 
      layout: "empty",
      title: 'SiteSelect'
    },
  },

  // Dashboard
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: 'Dashboard'
    }
  },
  // NoPermission
  {
    path: "/no-permission",
    name: "NoPermission",
    component: NoPermission,
    meta: {
      title: 'NoPermission'
    }
  },

  {
    path: "/permissions",
    name: "Permissions",
    component: Permissions,
    meta: {
      title: 'Permissions'
    }
  },
  {
    path: "/permission/:permissionId",
    name: "PermissionDetail",
    component: PermissionDetail
  },
  {
    path: "/akara-admin",
    name: "AkaraAdmin",
    component: AkaraAdmin,
    meta: {
      title: 'AkaraAdmin'
    }
  },

  // Client
  {
    path: "/:siteId/clients",
    name: "Clients",
    component: Clients,
    meta: {
      title: 'Clients'
    }
  },
  {
    path: "/client/:clientId",
    name: "ClientDetail",
    component: ClientDetail,
  },
  {
    path: "/client/:clientId/edit",
    name: "UpdateClient",
    component: UpdateClient,
  },
  {
    path: "/clients/new",
    name: "CreateClient",
    component: CreateClient,
    meta: {
      title: 'Add Client'
    }
  },
  {
    path: "/client/:clientId/edit/newuser",
    name: "CreateClientUser",
    component: CreateClientUser
  },
  // Licences
  {
    path: "/licences",
    name: "Licences",
    component: Licences,
    meta: {
      title: "Licences"
    },
  },
  {
    path: "/licence/:licenceId",
    name: "LicenceDetail",
    component: LicenceDetail,
  },
  {
    path: "/licence/:licenceId/pdf",
    name: "LicencePdf",
    component: LicencePdf,
    meta: { layout: "empty" },
  },  
  {
    path: "/licence/new/:clientId",
    name: "AddLicence",
    component: AddLicence,
  },
  {
    path: "/licence/:licenceId/edit",
    name: "UpdateLicence",
    component: UpdateLicence,
  },
  {
    path: "/licence/:licenceId/edit/add-zone",
    name: "CreateLicenceZone",
    component: CreateLicenceZone,
  },
  {
    path: "/licence/:licenceId/zone/:licenceZoneId/edit",
    name: "UpdateLicenceZone",
    component: UpdateLicenceZone,
  },
  {
    path: "/licence/:licenceId/edit/add-document",
    name: "CreateLicenceDocument",
    component: CreateLicenceDocument,
  },
  {
    path: "/licence/:licenceId/edit/add-product",
    name: "CreateLicenceProduct",
    component: CreateLicenceProduct,
  },
  {
    path: "/licence/:licenceId/edit/product/:licenceProductId",
    name: "UpdateLicenceProduct",
    component: UpdateLicenceProduct,
  },
  {
    path: "/licence/:licenceId/terminate",
    name: "LicenceTerminate",
    component: LicenceTerminate,
  },
  // User
  {
    path: "/:siteId/users",
    name: "Users",
    component: Users,
    meta: {
      title: "Users"
    },
  },
  {
    path: "/user/:userId",
    name: "UserDetail",
    component: UserDetail,
  },
  {
    path: "/user/:userId/edit",
    name: "UpdateUser",
    component: UpdateUser,
  },
  {
    path: "/users/new",
    name: "AddUser",
    component: AddUser,
    meta: {
      title: "Add User"
    },
  },
  // Site
  {
    path: "/sites",
    name: "Sites",
    component: Sites,
    meta: {
      title: "Sites"
    },
  },
  {
    path: "/site/:siteId",
    name: "SiteDetail",
    component: SiteDetail,
  },
  {
    path: "/site/:siteId/edit",
    name: "UpdateSite",
    component: UpdateSite,
  },  
  {
    path: "/site/:siteId/product/:siteProductId",
    name: "SiteProductPricing",
    component: SiteProductPricing,
  },
  {
    path: "/site/:siteId/products",
    name: "SiteProducts",
    component: SiteProducts,
    meta: {
      title: "Products"
    },
  },
  {
    path: "/site/:siteId/products/add",
    name: "AddSiteProduct",
    component: AddSiteProduct,
    meta: {
      title: "Add Product"
    },
  },
  {
    path: "/site/:siteId/product/:siteProductId/add",
    name: "AddProductPricing",
    component: AddProductPricing,
  },
  {
    path: "/site/:siteId/product/:siteProductPricingId/edit",
    name: "UpdateProductPricing",
    component: UpdateProductPricing,
  },
  // Product
  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: {
      title: "Products"
    },
  },
  {
    path: "/product/:productId",
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: "/product/:productId/edit",
    name: "UpdateProduct",
    component: UpdateProduct,
  },
  {
    path: "/product/create",
    name: "CreateProduct",
    component: CreateProduct,
    meta: {
      title: "Add Product"
    },
  },

  //licence
  {
    path: "/site/:siteId/licence-templates",
    name: "LicenceTemplates",
    component: LicenceTemplates,
    meta: {
      title: "Licence Templates"
    },
  },
  {
    path: "/site/:siteId/licence-templates/add",
    name: "CreateLicenceTemplate",
    component: CreateLicenceTemplate,
    meta: {
      title: "Add Licence Template"
    },
  },
  {
    path: "/site/:siteId/licence-template/:siteLicenceTemplateId/licence-product/create",
    name: "CreateSiteLicenceProduct",
    component: CreateSiteLicenceProduct,
  },
  {
    path: "/site/:siteId/licence-template/:siteLicenceTemplateId/licence-product/:siteLicenceProductId/edit",
    name: "UpdateSiteLicenceProduct",
    component: UpdateSiteLicenceProduct,
  },
  {
    path: "/site/:siteId/licence-template/:siteLicenceTemplateId/licence-document/create",
    name: "CreateSiteLicenceDocument",
    component: CreateSiteLicenceDocument,
  },
  {
    path: "/site/:siteId/licence-template/:siteLicenceTemplateId/licence-document/:siteLicenceDocumentId/edit",
    name: "UpdateSiteLicenceDocument",
    component: UpdateSiteLicenceDocument,
  },
  {
    path: "/site/:siteId/licence-template/:siteLicenceTemplateId",
    name: "LicenceTemplateDetail",
    component: LicenceTemplateDetail,
  },
  {
    path: "/site/:siteId/licence-template/:siteLicenceTemplateId/edit",
    name: "UpdateLicenceTemplate",
    component: UpdateLicenceTemplate,
  },

  // Invoice

  {
    path: "/site/:siteId/invoices",
    name: "Invoices",
    component: Invoices,
    meta: {
      title: "Invoices"
    },
  },
  {
    path: "/invoice/:invoiceId",
    name: "InvoiceDetail",
    component: InvoiceDetail,
  },
  {
    path: "/invoice/:invoiceId/edit/:chargeRegisterId",
    name: "UpdateInvoice",
    component: UpdateInvoice,
  },
  {
    path: "/site/:siteId/invoices/generate",
    name: "GenerateInvoice",
    component: GenerateInvoice,
    meta: {
      title: "Generate Invoice"
    },
  },
  {
    path: "/site/:siteId/invoices/generate/:clientId",
    name: "GenerateByClient",
    component: GenerateByClient,
  },
  {
    path: "/invoice/:invoiceId/pdf",
    name: "InvoicePdf",
    component: InvoicePdf,
    meta: { layout: "empty" },
  },
  {
    path: "/site/:siteId/invoices/generate-charge",
    name: "GenerateCharge",
    component: GenerateCharge,
    meta: {
      title: "Generate Charge Invoice"
    },
  },

  //Zones
  {
    path: "/site/:siteId/zones",
    name: "Zones",
    component: Zones,
    meta: {
      title: "Zones"
    },
  },
  {
    path: "/site/:siteId/zone/:siteZoneId",
    name: "ZoneDetail",
    component: ZoneDetail,
  },
  {
    path: "/site/:siteId/zone/:siteZoneId/edit",
    name: "UpdateZone",
    component: UpdateZone,
  },
  {
    path: "/site/:siteId/zone/add",
    name: "AddZone",
    component: AddZone,
    meta: {
      title: "Add Zone"
    },
  },


  // Charge
  {
    path: "/site/:siteId/charge-register",
    name: "Charges",
    component: Charges,
    meta: {
      title: "Charge Register"
    },
  },
  {
    path: "/site/:siteId/charge-register/create",
    name: "AddCharge",
    component: AddCharge,
    meta: {
      title: "Add Charge"
    },
  },
  {
    path: "/site/:siteId/charge-register/:chargeRegisterId/edit",
    name: "UpdateCharge",
    component: UpdateCharge,
  },

  // Payments
  {
    path: "/payments",
    name: "Payments",
    component: Payments,
    meta: {
      title: "Payments"
    },
  },
  {
    path: "/payments/add",
    name: "CreatePayment",
    component: CreatePayment,
    meta: {
      title: "Add Payment"
    },
  },

  //Reports
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
    meta: {
      title: "Reports"
    },
  },
  {
    path: "/report/management",
    name: "Report1",
    component: Report1,
    meta: {
      title: "Report Management"
    },
  },
  {
    path: "/report/2",
    name: "Report2",
    component: Report2,
    meta: {
      title: "Report Snapshot"
    },
  },
  {
    path: "/report/3",
    name: "Report3",
    component: Report3,
    meta: {
      title: "Report Revenue"
    },
  },
  {
    path: "/report/4",
    name: "Report4",
    component: Report4,
    meta: {
      title: "Site Property Report"
    },    
  },
  // floorplan
  {
    path: "/floorplan",
    name: "Floorplans",
    component: Floorplans,
    meta: {
      title: "Floorplan"
    },    
  },
  {
    path: "/floorplan/edit",
    name: "UpdateFloorplan",
    component: UpdateFloorplan,
    meta: {
      title: "Update Floorplan"
    },        
  },

  // RoomReservation
  {
    path: "/room-reservation",
    name: "RoomReservations",
    component: RoomReservations,
    meta: {
      title: 'RoomReservations'
    }
  },
  {
    path: "/room-reservation/:roomReservationId",
    name: "RoomReservationDetail",
    component: RoomReservationDetail,
  },
  {
    path: "/room-reservation/:roomReservationId/edit",
    name: "UpdateRoomReservation",
    component: UpdateRoomReservation,
  },
  {
    path: "/room-reservation/new",
    name: "CreateRoomReservation",
    component: CreateRoomReservation,
    meta: {
      title: 'Add RoomReservation'
    }
  },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { layout: "empty" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;

let loggedIn

router.beforeEach((to: any, from, next) => {
  loggedIn = JSON.parse(localStorage.getItem('user'));
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  if (authRequired && !loggedIn) {
    return next('/login');
  }   
  if (loggedIn && loggedIn.user && loggedIn.user.siteUsers && loggedIn.user.siteUsers.length === 1) {
    loggedIn.user.selectedSite = loggedIn.user.siteUsers[0].site;
    loggedIn.user.permissions = loggedIn.user.siteUsers[0].userRoleType.userRolePermissions
    localStorage.setItem("user", JSON.stringify(loggedIn));
  }
  
  
  // permissions
  let permissionPages = ['Login', 'Register', 'SiteSelect', 'Dashboard', 'NoPermission', 'Profile']
  let permissions;
  if (loggedIn && loggedIn.user && loggedIn.user.permissions) {
    permissions = loggedIn.user.permissions
  } else {
    permissions = []
  }
  
  permissionNames.forEach((item) => {
    if (hasPermission(permissions, item.permissionName)) {
      permissionPages.push(item.routeName)
    }
  })
  const permissionRequired = !permissionPages.includes(to.name);
  if (permissionRequired && loggedIn) {
    return next({name: 'NoPermission', query: {permissionName: to.name}});
  }

  next();
})

router.afterEach((to: any, from, next) => {
  // tab title
  const unTitlePages = [
    'PermissionDetail',
    'ClientDetail',
    'UpdateClient',
    'AddLicence',
    'CreateClientUser',
    'UpdateUser',
    'UserDetail',
    'SiteDetail',
    'UpdateSite',
    'SiteProductPricing',
    'AddProductPricing',
    'UpdateProductPricing',
    'ProductDetail',
    'UpdateProduct',
    'CreateSiteLicenceProduct',
    'UpdateSiteLicenceProduct',
    'CreateSiteLicenceDocument',
    'UpdateSiteLicenceDocument',
    'LicenceTemplateDetail',
    'UpdateLicenceTemplate',
    'GenerateByClient'
  ]
  const titleRequired = !unTitlePages.includes(to.name);
  if (titleRequired === true) {
    if (loggedIn && loggedIn.user && loggedIn.user.selectedSite) {
      if (to.name === 'LicenceDetail') {
        to.meta.title = `Licence#${to.params.licenceId}`
      } else if (to.name === 'LicencePdf') {
        to.meta.title = `Licence#${to.params.licenceId} Pdf`
      } else if (to.name === 'UpdateLicence') {
        to.meta.title = `Update Licence#${to.params.licenceId}`
      } else if (to.name === 'CreateLicenceZone') {
        to.meta.title = `Add Zone | Licence#${to.params.licenceId}`
      } else if (to.name === 'UpdateLicenceZone') {
        to.meta.title = `Update Zone | Licence#${to.params.licenceId}`
      } else if (to.name === 'CreateLicenceDocument') {
        to.meta.title = `Add Document | Licence#${to.params.licenceId}`
      } else if (to.name === 'CreateLicenceProduct') {
        to.meta.title = `Add Product | Licence#${to.params.licenceId}`
      } else if (to.name === 'UpdateLicenceProduct') {
        to.meta.title = `Update Product | Licence#${to.params.licenceId}`
      } else if (to.name === 'InvoiceDetail') {
        to.meta.title = `Invoice#${to.params.invoiceId}`
      } else if (to.name === 'InvoicePdf') {
        to.meta.title = `Invoice#${to.params.invoiceId} Pdf`
      } else if (to.name === 'ZoneDetail') {
        to.meta.title = `Zone#${to.params.siteZoneId}`
      } else if (to.name === 'UpdateZone') {
        to.meta.title = `Update Zone#${to.params.siteZoneId}`
      } else if (to.name === 'UpdateCharge') {
        to.meta.title = `Update Charge#${to.params.chargeRegisterId}`
      } else if (to.name === 'UpdateInvoice') {
        to.meta.title = `Update Invoice#${to.params.invoiceId} | Charge#${to.params.chargeRegisterId}`
      } else if (to.name === 'LicenceTerminate') {
        to.meta.title = `Licence#${to.params.licenceId} Terminate`
      }
      document.title = to.meta.title + ' | ' + loggedIn.user.selectedSite.brandName + ' | AKARA' || 'AKARA'
    } else {
      document.title = to.meta.title + ' | AKARA' || 'AKARA'
    }
    if (to.name === 'Sites' || to.name === 'Products' || to.name === 'CreateProduct') {
      document.title = to.meta.title + ' | AKARA' || 'AKARA'
    }
  }
})

function hasPermission(permissions, permissionName) {
  if (permissions.filter(function(permission){ return permission.permission.name === permissionName }).length>0)  
    return true 
  else 
    return false
}