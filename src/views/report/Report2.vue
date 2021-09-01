<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div class="mt-8" v-if="!isLoading">
      <div id="element-to-print">
        <h3 class="text-gray-700 text-3xl font-semibold -mt-12">End of Month Snapshot<br>{{ formatHeaderDate(selectedDate) }}</h3>
        <div class="flex items-center justify-between">
          <div class="text-center">
            <a-month-picker class="w-full" size="large" @change="onChangeDate" :defaultValue="formatDate(selectedDate)" picker="month" />
          </div>
        </div>
        <!-- Licences -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Licences</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Active licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ licences.length }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">New licences starting</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ startingLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Expired licences this month</div>
                <p class="text-gray-900 whitespace-no-wrap">
                  <span class="text-gray-700 text-base mb-4 font-normal">
                    <div v-for="(item, i) in expiredLicenceByType" :key="i">
                      {{item.type}} - {{item.count}}
                    </div>
                  </span>
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Licences expiring within 1 month</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ expireIn3LicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Licences expiring within 3 months</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ expireIn1LicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Closed licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ closedLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Licences that have given notice to terminate</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ terminatedLicenceNum }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Invoices -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Invoices</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >              
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of outstanding invoices</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ outInvoicesNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of clients with outstanding invoices</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ outClientsNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total Value of invoices generated</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Total: {{site.currency.symbol}}{{ getTotalCharge(currentMonthInvoices) }}
                </p>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Tax: {{site.currency.symbol}}{{ getTotalTax(currentMonthInvoices) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Zones -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Zones</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total Number of zones</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ zones.length }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of zones with active licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ zonesWithActiveLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of workstations</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ totalWorkstationsNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of workstations for zones with active licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ workstationWithActiveLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Occupancy % as per offices & workstations</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ (zonesWithActiveLicenceNum/zones.length*100).toFixed(2) }}%
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Charge register section -->
        <div class="mt-8 pb-4">
          <h3 class="text-gray-700 text-3xl font-medium">Charge register section</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <p class="text-gray-900 whitespace-no-wrap">
                <span class="text-gray-900 whitespace-no-wrap">
                  <div v-for="(item, i) in products" :key="i">
                    <span class="material-icons mr-3 align-middle" v-if="item.icon">{{item.icon}}</span>
                    {{item.name}} - {{item.chargeNum}} items - {{item.clientNum}} clients - {{site.currency.symbol}}{{ parseFloat(item.totalIncTax).toFixed(2) }} Inc Tax
                  </div>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import moment from "moment";
import SelectBox from "../../components/common/SelectBox.vue";
import { getDate, dynamicSort, removeDuplicates } from "../../helpers/index";

export default defineComponent({
  components: {
    SelectBox
  },
  data: () => ({
    isLoading: true,
    siteId: {},
    selectedDate: moment().format("YYYY-MM-DD"),
    licences: [],
    startingLicenceNum: 0,
    expiredLicenceByType: [],
    expireIn3LicenceNum: 0,
    expireIn1LicenceNum: 0,
    closedLicenceNum: 0,
    terminatedLicenceNum: 0,
    invoices: [],
    currentMonthInvoices: [],
    outInvoicesNum: 0,
    outClientsNum: 0,
    charges: [],
    currentMonthCharges: [],
    zones: [],
    zonesWithActiveLicenceNum: 0,
    totalWorkstationsNum: 0,
    workstationWithActiveLicenceNum: 0,
  }),
  setup() {
    return {
      getDate,
      dynamicSort,
      removeDuplicates
    };
  },
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.$store.dispatch("reports/getLicences", {
      id: this.siteId,
    });
    this.$store.dispatch("invoices/getById", { id: this.siteId });
    this.$store.dispatch("charges/filter", {
      siteId: this.siteId,
      isInvoice: true,
      clientId: null,
      productId: null,
    });
    this.$store.dispatch("reports/getZones", { id: this.siteId });
  },
  watch: {
    "$store.state.reports.licences": function () {
      this.licences = this.$store.state.reports.licences.licences;      
      if (this.licences) {
        this.getLicenceData();     
        this.checkLoading();
      }
    },
    "$store.state.invoices.invoices": function () {
      this.invoices = this.$store.state.invoices.invoices.invoices;
      if (this.invoices) {
        this.getInvoiceData();        
        this.checkLoading();
      }
    },
    "$store.state.charges.charges": function () {
      this.charges = this.$store.state.charges.charges.charges;
      if (this.charges) {
        this.getProductData()
        this.checkLoading();
      }
    },
    "$store.state.reports.zones": function () {
      this.zones = this.$store.state.reports.zones.zones;
      if (this.zones) {
        this.zones.forEach(zone => {
          zone.licenceZonesWithAcitveLicence = zone.licenceZones.filter(licenceZone => {
            return licenceZone.licence.active === true
          });
          zone.licenceZonesWithInAcitveLicence = zone.licenceZones.filter(licenceZone => {
            return licenceZone.licence.active === false
          });
        });
        this.getZoneData()
        this.checkLoading();
      }
    },
    
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.reports.licences.licences &&
        this.$store.state.invoices.invoices.invoices && 
        this.$store.state.charges.charges.charges &&
        this.$store.state.reports.zones.zones
      ) {
        this.isLoading = false;
      }
    },
    formatDate: function(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    formatHeaderDate: function(date) {
      return moment(date).format('MMMM YYYY')
    },
    onChangeDate(date, dateString) {
      this.selectedDate = dateString
      this.getLicenceData()
      this.getInvoiceData()
      this.getProductData()
      this.getZoneData()
    },
    getLicenceData: function () {
      this.startingLicenceNum = 0
      this.expiredLicenceByType = []
      let expiredLicence = []
      this.expireIn3LicenceNum = 0
      this.expireIn1LicenceNum = 0
      this.closedLicenceNum = 0
      this.terminatedLicenceNum = 0
      this.licences.forEach((licence) => {
        if (licence.licenceStart && moment(licence.validUntil).format("YYYY-MM") === moment(this.selectedDate).format("YYYY-MM")) {
          this.startingLicenceNum++
        }
        if (licence.validUntil) {
          let now = this.selectedDate;
          let validUntil = moment(licence.validUntil).format("YYYY-MM-DD");
          let diffMonth = moment(validUntil).diff(moment(now), "months");
          let diffDays = moment(validUntil).diff(moment(now), "days");
          if (diffDays > 0 && diffMonth <= 1) {
            this.expireIn1LicenceNum++;
          } else if (diffDays > 0 && diffMonth >1 && diffMonth < 3) {
            this.expireIn3LicenceNum++;
          } else if (diffDays <= 0) {
            expiredLicence.push(licence);
          }
        } else {
          // expiredLicence.push(licence);
        }    
        if (licence.terminationDate && moment(licence.terminationDate).format("YYYY-MM") === moment(this.selectedDate).format("YYYY-MM")) {
          if (licence.licenceStatusTypeId === 13) {
            this.closedLicenceNum++
          } else if(licence.licenceStatusTypeId === 12) {
            this.terminatedLicenceNum++
          }
        }
      });
      let licenceTypes = []
      this.removeDuplicates(expiredLicence, 'licenceTypeId').forEach(element => {
        licenceTypes.push(element.licenceType)
      });
      licenceTypes.forEach(type => {
        this.expiredLicenceByType.push({
          type: type.name,
          count: (expiredLicence.filter(item => { return item.licenceTypeId === type.licenceTypeId })).length
        })
      })
    },
    getInvoiceData: function () {
      this.currentMonthInvoices = []
      this.outInvoicesNum = 0
      let clients = []
      this.outClientsNum = 0
      this.invoices.forEach((invoice) => {
        const now = this.selectedDate;
        const end = moment(invoice.dateCreated).format("YYYY-MM-DD");
        if (now.slice(0, 7) === end.slice(0, 7)) {
          this.currentMonthInvoices.push(invoice)
        }    
        if (invoice.totalChargesIncTax !== this.getTotalPayment(invoice)) {
          this.outInvoicesNum++
          clients.push(invoice.client)
        }
      });
      clients = this.removeDuplicates(clients, 'clientId')
      this.outClientsNum = clients.length
    },
    getTotalTax: function (invoices) {
      let total = 0
      invoices.forEach(element => {
        total += element.totaltax
      });
      return total.toFixed(2)
    },
    getTotalCharge: function (invoices) {
      let total = 0
      invoices.forEach(element => {
        total += element.totalChargesIncTax - element.totaltax
      });
      return total.toFixed(2)
    },
    getTotalPayment: function (invoice) {
      let total = 0;
      invoice.payments.forEach(item => {
        total += item.amount;
      });
      return total
    },
    getProductData: function () {
      this.currentMonthCharges = []
      this.products = []
      this.charges.forEach((charge) => {
        const now = this.selectedDate;
        const end = moment(charge.timestamp).format("YYYY-MM-DD");
        if (now.slice(0, 7) === end.slice(0, 7)) {
          this.currentMonthCharges.push(charge)
        }
      });
      this.currentMonthCharges.forEach(element => {
        this.products.push(element.product)
      });
      this.products = this.removeDuplicates(this.products, 'productId')
      this.products.forEach(product => {
        product.chargeNum = 0
        product.clientNum = 0
        product.totalIncTax = 0
        const filtered = this.charges.filter(item => { return item.product.productId === product.productId })
        product.clientNum = (this.removeDuplicates(filtered, 'clientId')).length
        product.chargeNum = filtered.length
        filtered.forEach(element => {
          product.totalIncTax += element.rateTotal * (element.taxRate.taxPercentage/100 + 1)
        });
      });
    },
    getZoneData: function () {
      //get zone data
      this.zonesWithActiveLicenceNum = 0
      this.workstationWithActiveLicenceNum = 0
      this.totalWorkstationsNum = 0
      this.zones.forEach(zone => {
        if (zone.licenceZonesWithAcitveLicence.length > 0) {
          this.zonesWithActiveLicenceNum ++
          // get workstations data
          this.workstationWithActiveLicenceNum += zone.workstations
        }
        // get workstations data
        this.totalWorkstationsNum += zone.workstations
      });
    },
  },
});
</script>
