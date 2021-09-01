<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <div class="text-right">
        <button
          type="button"
          @click="onExportPdf()"
          class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mr-4"
        >
          Export PDF
        </button>
      </div>
      <div id="element-to-print">
        <h3 class="text-gray-700 text-3xl font-semibold -mt-12">Monthly Management Report<br>{{ formatHeaderDate(selectedDate) }}</h3>
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
                <div class="text-gray-900 font-bold text-lg mb-2">Expired licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ expiredLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Licences expiring within 1 month</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ expireIn1LicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Licences expiring within 3 months</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ expireIn3LicenceNum }}
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
                <div class="text-gray-900 font-bold text-lg mb-2">Invoices created</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ currentMonthInvoices.length }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total value (inc tax)</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{site.currency.symbol}}{{ totalIncTax }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total value paid in advance (inc tax)</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{site.currency.symbol}}{{ paidInAdvance }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Payments -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Payments</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Payments made</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ currentMonthPayments.length }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total value</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{site.currency.symbol}}{{ totalPayment }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Payment types</div>
                <p class="text-gray-900 whitespace-no-wrap">
                  <span class="text-gray-900 whitespace-no-wrap">
                    <div v-for="(item, i) in paymentByType" :key="i">
                      {{item.type}} - {{site.currency.symbol}}{{ parseFloat(item.totalPayment).toFixed(2) }}
                    </div>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Products -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Products</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <p class="text-gray-900 whitespace-no-wrap">
                <span class="text-gray-900 whitespace-no-wrap">
                  <div v-for="(item, i) in products" :key="i">
                    <span class="material-icons mr-3 align-middle" v-if="item.icon">{{item.icon}}</span>
                    {{item.name}} - {{item.chargeNum}} charges - {{site.currency.symbol}}{{ parseFloat(item.totalIncTax).toFixed(2) }} Inc Tax
                  </div>
                </span>
              </p>
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
                <div class="text-gray-900 font-bold text-lg mb-2">Zones with licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ zonesWithActiveLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Value of zones with licence</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{site.currency.symbol}}{{ parseFloat(zonesWithActiveLicenceTotal).toFixed(2) }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Zones without licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ zonesWithInActiveLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total value of zones without active licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{site.currency.symbol}}{{ parseFloat(zonesWithInActiveLicenceTotal).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Workstations -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Workstations</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Workstations</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ totalWorkstationsNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">With licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ workstationWithActiveLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Without licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ totalWorkstationsNum-workstationWithActiveLicenceNum }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Clients -->
        <div class="mt-8 pb-8">
          <h3 class="text-gray-700 text-3xl font-medium">Clients</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total clients</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ clients.length }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Clients with active licence</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ clientsWithActiveLicenceNum }}
                </p>
              </div>
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
import html2pdf from "html2pdf.js";
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
    expiredLicenceNum: 0,
    expireIn1LicenceNum: 0,
    expireIn3LicenceNum: 0,
    invoices: [],
    currentMonthInvoices: [],
    totalIncTax: 0,
    paidInAdvance: 0,
    payments: [],
    currentMonthPayments: [],
    totalPayment: 0,
    paymentByType: [],
    charges: [],
    currentMonthCharges: [],
    zones: [],
    zonesWithActiveLicenceNum: 0,
    zonesWithActiveLicenceTotal: 0,
    zonesWithInActiveLicenceNum: 0,
    zonesWithInActiveLicenceTotal: 0,
    totalWorkstationsNum: 0,
    workstationWithActiveLicenceNum: 0,
    clients: [],
    clientsWithActiveLicenceNum: 0
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
    this.$store.dispatch("payments/getAll", { id: this.siteId });
    this.$store.dispatch("charges/filter", {
      siteId: this.siteId,
      isInvoice: true,
      clientId: null,
      productId: null,
    });
    this.$store.dispatch("reports/getZones", { id: this.siteId });
    this.$store.dispatch("reports/getClients", { id: this.siteId });
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
    "$store.state.payments.all": function () {
      this.payments = this.$store.state.payments.all.items;
      if (this.payments) {
        this.getPaymentData()
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
    "$store.state.reports.clients": function () {
      this.clients = this.$store.state.reports.clients.clients;
      if (this.clients) {
        this.clients.forEach(client => {
          client.licences = client.licences.filter(licence => { return licence.active === true })
        });
        this.clients = this.removeDuplicates(this.clients, 'clientId')
        this.getClientData()
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.reports.licences.licences &&
        this.$store.state.invoices.invoices.invoices && 
        this.$store.state.payments.all.items &&
        this.$store.state.charges.charges.charges &&
        this.$store.state.reports.zones.zones &&
        this.$store.state.reports.clients.clients
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
      this.getPaymentData()
      this.getProductData()
      this.getZoneData()
    },
    getLicenceData: function () {
      this.expiredLicenceNum = 0
      this.expireIn1LicenceNum = 0
      this.expireIn3LicenceNum = 0
      this.licences.forEach((licence) => {
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
            this.expiredLicenceNum++;
          }
        } else {
          this.expiredLicenceNum++;
        }
      });
    },
    getInvoiceData: function () {
      this.currentMonthInvoices = []
      this.totalIncTax = 0
      this.paidInAdvance = 0
      this.invoices.forEach((invoice) => {
        const now = this.selectedDate;
        const end = moment(invoice.dateCreated).format("YYYY-MM-DD");
        if (now.slice(0, 7) === end.slice(0, 7)) {
          this.currentMonthInvoices.push(invoice)
        }        
      });
      this.totalIncTax = this.getTotal(this.currentMonthInvoices)
      this.paidInAdvance = this.getTotalPayment(this.currentMonthInvoices)
    },
    getTotal: function (currentMonthInvoices) {
      let total = 0;
      currentMonthInvoices.forEach(invoice => {
        invoice.chargeRegisters.forEach(item => {
          total += item.rateTotal*(item.taxRate.taxPercentage/100 + 1);
        });
      });
      return total.toFixed(2)
    },
    getTotalPayment: function (currentMonthInvoices) {
      let total = 0;
      currentMonthInvoices.forEach(invoice => {
        invoice.chargeRegisters.forEach(item => {
          if (item.paidInAdvance === true)
          total += item.rateTotal*(item.taxRate.taxPercentage/100 + 1);
        });
      });
      return total.toFixed(2);
    },
    getPaymentData: function () {
      this.currentMonthPayments = []
      this.totalPayment = 0
      this.paymentByType = []
      let paymentTypes = []
      this.payments.forEach((payment) => {
        const now = this.selectedDate;
        const end = moment(payment.timestamp).format("YYYY-MM-DD");
        if (now.slice(0, 7) === end.slice(0, 7)) {
          this.currentMonthPayments.push(payment)
        }
      });
      this.currentMonthPayments.forEach((payment) => {
        this.totalPayment += payment.amount
        paymentTypes.push(payment.paymentType)
        paymentTypes = this.removeDuplicates(paymentTypes, 'paymentTypeId')
      });
      paymentTypes.forEach(type => {
        let filtered = this.currentMonthPayments.filter(item => { return item.paymentTypeId === type.paymentTypeId })
        type.totalPayment = 0
        filtered.forEach(item => {
          type.totalPayment += item.amount
        });
      })
      this.paymentByType = paymentTypes
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
        product.totalIncTax = 0
        const filtered = this.charges.filter(item => { return item.product.productId === product.productId })
        product.chargeNum = filtered.length
        filtered.forEach(element => {
          product.totalIncTax += element.rateTotal * (element.taxRate.taxPercentage/100 + 1)
        });
      });
    },
    getZoneData: function () {
      //get zone data
      this.zonesWithActiveLicenceNum = 0
      this.zonesWithActiveLicenceTotal = 0
      this.zonesWithInActiveLicenceNum = 0
      this.zonesWithInActiveLicenceTotal = 0
      // get workstations data
      this.workstationWithActiveLicenceNum = 0
      this.totalWorkstationsNum = 0
      this.zones.forEach(zone => {
        if (zone.licenceZonesWithAcitveLicence.length > 0) {
          this.zonesWithActiveLicenceNum ++
          zone.licenceZonesWithAcitveLicence.forEach(element => {
            this.zonesWithActiveLicenceTotal += element.rate * (1+element.taxRate.taxPercentage/100)
          });
          // get workstations data
          this.workstationWithActiveLicenceNum += zone.workstations
        } else if (zone.licenceZonesWithAcitveLicence.length === 0) {
          this.zonesWithInActiveLicenceNum ++
        } 
        if (zone.licenceZonesWithInAcitveLicence.length > 0) {
          zone.licenceZonesWithInAcitveLicence.forEach(element => {
            this.zonesWithInActiveLicenceTotal += element.rate * (1+element.taxRate.taxPercentage/100)
          });
        }
        // get workstations data
        this.totalWorkstationsNum += zone.workstations
      });
    },
    getClientData: function () {
      this.clientsWithActiveLicenceNum = 0
      let filtered = this.clients.filter(client => { return client.licences.length > 0 })
      this.clientsWithActiveLicenceNum = filtered.length
    },
    onExportPdf: function () {
      var element = document.getElementById("element-to-print");
      var opt = {
        margin: 1,
        filename: "report"+moment().format("YYYY-MM-DD")+".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      // New Promise-based usage:
      html2pdf().from(element).set(opt).save();
    },
  },
});
</script>
