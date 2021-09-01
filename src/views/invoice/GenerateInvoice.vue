<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <no-permission :isLoading="isLoading" :hasPermission="hasPermission" />
    <div v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Generate Invoices - Review
          </h3>
          <div class="text-center" v-if="outstandingClients.length>0">
            <button
              @click="onGenerate()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md text-white text-sm hover:bg-gray-800"
            >
              Execute Invoice Generation
            </button>
          </div>
        </div>
        <div class="mt-8">
          <h3 class="text-gray-700 text-xl font-semibold">
            Invoice Generation Summary
          </h3>
          <div class="mt-6">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">
                  {{ numClient }} Clients, {{ numLicence }} Licences
                </div>
                <div class="text-gray-900 font-bold text-lg mt-6">
                  Charge Register
                </div>
                <p class="text-gray-700 text-base mb-4">
                  {{ site.currency.symbol }}{{ totalChargeRegister.toFixed(2) }}
                </p>
                <div class="text-gray-900 font-bold text-lg">
                  Zones
                </div>
                <p class="text-gray-700 text-base mb-4">
                  {{ site.currency.symbol }}{{ totalZoneCharges.toFixed(2) }}
                </p>
                <div class="text-gray-900 font-bold text-lg">
                  Monthly Products
                </div>
                <p class="text-gray-700 text-base mb-4">
                  {{ site.currency.symbol }}{{ totalProductCharges.toFixed(2) }}
                </p>
                <div class="text-gray-900 font-bold text-lg mt-6">
                  Total outstanding
                </div>
                <p class="text-gray-700 text-base mb-4">
                  {{ site.currency.symbol }}{{ totalValue.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <h3 class="text-gray-700 text-xl font-semibold">
            Invoices to be generated:
          </h3>
          <div class="">
            <label class="text-gray-900 mb-2" for="timestamp"
              >Invoice Generation Date</label
            >
            <div class="mt-1">
              <a-date-picker class="" size="large" @change="onChangeFilterTime" :defaultValue="getDate(timestamp)"/>
            </div>
          </div>
          <div class="">
            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div
                class="inline-block min-w-full shadow rounded-lg overflow-hidden"
              >
                <table class="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Client
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Charge Register
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Zones
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Products
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Invoicing Day
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Last Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in filtered"
                      :key="index"
                    >
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >      
                        <div class="font-bold">{{ item.tradingName }}</div>
                        <router-link
                          :to="{
                            name: 'GenerateByClient',
                            params: {
                              siteId: siteId,
                              clientId: item.clientId,
                            },
                          }"
                          class="text-indigo-600 hover:text-indigo-900 mr-4"
                          >Preview Invoice
                        </router-link>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap font-semibold">
                          {{ site.currency.symbol + (item.total+item.zoneTotalCharges+item.productTotalCharges).toFixed(2) }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.total==0?'': site.currency.symbol + item.total.toFixed(2) }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.zoneTotalCharges==0?'': site.currency.symbol + item.zoneTotalCharges.toFixed(2) }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.productTotalCharges==0?'': site.currency.symbol + item.productTotalCharges.toFixed(2) }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <span class="text-gray-900 whitespace-no-wrap">
                          <div
                            v-for="(licence, i) in item.licences"
                            :key="i"
                            class="mr-2"
                          >                            
                            <router-link
                              :to="{
                                name: 'LicenceDetail',
                                params: {
                                  licenceId: licence.licenceId,
                                },
                              }"
                              class="text-indigo-600 hover:text-indigo-900"
                              >Licence #{{ licence.licenceId }}
                            </router-link>
                             - Invoice day {{licence.invoicingDay}}th
                          </div>
                        </span>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.lastInvoice ? getDate(item.lastInvoice) : 'n/a' }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from 'moment'
import { getPermission } from '../../helpers/index'
import { getDate, getDaysDiffNum } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue"

export default defineComponent({
  components: {
    Breadcrumb,
    NoPermission
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    siteId: null,
    site: {},
    clients: [],
    hasPermission: false,
    outstandingClients: [],
    numClient: 0,
    numLicence: 0,
    totalValue: 0,
    totalChargeRegister: 0,
    totalProductCharges: 0,
    totalZoneCharges: 0
  }),
  setup() {
    return { getPermission, getDate, getDaysDiffNum }
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.timestamp = this.getDate(new Date())
      this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
      this.$store.dispatch("invoices/getOutstandingClients", { id: this.siteId });
    }
  },
  watch: {
    "$store.state.invoices.outstandingClients": function () {
      this.outstandingClients = this.$store.state.invoices.outstandingClients.outstandingClients;
      if (this.outstandingClients) {
        this.filterItems(this.timestamp);
        this.checkLoading();    
      }
    },
    "$store.state.invoices.generatedInvoices": function () {
      this.generatedInvoices = this.$store.state.invoices.generatedInvoices.generatedInvoices;
      if (this.generatedInvoices && this.generatedInvoices.length>0) {
        this.isLoading = false
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.invoices.outstandingClients.outstandingClients) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "invoices",
          name: "Invoices",
          params: {
            siteId: this.siteId,
          },
        },
      ];
    },
    onGenerate: function () {
      this.isLoading = true
      this.$store.dispatch("invoices/generateInvoices", {outstandingClients: this.filtered, site: this.site});
    },
    onChangeFilterTime(date, dateString) {
      this.timestamp = dateString
      this.filterItems(dateString)
    },
    filterItems(timestamp) {
      this.numLicence = 0
      this.totalChargeRegister = 0
      this.totalValue = 0
      this.totalZoneCharges = 0
      this.totalProductCharges = 0      
      this.outstandingClients.forEach(item => {
        item.total = 0
        item.zoneTotalCharges = 0
        item.productTotalCharges = 0
        item.chargeRegisters.forEach(element => {
          element.daysDiff = this.getDaysDiffNum(timestamp, element.timestamp)
        });
        item.chargeRegisters = item.chargeRegisters.filter(element => { return element.daysDiff <= 0 })
        item.chargeRegisters.forEach(element => {
          if (!element.invoice) {
            item.total += element.rateTotal * (1+element.taxRate.taxPercentage/100)
          }
          if (element.invoice) {
            if (!item.lastInvoice) {
              item.lastInvoice = element.invoice.dateCreated
            } else {
              const a = moment([item.lastInvoice]);
              const b = moment([element.invoice.dateCreated]);
              if (a.diff(b, 'days')<0)
                item.lastInvoice = element.invoice.dateCreated
            }
          }
        });
        item.licences.forEach(element => {
          element.daysDiff = this.getDaysDiffNum(timestamp, element.createDate)
        });
        item.licences = item.licences.filter(element => { return element.daysDiff <= 0 })
        item.licences.forEach(element => {
          element.licenceZones.forEach(zone => {
            if (zone.active === true) item.zoneTotalCharges += zone.rate * (zone.taxRate.taxPercentage/100 + 1)
          });
          element.licenceProducts.forEach(product => {
            if (product.active === true && product.licenceProductTypeId === 2) item.productTotalCharges += product.overridePrice * (product.taxRate.taxPercentage/100 + 1)
          });
        });
        if (item.licences.length > 0) {
          this.numLicence += item.licences.length
          this.totalChargeRegister += item.total
          this.totalValue += item.total + item.zoneTotalCharges + item.productTotalCharges
          this.totalZoneCharges += item.zoneTotalCharges
          this.totalProductCharges += item.productTotalCharges
        }
      });   
      this.filtered = this.outstandingClients.filter(client => { return client.licences.length>0 })
      this.numClient = this.filtered.length
    }
  },
});
</script>
