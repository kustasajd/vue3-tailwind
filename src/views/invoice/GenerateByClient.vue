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
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-gray-700 text-3xl font-medium">
          {{ site.brandName }} - {{ client.tradingName }} - Invoices
        </h3>
      </div>
      <div
        class="mt-0"
      >
        <h3 class="text-gray-700 text-3xl font-medium">
          Licences
        </h3>
        <div class="mt-0">
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
                      Licence Id
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Licence Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Invoice Day
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in licenceZones" :key="index">                    
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        Licence#{{ item.licenceId }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.licenceType.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.invoicingDay }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <span class="text-gray-700 text-xl">
            <span class="font-bold">Total Cost: </span>
            <span>{{site.currency.symbol}}{{(this.totalCost).toFixed(2)}}</span>
          </span>
           
        </div>
      </div>
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">
          Charge Register
        </h3>
        <!-- Summary -->
        <div>
          <h3 class="text-gray-700 text-xl font-medium">Summary</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
            >
              <div>
                <div v-for="(product, i) in products" :key="i">
                  {{product.name}} - {{product.count}} items - {{site.currency.symbol}}{{parseFloat(product.totalRate).toFixed(2)}} + {{site.currency.symbol}}{{parseFloat(product.totalTax).toFixed(2)}} GST
                </div>
                <button
                  @click="onShowDetail()"
                  class="py-1 px-4 text-center bg-gray-600 rounded-md text-white text-sm hover:bg-gray-800 mt-4"
                >
                  More
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Paid in Advance -->      
        <div class="mt-4" v-if="advanceInvoices.length>0 && showDetail === true">
          <h3 class="text-gray-700 text-xl font-medium">
            Paid in Advance
          </h3>
          <div class="mt-0">
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
                        Product
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Notes
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Added date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in advanceInvoices" :key="index">                    
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                          <span class="material-icons mr-3" v-if="item.product.icon">{{item.product.icon}}</span>
                          {{ item.product.name }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">                          
                          <span>{{item.currency.symbol}}{{parseFloat(item.rateTotal).toFixed(2)}} </span>
                          <span> ({{parseFloat(item.quantity)}} x {{item.currency.symbol}}{{parseFloat(item.rate).toFixed(2)}})</span>
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.notes }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ getDate(item.timestamp) }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="text-gray-700 text-xl">
              <span class="mr-4">
                <span class="font-bold">Sub-Total: </span> 
                <span>{{site.currency.symbol}}{{getSubTotalRateCharge(advanceInvoices)}},</span>
              </span>
              <span class="mr-4">
                <span class="font-bold">Tax: </span> 
                <span>{{site.currency.symbol}}{{getTotalTaxCharge(advanceInvoices)}},</span>
              </span>
              <span class="mr-4">
                <span class="font-bold">Total: </span> 
                <span>{{site.currency.symbol}}{{getTotalRateCharge(advanceInvoices)}}</span>
              </span>
            </div>
          </div>
        </div>
            <div class="text-gray-700 text-xl">
              <span class="mr-4">
                <span class="font-bold">Sub-Total: </span> 
                <span>{{site.currency.symbol}}{{getSubTotalRateCharge(arrearsInvoices)}},</span>
              </span>
              <span class="mr-4">
                <span class="font-bold">Tax: </span> 
                <span>{{site.currency.symbol}}{{getTotalTaxCharge(arrearsInvoices)}},</span>
              </span>
              <span class="mr-4">
                <span class="font-bold">Total: </span> 
                <span>{{site.currency.symbol}}{{getTotalRateCharge(arrearsInvoices)}}</span>
              </span>
            </div>
        <!-- Paid in Arrears -->
        <div class="mt-4" v-if="arrearsInvoices.length>0 && showDetail === true">
          <h3 class="text-gray-700 text-xl font-medium">
            Paid in Arrears
          </h3>
          <div class="mt-0">
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
                        Product
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Notes
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Added date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in arrearsInvoices" :key="index">                    
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                          <span class="material-icons mr-3" v-if="item.product.icon">{{item.product.icon}}</span>
                          {{ item.product.name }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">                          
                          <span>{{item.currency.symbol}}{{parseFloat(item.rateTotal).toFixed(2)}} </span>
                          <span> ({{parseFloat(item.quantity)}} x {{item.currency.symbol}}{{parseFloat(item.rate).toFixed(2)}})</span>
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.notes }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ getDate(item.timestamp) }}
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
      <!-- Product charges -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">
          Product charges
        </h3>
        <div class="mt-0">
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
                      product
                    </th>                    
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      charge type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      licence product type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      tax rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in productCharges" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                        <span class="material-icons mr-3" v-if="item.product.icon">{{item.product.icon}}</span>
                        {{ item.product.name }}
                      </p>
                    </td>                    
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.productChargeType.type }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.licenceProductType.type }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{site.currency.symbol}}{{ item.overridePrice }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{this.site.currency.symbol}}{{parseFloat(item.overridePrice*item.taxRate.taxPercentage/100).toFixed(2)}}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="text-gray-700 text-xl">
            <span class="mr-4">
              <span class="font-bold">Sub-Total: </span> 
              <span>{{site.currency.symbol}}{{getSubTotalRateProduct(productCharges)}},</span>
            </span>
            <span class="mr-4">
              <span class="font-bold">Tax: </span> 
              <span>{{site.currency.symbol}}{{getTotalTaxProduct(productCharges)}},</span>
            </span>
            <span class="mr-4">
              <span class="font-bold">Total: </span> 
              <span>{{site.currency.symbol}}{{getTotalRateProduct(productCharges)}}</span>
            </span>
          </div>
        </div>
      </div>
      <!-- Zone charges -->
      <div class="mt-8 pb-6">
        <h3 class="text-gray-700 text-3xl font-medium">
          Zone charges
        </h3>
        <div class="mt-0">
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
                      Friendly Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Licence Id
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Product ChargeType
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Total inc tax
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Tax
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Start Date
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in zoneCharges" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteZone.friendlyName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        Licence#{{ item.licenceId }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.productChargeType.type }}
                      </p>
                    </td>                    
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{this.site.currency.symbol}}{{ parseFloat(item.rate + item.rate*item.taxRate.taxPercentage/100).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{this.site.currency.symbol}}{{parseFloat(item.rate*item.taxRate.taxPercentage/100).toFixed(2)}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getDate(item.startDate) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.notes }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="text-gray-700 text-xl">
            <span class="mr-4">
              <span class="font-bold">Sub-Total: </span> 
              <span>{{site.currency.symbol}}{{getSubTotalRateZone(zoneCharges)}},</span>
            </span>
            <span class="mr-4">
              <span class="font-bold">Tax: </span> 
              <span>{{site.currency.symbol}}{{getTotalTaxZone(zoneCharges)}},</span>
            </span>
            <span class="mr-4">
              <span class="font-bold">Total: </span> 
              <span>{{site.currency.symbol}}{{getTotalRateZone(zoneCharges)}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from 'vue-meta'
import { getDate, getPermission, removeDuplicates, multiSort } from "../../helpers/index";
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
    clientId: null,
    site: {},
    client: {},
    outStandings: [],
    products: [],
    advanceInvoices: [],
    arrearsInvoices: [],
    licenceZones: [],
    zoneCharges: [],
    productCharges: [],
    totalCost: 0,
    hasPermission: false,
    showDetail: false
  }),
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getDate, getPermission, removeDuplicates, multiSort, metaData };
  },
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.siteId = this.$route.params.siteId;
    this.clientId = this.$route.params.clientId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("clients/getById", {
        id: this.clientId,
      });
      this.$store.dispatch("invoices/getOutStandings", {
        siteId: this.siteId,
        clientId: this.clientId,
      });
      this.$store.dispatch("licences/getLicenceZonesByClient", {
        siteId: this.siteId,
        clientId: this.clientId,
      });
    }
  },
  watch: {
    "$store.state.clients.client": function () {
      this.client = this.$store.state.clients.client.client;
      this.checkLoading();
    },
    "$store.state.invoices.outStandings": function () {
      this.outStandings = this.$store.state.invoices.outStandings.outStandings;
      if (this.outStandings) {        
        this.outStandings.forEach(item => {
          item.productName = item.product.name
          item.timeStamp = (new Date(item.timestamp).getTime()/1000)
          if (item.paidInAdvance === false) {
            this.arrearsInvoices.push(item)
          } else if (item.paidInAdvance === true) {
            this.advanceInvoices.push(item)
          }
          this.advanceInvoices = this.multiSort(this.advanceInvoices, 'productName', 'timeStamp')
          this.arrearsInvoices = this.multiSort(this.arrearsInvoices, 'productName', 'timeStamp')
          this.products.push(item.product)
        });
        this.products = this.removeDuplicates(this.products, 'productId')
        this.products.forEach(product => {
          product.totalRate = 0
          product.totalTax = 0
          product.count = 0
          this.outStandings.forEach(chargeRegister => {
            if (chargeRegister.productId === product.productId) {
              product.count++
              product.totalRate += chargeRegister.rateTotal
              product.totalTax += chargeRegister.rateTotal * (chargeRegister.taxRate.taxPercentage/100)
            }
          });
        });

        this.checkLoading();
      }
    },
    "$store.state.licences.licenceZones": function () {
      this.licenceZones = this.$store.state.licences.licenceZones.licenceZones;
      if (this.licenceZones) {
        this.licenceZones.forEach(item => {
          this.zoneCharges = this.zoneCharges.concat(item.licenceZones);
          this.productCharges = this.productCharges.concat(item.licenceProducts);
        });
        this.zoneCharges = this.removeDuplicates(this.zoneCharges, 'licenceZoneId')
        this.zoneCharges = this.zoneCharges.filter(item=> { return item.active === true })
        this.productCharges = this.removeDuplicates(this.productCharges, 'licenceProductId')
        this.productCharges = this.productCharges.filter(item=> { return item.active === true && item.licenceProductTypeId === 2 })
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.clients.client.client &&
        this.$store.state.invoices.outStandings.outStandings && 
        this.$store.state.licences.licenceZones.licenceZones
      ) {
        this.linkItems = this.getLinkItems();
        this.getTotal()
        this.metaData.meta.title = `Generate Invoices | ${this.client.tradingName} | ${this.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: this.site.brandName + " - invoices",
          name: "Invoices",
          params: {
            siteId: this.site.siteId,
          },
        },
      ];
    },
    getTotal: function() {
      this.totalCost = 0
      this.outStandings.forEach(element => {
        this.totalCost += element.rateTotal * (element.taxRate.taxPercentage/100 + 1)
      });
      this.zoneCharges.forEach(element => {
        this.totalCost += element.rate * (element.taxRate.taxPercentage/100 + 1)
      });
      this.productCharges.forEach(element => {
        this.totalCost += element.overridePrice * (element.taxRate.taxPercentage/100 + 1)
      });
    },
    getSubTotalRateCharge: function(chargeRegisters) {
      let total = 0
      chargeRegisters.forEach(element => {
        total += element.rateTotal
      });
      return (total).toFixed(2)
    },
    getTotalTaxCharge: function(chargeRegisters) {
      let total = 0
      chargeRegisters.forEach(element => {
        total += element.rateTotal * element.taxRate.taxPercentage / 100
      });
      return (total).toFixed(2)
    },
    getTotalRateCharge: function(chargeRegisters) {
      let total = 0
      chargeRegisters.forEach(element => {
        total += element.rateTotal + element.rateTotal * element.taxRate.taxPercentage / 100
      });
      return (total).toFixed(2)
    },
    getSubTotalRateProduct: function(productCharges) {
      let total = 0
      productCharges.forEach(element => {
        total += element.overridePrice
      });
      return (total).toFixed(2)
    },
    getTotalTaxProduct: function(productCharges) {
      let total = 0
      productCharges.forEach(element => {
        total += element.overridePrice * element.taxRate.taxPercentage / 100
      });
      return (total).toFixed(2)
    },
    getTotalRateProduct: function(productCharges) {
      let total = 0
      productCharges.forEach(element => {
        total += element.overridePrice + element.overridePrice * element.taxRate.taxPercentage / 100
      });
      return (total).toFixed(2)
    },
    getSubTotalRateZone: function(zoneCharges) {
      let total = 0
      zoneCharges.forEach(element => {
        total += element.rate
      });
      return (total).toFixed(2)
    },
    getTotalTaxZone: function(zoneCharges) {
      let total = 0
      zoneCharges.forEach(element => {
        total += element.rate * element.taxRate.taxPercentage / 100
      });
      return (total).toFixed(2)
    },
    getTotalRateZone: function(zoneCharges) {
      let total = 0
      zoneCharges.forEach(element => {
        total += element.rate + element.rate * element.taxRate.taxPercentage / 100
      });
      return (total).toFixed(2)
    },
    onShowDetail: function () {
      this.showDetail = !this.showDetail
    }
  },
});
</script>