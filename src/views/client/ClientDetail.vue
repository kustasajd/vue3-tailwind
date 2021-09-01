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
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">
          {{ client.tradingName }}
        </h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'UpdateClient',
              params: { clientId: clientId },
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Edit Client
          </router-link>
        </div>
      </div>
      <!-- Client Detail -->
      <div class="mt-4 mb-3">
        <div
          class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
        >
          <div
            class="block h-24 w-24 rounded-full overflow-hidden shadow focus:outline-none mr-10"
          >
            <img
              class="h-full w-full object-cover"
              :src="
                client.profilePic
                  ? client.profilePic
                  : 'https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80'
              "
              alt="Your avatar"
            />
          </div>
          <div>
            <div class="text-gray-900 font-bold text-lg mb-2">Trading Name</div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.tradingName }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Legal Name</div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.legalName }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Primary Contact
            </div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.primaryContact }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Email</div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.email }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Phone</div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.phone }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Mobile</div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.mobile ? client.mobile : '-' }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">ABN</div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.abn ? client.abn : '-' }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Website</div>
            <p class="text-gray-700 text-base mb-4">
              {{ client.website }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Opening Balance</div>
            <p class="text-gray-700 text-base mb-4">
              {{user.selectedSite.currency.symbol}}{{ parseFloat(client.openingBalance).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
      <!-- Client Groups -->
      <div class="mt-8" v-if="clientGroups && clientGroups.length > 0">
        <h3 class="text-gray-700 text-3xl font-medium">Groups</h3>
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
                      Group Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Added By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in clientGroups" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.clientGroupType.name }}
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
      <!-- Client Users -->
      <div class="mt-8" v-if="clientUsers && clientUsers.length > 0">
        <h3 class="text-gray-700 text-3xl font-medium">Staff Members</h3>
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
                      Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      User Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      date Added
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      added by
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, index) in clientUsers" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ u.user.fullName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ u.clientUserType.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getDate(u.dateAdded) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ u.addedByUser.fullName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ u.notes }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Client Licences -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">Licences</h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'AddLicence',
                params: { clientId: clientId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Add new licence
            </router-link>
          </div>
        </div>
        <div class="mt-6" v-if="client.licences.length > 0">
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
                      licenceType
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Site
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Licence Start
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Active
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Documents
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
                      Payment Terms
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(licence, index) in client.licences" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.licenceType.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.site.brandName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getDate(licence.licenceStart) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.active }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.licenceDocuments.length }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.licenceProducts.length }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.invoicingDay }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.paymentTermsDaysFromInvoice }} days
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'LicenceDetail',
                          params: { licenceId: licence.licenceId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
                      </router-link>
                      <router-link
                        :to="{
                          name: 'UpdateLicence',
                          params: { licenceId: licence.licenceId },
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
      <!-- Client Invoices -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">Invoices</h3>
        </div>
        <div class="mt-6" v-if="client.licences.length > 0">
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
                      Total
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Payments total
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(invoice, index) in invoicesbyClient" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ invoice.invoiceId }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{invoice.currency.symbol}}{{ getTotalChargeRegister(invoice.chargeRegisters) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{invoice.currency.symbol}}{{ getTotalPayments(invoice.payments) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ invoice.invoiceStatusType.status }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'InvoiceDetail',
                          params: { invoiceId: invoice.invoiceId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Site Client -->
      <div class="mt-8" v-if="siteClients && siteClients.length > 0">
        <h3 class="text-gray-700 text-3xl font-medium">Sites</h3>
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
                      Brand Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Address Street
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Currency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in siteClients" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.site.brandName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.site.addressStreet }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.site.currency.abbreviation }}
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
import { useMeta } from 'vue-meta'
import { getDate } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    Breadcrumb,
  },
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getDate, metaData }
  },
  data: () => ({
    isLoading: true,
    user: {},
    linkItems: [],
    clientId: null,
    client: {},
    clientGroups: [],
    siteClients: [],
    clientUsers: [],
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user")).user;
    this.clientId = this.$route.params.clientId;
    this.$store.dispatch("clients/getById", {
      id: this.clientId,
    });
    this.$store.dispatch("clients/getGroupById", {
      id: this.clientId,
    });
    this.$store.dispatch("clients/getSiteClients", {
      id: this.clientId,
    });
    this.$store.dispatch("clients/getUserById", {
      id: this.clientId,
    });
    this.$store.dispatch("invoices/getInvoicesbyClient", {
      clientId: this.clientId,
      siteId: this.user.selectedSite.siteId,
    });
  },
  watch: {
    "$store.state.clients.client": function () {
      this.client = this.$store.state.clients.client.client;
      this.checkLoading();
    },
    "$store.state.clients.clientGroups": function () {
      this.clientGroups = this.$store.state.clients.clientGroups.clientGroups;
      this.checkLoading();
    },
    "$store.state.clients.siteClients": function () {
      this.siteClients = this.$store.state.clients.siteClients.siteClients;
      this.checkLoading();
    },
    "$store.state.clients.clientUsers": function () {
      this.clientUsers = this.$store.state.clients.clientUsers.clientUsers;
      this.checkLoading();
    },
    "$store.state.invoices.invoicesbyClient": function () {
      this.invoicesbyClient = this.$store.state.invoices.invoicesbyClient.invoicesbyClient;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.clients.client.client &&
        this.$store.state.clients.siteClients.siteClients &&
        this.$store.state.clients.clientUsers.clientUsers &&
        this.$store.state.clients.clientGroups.clientGroups &&
        this.$store.state.invoices.invoicesbyClient.invoicesbyClient
      ) {
        this.linkItems = this.getLinkItems();
        this.metaData.meta.title = `${this.client.tradingName} | ${this.user.selectedSite.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Clients",
          name: "Clients",
          params: { siteId: this.user.selectedSite.siteId },
        },
        {
          index: 2,
          title: this.client.tradingName,
          name: "ClientDetail",
          params: {
            clientId: this.client.clientId,
          },
        },
      ];
    },
    getTotalPayments: function (payments) {
      let total:any = 0
      payments.forEach(payment => {
        total += payment.amount
      });
      return parseFloat(total).toFixed(2)
    },
    getTotalChargeRegister: function (chargeRegister) {
      let total:any = 0
      chargeRegister.forEach(item => {
        total += item.rateTotal
      });
      return parseFloat(total).toFixed(2)
    }
  },
});
</script>
