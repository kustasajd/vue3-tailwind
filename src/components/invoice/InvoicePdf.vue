<template>
  <div class="p-2">
    <!-- Invoice Detail -->
    <div>
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-lg font-semibold">Invoice #{{invoiceId }}</h3>
      </div>
      <div class="">
        <div
          class="rounded bg-white overflow-hidden shadow-lg mt-2 px-2 py-2 flex"
        >
          <div>
            <div class="text-gray-900 text-sm mb-2">
              <div class="block w-24 h-12 overflow-hidden border rounded object-centain mb-4" v-if="user && user.user && user.user.selectedSite">
                <img
                  class="w-full h-full object-contain"
                  :src="
                    user.user.selectedSite.logoUrl
                      ? user.user.selectedSite.logoUrl
                      : '../../src/assets/images/Default-Logo.svg'
                  "
                />
              </div>
              {{ invoice.site.brandName }}<br>
              {{ invoice.site.legalName }}<br>
              ABN: {{ invoice.site.abn }}<br>
              {{ invoice.site.addressStreet }}
            </div>

            <div class="text-gray-900 font-semibold text-base mb-1 mt-2">Client</div>
            <p class="text-gray-700 text-sm mb-1">
              {{ invoice.client.tradingName }}<br>
              {{ invoice.client.legalName }}<br>
              ABN: {{ invoice.client.abn }}
            </p>
            <div class="text-gray-900 font-semibold text-base mb-1 mt-2">Invoice</div>
            <p class="text-gray-700 text-sm mb-1">
              Invoice #{{invoiceId }}<br>
              Date: {{ getDate(invoice.dateCreated) }}<br>
              Due: {{ getDate(invoice.dueDate) }}<br>
              Terms: {{ invoice.termsDays }} days
            </p>
            <div class="text-gray-900 font-semibold text-base mb-1 mt-2">Charges</div>
            <div class="text-gray-700 text-sm mb-1">
              New Charges: {{ invoice.currency.symbol}}{{ parseFloat(getTotal(invoice.chargeRegisters)).toFixed(2) }}<br />
              Tax: {{ invoice.currency.symbol}}{{ parseFloat(getTotalTax(invoice.chargeRegisters)).toFixed(2) }}<br />
              <div class="font-bold text-base bg-orange-300 p-2 mt-1">TOTAL DUE: {{ invoice.currency.symbol}}{{  (parseFloat(getTotal(invoice.chargeRegisters)) + parseFloat(getTotalTax(invoice.chargeRegisters))).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary  -->
    <div class="mt-4">
      <h3 class="text-gray-700 text-xl font-bold">Summary</h3>
      <div v-if="zoneProductCharges.length>0">
        <div class="-mx-2 -my-3 p-2 overflow-x-auto">
          <h3 class="text-gray-700 text-lg font-medium">Zone and Product charges</h3>
          <div
            class="inline-block min-w-full shadow rounded-lg overflow-hidden"
          >
            <table class="min-w-full leading-normal">
              <thead>
                <tr>                      
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Count
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Tax
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, i) in zoneProductCharges" :key="i">
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                      <span v-if="product.optionName">{{product.optionName}}-</span>
                      <span class="material-icons mr-3" v-if="product.icon">{{product.icon}}</span>
                      {{product.name}} 
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{product.count}}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">                          
                      {{user.user.selectedSite.currency.symbol}}{{product.totalRate.toFixed(2)}}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">   
                      {{user.user.selectedSite.currency.symbol}}{{product.totalTax.toFixed(2)}}                       
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div  v-if="otherCharges.length>0">
        <div class="-mx-2 -my-3 p-2 overflow-x-auto">
          <h3 class="text-gray-700 text-lg font-medium">Other Charge Register</h3>
          <div
            class="inline-block min-w-full shadow rounded-lg overflow-hidden"
           
          >
            <table class="min-w-full leading-normal">
              <thead>
                <tr>                      
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Count
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Tax
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, i) in otherCharges" :key="i">
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                      <span v-if="product.optionName">{{product.optionName}}-</span>
                      <span class="material-icons mr-3" v-if="product.icon">{{product.icon}}</span>
                      {{product.name}} 
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{product.count}}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">                          
                      {{user.user.selectedSite.currency.symbol}}{{product.totalRate.toFixed(2)}}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">   
                      {{user.user.selectedSite.currency.symbol}}{{product.totalTax.toFixed(2)}}                       
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>


    <!-- Charge Register  -->
    <div class="mt-4">
      <h3 class="text-gray-700 text-xl font-bold">Charges</h3>
      <div class="">
        <div class="-mx-2 -my-3 p-2 overflow-x-auto">
          <div
            class="inline-block min-w-full shadow rounded-lg overflow-hidden"
          >
            <table class="min-w-full leading-normal">
              <thead>
                <tr>                      
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Charge Type
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Rate
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Tax
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in invoice.filteredCharge"
                  :key="index"
                >
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                      <span v-if="item.siteProductPricing && item.siteProductPricing.optionName">{{item.siteProductPricing.optionName}}-</span>
                      <span class="material-icons mr-3" v-if="item.product.icon">{{item.product.icon}}</span>
                      {{ item.product.name }}
                      {{ item.siteZone ? ' - ' + item.siteZone.friendlyName : '' }}
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
                      <span>{{parseFloat(item.quantity)}} x {{invoice.currency.symbol}}{{parseFloat(item.rate).toFixed(2)}} = {{invoice.currency.symbol}}{{parseFloat(item.rateTotal).toFixed(2)}}</span>
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">                          
                      <span>{{invoice.currency.symbol}}{{parseFloat(item.rateTotal*item.taxRate.taxPercentage/100).toFixed(2)}}({{item.taxRate.tax}})</span>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
          <div class="mt-8">
            <div>{{ invoice.site.legalName }}</div>
            <div>{{ invoice.site.addressStreet }}</div>
            <div>Tel {{ invoice.site.phone }}</div>
            <div>Email {{ invoice.site.email }}</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getDate, removeDuplicates } from "../../helpers/index";

export default defineComponent({
  props: ["invoiceId", "invoice"],
  data: () => ({
    zoneProductCharges: [],
    otherCharges: []
  }),
  setup() {
    const user = JSON.parse(localStorage.getItem("user"))
    return { getDate, removeDuplicates, user };
  },
  created() {
    const type1 = this.invoice.chargeRegisters.filter(item => { return item.siteZoneId })
    const type2 = this.invoice.chargeRegisters.filter(item => { return !item.siteZoneId && item.licenceProductId })
    const type3 = this.invoice.chargeRegisters.filter(item => { return !item.siteZoneId && !item.licenceProductId })
    this.zoneProductCharges = this.getByProduct(type1.concat(type2) || [])
    this.otherCharges = this.getByProduct(type3 || [])
    this.invoice.filteredCharge = this.invoice.chargeRegisters.filter(item => { return (item.siteZoneId === null && item.licenceProductId === null) })
  },
  methods: {
    getTotal: function (chargeRegisters) {
      let total = 0;
      chargeRegisters.forEach((item) => {
        total += item.rateTotal;
      });
      return total.toFixed(2);
    },
    getTotalTax: function (chargeRegisters) {
      let total = 0;
      chargeRegisters.forEach((item) => {
        total += item.rateTotal*item.taxRate.taxPercentage/100;
      });
      return total.toFixed(2);
    },
    getByProduct: function(chargeRegisters) {
      let products = []
      chargeRegisters.forEach(chargeRegister => {
        products.push(chargeRegister.product)
      });
      products = this.removeDuplicates(products, 'productId')
      products.forEach(product => {
        product.count = 0
        product.totalRate = 0
        product.totalTax = 0
        chargeRegisters.forEach(chargeRegister => {
          if (product.productId === chargeRegister.productId) {
            product.count++
            product.totalTax += chargeRegister.rateTotal*(chargeRegister.taxRate.taxPercentage/100)
            product.totalRate += chargeRegister.rateTotal
            if (chargeRegister.siteProductPricing && chargeRegister.siteProductPricing.optionName) product.optionName = chargeRegister.siteProductPricing.optionName
          }
        });      
      });
      return products
    }
  },
});
</script>
    