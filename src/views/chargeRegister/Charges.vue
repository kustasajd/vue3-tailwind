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
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">
          Charge Register
        </h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'AddCharge',
              params: { siteId: siteId },
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Add New Charge
          </router-link>
        </div>
      </div>
      <div>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="text-lg"><span class="italic">Total items:</span> {{ totalItemsNum }}</div>
              <span class="text-gray-900 whitespace-no-wrap">
                <div v-for="(product, i) in filteredProducts" :key="i">
                  <span class="text-gray-600 italic">
                  {{product.name}}:
                  </span>
                  <span class="text-gray-600">
                  {{product.count}} items
                  </span>
                  <span class="text-gray-600">
                  {{site.currency.symbol}}{{parseFloat(product.totalRate).toFixed(2)}}
                  </span>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between border-2 border-gray-600 rounded-md p-3 bg-gray-300 ">
        <span class="text-gray-700 text-xl font-semibold">Filters</span> 
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">Invoice</span> 
          <select-box
            nameField="name"
            valueField="value"
            :options="invoiceIncluded"
            :selectedValue="isInvoice"
            @onSelect="(value) => changeInvoice(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">Client</span> 
          <select-box
            nameField="tradingName"
            valueField="clientId"
            :options="clients"
            :selectedValue="clientId"
            @onSelect="(value) => changeClientId(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">Product</span> 
          <select-box
            nameField="name"
            valueField="productId"
            :options="products"
            :selectedValue="productId"
            @onSelect="(value) => changeProductId(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">Sort</span> 
          <select-box
            nameField="name"
            valueField="value"
            :options="sorts"
            :selectedValue="sortType"
            @onSelect="(value) => changeSortType(value)"
          ></select-box>
        </div>
      </div>
      <div class="">
        <div class="mt-2">
          <div class="-mx-4 sm:-mx-4 px-4 sm:px-4 py-4 overflow-x-auto">
            <div class="text-center my-2"><span class="text-gray-600 text-base">Showing {{this.charges.length}} charges</span></div>
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
                      Product
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Rate Total
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Charge Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Added By
                    </th>
                    <th
                      v-if="isInvoice === 'true' || isInvoice === true"
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Invoice Id
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Links
                    </th>
                    <th
                      v-if="isEditCharge"
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody v-if="charges">
                  <tr v-for="(item, index) in charges" :key="index">                    
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.client.tradingName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap flex items-center">
                        <span v-if="item.siteProductPricing && item.siteProductPricing.optionName">{{item.siteProductPricing.optionName}}-</span>
                        <span class="material-icons mr-3" v-if="item.product.icon">{{item.product.icon}}</span>
                        {{ item.product.name }}                        
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span>{{site.currency.symbol}}{{parseFloat(item.rateTotal).toFixed(2)}}</span>
                        <span> ({{parseFloat(item.quantity)}} x {{site.currency.symbol}}{{parseFloat(item.rate).toFixed(2)}})</span>
                      </p>
                    </td>                    
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{item.productChargeType.type}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getDate(item.timestamp) }}
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
                        {{ item.user.fullName }}
                      </p>
                    </td>
                    <td
                      v-if="item.invoice"
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'InvoiceDetail',
                          params: {
                            invoiceId: item.invoice.invoiceId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Invoice#{{item.invoice.invoiceId}}
                      </router-link>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        v-if="item.siteZoneId !== null"
                        :to="{
                          name: 'ZoneDetail',
                          params: {
                            siteId: siteId,
                            siteZoneId: item.siteZoneId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Zone#{{item.siteZoneId}}<br>
                      </router-link>
                      <router-link
                        v-if="item.licenceProductId !== null"
                        :to="{
                          name: 'LicenceDetail',
                          params: {
                            licenceId: item.licenceProduct.licenceId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Licence#{{item.licenceProduct.licenceId}}<br>
                      </router-link>
                      <router-link
                        v-if="item.roomReservations.length > 0"
                        :to="{
                          name: 'RoomReservationDetail',
                          params: {
                            roomReservationId: item.roomReservations[0].roomReservationId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Room#{{item.roomReservations[0].roomReservationId}}
                      </router-link>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      v-if="isEditCharge"
                    >
                      <router-link
                        v-if="item.invoice === null"
                        :to="{
                          name: 'UpdateCharge',
                          params: {
                            siteId: siteId,
                            chargeRegisterId: item.chargeRegisterId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Edit
                      </router-link>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getDate, getPermission, dynamicSort, removeDuplicates, dynamicSortDec } from "../../helpers/index";
import SelectBox from "../../components/common/SelectBox.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue"

export default defineComponent({
  components: {
    SelectBox,
    Breadcrumb,
    NoPermission
  },
  data: () => ({
    isLoading: true,
    siteId: null,
    site: {},
    charges: [],
    siteClients: [],
    clients: [],
    clientId: "all",
    products: [],
    productId: "all",
    isInvoice: false,
    invoiceIncluded: [
      {
        name: 'Included in invoice',
        value: true
      },
      {
        name: 'Not included in invoice',
        value: false
      }
    ],
    sorts: [
      {
        name: 'Client',
        value: 'clientTradingName'
      },
      {
        name: 'Product',
        value: 'ProductName'
      },
      {
        name: 'Time',
        value: 'timestamp'
      }
    ],
    sortType: 'timestamp',
    hasPermission: false,
    isEditCharge: false,
    isFirstLoading: true
  }),
  setup() {
    return {
      getDate,
      getPermission,
      dynamicSort,
      dynamicSortDec,
      removeDuplicates
    };
  },
  created() {
    this.siteId = this.$route.params.siteId;
    let user = JSON.parse(localStorage.getItem('user'))
    if (user && user.user && user.user.permissions && user.user.permissions) {
      user.user.permissions.forEach(element => {
        if (element.permission.name === 'charge edit delete') {
          this.isEditCharge = true
          return
        }
      });
    }
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
      this.filter();
    }
  },
  watch: {
    "$store.state.charges.charges": function () {
      this.charges = this.$store.state.charges.charges.charges;
      if (this.charges) {
        if (this.isFirstLoading) {
          // Get products and clients for filter
          this.products = []
          this.clients = []
          this.charges.forEach(chargeRegister => {
            chargeRegister.clientTradingName = chargeRegister.client.tradingName
            chargeRegister.ProductName = chargeRegister.product.name
            this.products.push(chargeRegister.product)
            this.clients.push(chargeRegister.client)
          });
          this.products = this.removeDuplicates(this.products, 'productId')
          this.clients = this.removeDuplicates(this.clients, 'clientId')
          this.clients = this.clients.sort(this.dynamicSort('tradingName'));
          this.products = [{ name: "All", productId: "all" }].concat(
            this.products
          );
          this.clients = [{ tradingName: "All", clientId: "all" }].concat(
            this.clients
          );
          this.isFirstLoading = false
        }
        

        if (this.isInvoice === 'true')
          this.charges = this.charges.filter(charge => { return charge.invoice !== null })
        this.changeSortType(this.sortType)        
        this.getSummary()
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.charges.charges.charges &&
        this.$store.state.sites.siteClients.siteClients &&
        this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId
      ) {
        this.isLoading = false;
      }
    },
    changeInvoice: function name(value) {
      this.isLoading = true;
      this.charges = [];
      this.isInvoice = value;
      this.isFirstLoading = true
      this.filter();
    },
    changeClientId: function (value) {
      this.isLoading = true;
      this.charges = [];
      this.clientId = value;
      this.filter();
    },
    changeProductId: function (value) {
      this.isLoading = true;
      this.charges = [];
      this.productId = value;
      this.filter();
    },
    filter: function () {
      if (this.isFirstLoading) {
        this.clientId = 'all'
        this.productId = 'all'
      }
      this.$store.dispatch("charges/filter", {
        siteId: this.siteId,
        isInvoice: this.isInvoice,
        clientId: this.clientId === "all" ? null : this.clientId,
        productId: this.productId === "all" ? null : this.productId,
      });
    },
    changeSortType: function (value) {
      this.isLoading = true
      this.sortType = value
      if (value === 'timestamp') {
        this.charges = this.charges.sort(this.dynamicSortDec(value));
      } else {
        this.charges = this.charges.sort(this.dynamicSort(value));
      }
      setTimeout(() => {
        this.isLoading = false
      }, 10);
    },
    getSummary: function () {
      this.totalItemsNum = this.charges.length;
      this.filteredProducts = []
      this.charges.forEach(chargeRegister => {
        chargeRegister.clientTradingName = chargeRegister.client.tradingName
        chargeRegister.ProductName = chargeRegister.product.name
        this.filteredProducts.push(chargeRegister.product)
      });
      this.filteredProducts = this.removeDuplicates(this.filteredProducts, 'productId')
      this.filteredProducts.forEach((product) => {
        product.count = 0;
        product.totalRate = 0;
        product.totalTax = 0;
        this.charges.forEach((chargeRegister) => {
          if (product.productId === chargeRegister.product.productId) {
            product.count++;
            product.totalRate += chargeRegister.rateTotal;
          }
        });
      });
    }
  },
});
</script>