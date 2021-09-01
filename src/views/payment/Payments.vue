<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />      
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-gray-700 text-3xl font-semibold">Payments</h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'CreatePayment',
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Add Payment
          </router-link>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-center">
          <select-box
            nameField="tradingName"
            valueField="clientId"
            :options="clients"
            :selectedValue="clientId"
            @onSelect="(value) => changeClientId(value)"
          ></select-box>
        </div>
        <div class="text-center">
          <select-box
            nameField="type"
            valueField="paymentTypeId"
            :options="paymentTypes"
            :selectedValue="paymentTypeId"
            @onSelect="(value) => changePaymentTypeId(value)"
          ></select-box>
        </div>
      </div>
      <div class="mt-8">
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
                      Client
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Invoice ID
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Payment Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Added By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filtered" :key="index">
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
                      <p class="text-gray-900 whitespace-no-wrap" v-if="!item.invoiceId">
                        -
                      </p>
                      <router-link
                        :to="{
                          name: 'InvoiceDetail',
                          params: { invoiceId: item.invoiceId },
                        }"
                        v-if="item.invoiceId"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Invoice#{{ item.invoiceId }}
                      </router-link>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{item.currency.symbol}}{{ parseFloat(item.amount).toFixed(2) }}
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
                        {{ item.paymentType.type }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.user.fullName }}
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getDate, dynamicSortDec, dynamicSort } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import SelectBox from "../../components/common/SelectBox.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    SelectBox,
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    payments: [],
    filtered: [],
    siteId: null,
    clients: [],
    clientId: "all",
    paymentTypes: [],
    paymentTypeId: "all"
  }),
  setup() {
    return { getDate, dynamicSortDec, dynamicSort };
  },
  created() {
    this.siteId = JSON.parse(
      localStorage.getItem("user")
    ).user.selectedSite.siteId;
    this.$store.dispatch("payments/getAll", { id: this.siteId });
    this.$store.dispatch("clients/getAll", { id: this.siteId });
    this.$store.dispatch("payments/getPaymentTypes");
  },
  watch: {
    "$store.state.payments.all": function () {
      this.payments = this.$store.state.payments.all.items;
      if (this.payments) {
        this.filtered = this.payments.sort(this.dynamicSortDec("timestamp"))
      }
      this.checkLoading();
    },
    "$store.state.clients.all": function () {
      this.clients = this.$store.state.clients.all.items;
      if (this.clients) {
        this.clients = this.clients.sort(this.dynamicSort("tradingName"));
        this.clients = [{ tradingName: "All", clientId: "all" }].concat(
          this.clients
        );
        this.checkLoading();
      }
    },
    "$store.state.payments.paymentTypes": function () {
      this.paymentTypes = this.$store.state.payments.paymentTypes.paymentTypes;
      if (this.paymentTypes) {
        this.paymentTypes = [{ type: "All", paymentTypeId: "all" }].concat(
          this.paymentTypes
        );
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.payments.all.items &&
        this.$store.state.clients.all.items &&
        this.$store.state.payments.paymentTypes.paymentTypes
      ) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Payments",
          name: "Payments",
          params: null,
        },
      ];
    },
    changeClientId: function (value) {
      this.filtered = [];
      this.clientId = value
      this.filter();
    },
    changePaymentTypeId: function (value) {
      this.filtered = [];
      this.paymentTypeId = value;
      this.filter();
    },
    filter: function () {
      if (this.clientId !== 'all' && this.paymentTypeId !== 'all') {
        this.filtered = this.payments.filter(payment => { return parseInt(payment.clientId) === parseInt(this.clientId) && parseInt(payment.paymentTypeId) === parseInt(this.paymentTypeId) })
      } else if (this.clientId === 'all' && this.paymentTypeId !== 'all') {
        this.filtered = this.payments.filter(payment => { return parseInt(payment.paymentTypeId) === parseInt(this.paymentTypeId) })
      } else if (this.clientId !== 'all' && this.paymentTypeId === 'all') {
        this.filtered = this.payments.filter(payment => { return parseInt(payment.clientId) === parseInt(this.clientId) })
      } else {
        this.filtered = this.payments
      }
      this.filtered = this.filtered.sort(this.dynamicSortDec("timestamp"))
    }
  },
});
</script>