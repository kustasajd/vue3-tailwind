<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
      <Header />
    <div v-if="!isLoading" class="p-6 element-to-print">
      <!-- Site Detail -->
      <div class="">
        <div class="flex justify-between">
          <div class="text-gray-700 text-3xl font-semibold">
            Licence Confirmation Form
          </div>
          <div class="block w-24 h-12 overflow-hidden border rounded object-centain" v-if="user && user.user && user.user.selectedSite">
            <img class="w-full h-full object-contain" :src="user.user.selectedSite.logoUrl"/>
          </div>  
          <div>
            <h3 class="text-gray-700 text-xl font-semibold">
            Licence #{{ licence.licenceId }}
            </h3>
          </div>
        </div>
        
        <div class="mt-3 mb-3 p-3 shadow-lg">
          <div class="rounded bg-white overflow-hidden">
              <div class="">Licence Agrement between</div>
              <div class="text-gray-900 text-base italic mb-2 px-6 pt-2">
                <div>{{ site.brandName }}</div>
                <div>{{ site.legalName }}</div>
                <div>ABN: {{ site.abn }}</div>
                <div>{{ site.addressStreet }}</div>
              </div>
              <div class="">and</div>
              <div class="text-gray-900 text-base mb-2 italic px-6 pt-2">
                <div>{{ licence.client.brandName }}</div>
                <div>{{ licence.client.legalName }}</div>
                <div>ABN: {{ licence.client.abn }}</div>
                <div>{{ licence.client.primaryContact }}</div>
                <div>{{ licence.client.email }}</div>
                <div>{{ licence.client.phone }}</div>
                <div>{{ licence.client.mobile }}</div>
              </div>

          </div>
        </div>
      </div>
      <!-- Agreement Terms -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Agreement Terms</h3>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="text-gray-900 font-bold text-lg">Licence <span>#{{ licence.licenceId }}</span></div>
              <div class="text-gray-900 text-lg">Commencement: {{ formatDate(licence.licenceStart) }}</div>
              <div class="text-gray-900 text-lg">Review: {{ formatDate(licence.validUntil) }}</div>
              <div class="text-gray-900 text-lg">Term: {{ getMonthDiff(licence.licenceStart, licence.validUntil) }}</div>
              <div class="text-gray-900 text-lg">Invoicing Day: {{ licence.invoicingDay }}</div>
              <div class="text-gray-900 text-lg">Payment Terms: {{ licence.paymentTermsDaysFromInvoice }} days</div>
              <div class="text-gray-900 text-lg">Notes</div>
              <p class="text-gray-700 text-lg italic mb-4 whitespace-pre">
                {{ licence.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Furniture -->
      <div class="mt-8" v-if="licence.furnitureNote" >
        <h3 class="text-gray-700 text-3xl font-medium">Furniture</h3>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <span class="text-gray-700 text-base mb-4 font-normal whitespace-pre">
                {{ licence.furnitureNote ? licence.furnitureNote : '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Documents -->
      <div class="mt-8" v-if="licence.licenceDocuments.length>0">
        <h3 class="text-gray-700 text-3xl font-medium">Documents</h3>
        <div class="mt-6">
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
                      Document
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in licence.licenceDocuments"
                    :key="index"
                  >
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.description }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Zones -->
      <div class="mt-8" v-if="licence.licenceZones.length>0">
        <h3 class="text-gray-700 text-3xl font-medium">Zones</h3>
        <div class="mt-6">
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
                      ID
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Zone
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Building Level 
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Size
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Charge
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Start date
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in licence.licenceZones"
                    :key="index"
                  >
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteZone.siteZoneId }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteZone.zoneType.name }} - {{ item.siteZone.friendlyName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteZone.buildingLevel }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ parseFloat(item.siteZone.squareMeters).toFixed(2) }}sqm - 
                        {{ parseFloat(item.siteZone.workstations) }} Workstations
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.productChargeType.type }} - {{site.currency.symbol}}{{ parseFloat(item.rate).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{getDate(item.startDate)}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.active?'Active':'Inactive' }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="p-4">Total Zones {{licence.licenceZones.length}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Products -->
      <div class="mt-8">
        <div class="mt-6" v-for="(type, i) in productTypes" :key="i">
          <h3 class="text-gray-700 text-xl font-medium">{{type.type}}</h3>
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
                      	
                    </th>	
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in licence[type.type]"
                    :key="index"
                  >
                    <td	
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"	
                    >	
                      <p class="text-gray-900 whitespace-no-wrap flex items-center">	
                        <span class="material-icons mr-3" v-if="item.product.icon">{{item.product.icon}}</span>
                        {{ item.product.name }}
                      </p>	
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ site.currency.symbol}}{{ parseFloat(item.overridePrice).toFixed(2) }}
                        {{ item.paidInAdvance?'(Paid in Advance)':'' }}	
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
          <div class="flex">
            <div class="text-gray-700 text-xl font-medium mr-4">
              Sub Total: 
              {{site.currency.symbol}}{{(getTotal(licence[type.type])).toFixed(2)}},
            </div>
            <div class="text-gray-700 text-xl font-medium mr-4">
              Plus Tax: 
              {{site.currency.symbol}}{{(getTotalTax(licence[type.type])).toFixed(2)}}
            </div>
          </div>
          
        </div>
      </div>
      <!-- Signature -->
      <div class="mt-16 pb-6">
        <h3 class="text-gray-700 text-3xl font-semibold">
          Signature
        </h3>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <p class="text-gray-700 text-base mb-6 italic">
                Your Full Client Agreement will require signing after this Client Agreement Form.<br /> 
                Agreement fees & charges are payable by the 1st of the month by direct withdrawal (attached). <br />
                If no guarantors are listed, the bond required ill be twice the usual monthly bond.
              </p>
              <div class="grid grid-cols-3">
                <div class="text-gray-700 text-base mb-4 italic">
                  <span class="w-26">Signature </span>
                  __________________________
                </div>
                <div class="text-gray-700 text-base mb-4 italic">
                  Position __________________________(If Company)
                </div>
                <div></div>
                <div class="text-gray-700 text-base mb-4 italic">
                  Name (Print) <span class="underline">{{ licence.client.primaryContact }}</span>_______________
                </div>
                <div class="text-gray-700 text-base mb-4 italic">
                  Date: __________________________
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div class="mt-12">
            <div>{{ site.legalName }}</div>
            <div>{{ site.addressStreet }}</div>
            <div>Tel {{ site.phone }}</div>
            <div>Email {{ site.email }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import { useToast } from "vue-toastification";
import { getDate, formatDate, removeDuplicates } from "../../helpers/index";
import Header from "../../components/Header.vue";

export default defineComponent({
  components: {
    Header,
  },
  data: () => ({
    isLoading: true,
    licenceId: null,
    licence: {},
    siteId: null,
    productTypes: []
  }),
  setup() {
    const toast = useToast();
    return {
      getDate, formatDate, removeDuplicates, toast
    };
  },
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.user = JSON.parse(localStorage.getItem("user"))
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.licenceId = this.$route.params.licenceId;
    this.$store.dispatch("licences/getById", {
      id: this.licenceId,
    });
  },
  watch: {
    "$store.state.licences.licence": function () {
      this.licence = this.$store.state.licences.licence.licence;
      if (this.licence) {
        this.licence.licenceProducts.forEach(item => {
          this.productTypes.push(item.licenceProductType)          
        });
        this.productTypes = this.removeDuplicates(this.productTypes, 'licenceProductTypeId')
        this.productTypes.forEach(item => {
          this.licence[item.type] = this.licence.licenceProducts.filter((el)=> { return el.licenceProductTypeId === item.licenceProductTypeId })
        });
      }
      this.checkLoading();
    },
    "$store.state.licences.licenceDocument": function () {
      this.licenceDocument = this.$store.state.licences.licenceDocument.licenceDocument;
      if (this.licenceDocument && this.licenceDocument.originalDocUrl) {
        let win = window.open();
        win.document.write(
          '<iframe src="' +
            this.licenceDocument.originalDocUrl +
            '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
        );
      } else if (this.licenceDocument && !this.licenceDocument.originalDocUrl) {
        this.toast.info("There is no document for preview!");
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.licences.licence.licence) {
        this.isLoading = false;
      }
    },
    getTotal: function (products) {
      let total = 0
      products.forEach(element => {
        element.product.chargeRegisters.forEach(item => {
          total += item.rateTotal
        });
      });
      return total
    },
    getTotalTax: function (products) {
      let total = 0
      products.forEach(element => {
        element.product.chargeRegisters.forEach(item => {
          total += item.rateTotal * item.taxRate.taxPercentage/100
        });
      });
      return total
    },
    getMonthDiff: function(licenceStart, validUntil) {
      if (validUntil && licenceStart) {
        const start = moment(licenceStart).format("YYYY-MM-DD");
        const end = moment(validUntil).format("YYYY-MM-DD");
        return moment(end).diff(moment(start), 'months')+1 +' months'
      } else {
        return '-'
      }
    }
  },
});
</script>
