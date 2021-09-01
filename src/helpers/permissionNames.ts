const permissionNames = [
  // clients
  {
    permissionName: 'client view',
    routeName: 'Clients'
  },
  {
    permissionName: 'client detail',
    routeName: 'ClientDetail'
  },
  {
    permissionName: 'client update',
    routeName: 'UpdateClient'
  },
  {
    permissionName: 'client add',
    routeName: 'CreateClient'
  },
  {
    permissionName: 'client user add',
    routeName: 'CreateClientUser'
  },
  // users
  {
    permissionName: 'user view',
    routeName: 'Users'
  },
  {
    permissionName: 'user detail',
    routeName: 'UserDetail'
  },
  {
    permissionName: 'user update',
    routeName: 'UpdateUser'
  },
  {
    permissionName: 'user add',
    routeName: 'AddUser'
  },
  // products
  {
    permissionName: 'product view',
    routeName: 'Products'
  },
  {
    permissionName: 'product detail',
    routeName: 'ProductDetail'
  },
  {
    permissionName: 'product update',
    routeName: 'UpdateProduct'
  },
  {
    permissionName: 'product add',
    routeName: 'CreateProduct'
  },
  // invoices
  {
    permissionName: 'invoice view',
    routeName: 'Invoices'
  },
  {
    permissionName: 'invoice detail',
    routeName: 'InvoiceDetail'
  },
  {
    permissionName: 'invoice update',
    routeName: 'UpdateInvoice'
  },
  {
    permissionName: 'invoice generate',
    routeName: 'GenerateInvoice'
  },
  {
    permissionName: 'invoice pdf',
    routeName: 'InvoicePdf'
  },
  {
    permissionName: 'invoice generate client',
    routeName: 'GenerateByClient'
  },
  {
    permissionName: 'invoice generate charge',
    routeName: 'GenerateCharge'
  },
  // payments
  {
    permissionName: 'payment view',
    routeName: 'Payments'
  },
  {
    permissionName: 'payment add',
    routeName: 'CreatePayment'
  },
  // zones
  {
    permissionName: 'zone view',
    routeName: 'Zones'
  },
  {
    permissionName: 'zone detail',
    routeName: 'ZoneDetail'
  },
  {
    permissionName: 'zone update',
    routeName: 'UpdateZone'
  },
  {
    permissionName: 'zone add',
    routeName: 'AddZone'
  },
  // charges
  {
    permissionName: 'charge view',
    routeName: 'Charges'
  },
  {
    permissionName: 'charge add',
    routeName: 'AddCharge'
  },
  {
    permissionName: 'charge edit delete',
    routeName: 'UpdateCharge'
  },
  // licence
  {
    permissionName: 'licence view',
    routeName: 'Licences'
  },
  {
    permissionName: 'licence detail',
    routeName: 'LicenceDetail'
  },
  {
    permissionName: 'licence update',
    routeName: 'UpdateLicence'
  },
  {
    permissionName: 'licence add',
    routeName: 'AddLicence'
  },
  {
    permissionName: 'licence pdf',
    routeName: 'LicencePdf'
  },
  {
    permissionName: 'licence document add',
    routeName: 'CreateLicenceDocument'
  },
  {
    permissionName: 'licence product add',
    routeName: 'CreateLicenceProduct'
  },
  {
    permissionName: 'licence product update',
    routeName: 'UpdateLicenceProduct'
  },
  {
    permissionName: 'licence zone add',
    routeName: 'CreateLicenceZone'
  },
  {
    permissionName: 'licence zone update',
    routeName: 'UpdateLicenceZone'
  },
  {
    permissionName: 'licence terminate',
    routeName: 'LicenceTerminate'
  },
  // licence-template
  {
    permissionName: 'licence-template view',
    routeName: 'LicenceTemplates'
  },
  {
    permissionName: 'licence-template detail',
    routeName: 'LicenceTemplateDetail'
  },
  {
    permissionName: 'licence-template update',
    routeName: 'UpdateLicenceTemplate'
  },
  {
    permissionName: 'licence-template add',
    routeName: 'CreateLicenceTemplate'
  },
  {
    permissionName: 'licence-template document add',
    routeName: 'CreateSiteLicenceDocument'
  },
  {
    permissionName: 'licence-template document update',
    routeName: 'UpdateSiteLicenceDocument'
  },
  {
    permissionName: 'licence-template product add',
    routeName: 'CreateSiteLicenceProduct'
  },
  {
    permissionName: 'licence-template product update',
    routeName: 'UpdateSiteLicenceProduct'
  },
  // site
  {
    permissionName: 'site view',
    routeName: 'Sites'
  },
  {
    permissionName: 'site detail',
    routeName: 'SiteDetail'
  },
  {
    permissionName: 'site update',
    routeName: 'UpdateSite'
  },
  {
    permissionName: 'site product view',
    routeName: 'SiteProducts'
  },
  {
    permissionName: 'site product add',
    routeName: 'AddSiteProduct'
  },
  {
    permissionName: 'site product pricing view',
    routeName: 'SiteProductPricing'
  },
  {
    permissionName: 'site product pricing add',
    routeName: 'AddProductPricing'
  },
  {
    permissionName: 'site product pricing update',
    routeName: 'UpdateProductPricing'
  },
  // akara admin
  {
    permissionName: 'akara admin',
    routeName: 'AkaraAdmin'
  },
  // permission
  {
    permissionName: 'permission view',
    routeName: 'Permissions'
  },
  {
    permissionName: 'permission change',
    routeName: 'PermissionDetail'
  },
  // report
  {
    permissionName: 'report view',
    routeName: 'Reports'
  },
  {
    permissionName: 'report 1 view',
    routeName: 'Report1'
  },
  {
    permissionName: 'report 2 view',
    routeName: 'Report2'
  },
  {
    permissionName: 'report 3 view',
    routeName: 'Report3'
  },
  {
    permissionName: 'report 4 view',
    routeName: 'Report4'
  },
  // floorplan
  {
    permissionName: 'floorplan view',
    routeName: 'Floorplans'
  },
  {
    permissionName: 'floorplan update',
    routeName: 'UpdateFloorplan'
  },  
  // roomReservation
  {
    permissionName: 'room reservation view',
    routeName: 'RoomReservations'
  },
  {
    permissionName: 'room reservation update',
    routeName: 'UpdateRoomReservation'
  },  
  {
    permissionName: 'room reservation detail',
    routeName: 'RoomReservationDetail'
  },
  {
    permissionName: 'room reservation add',
    routeName: 'CreateRoomReservation'
  },  
]

export default permissionNames