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
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Clients</h3>
        <h4 class="text-gray-600 text-xl">Showing {{this.filtered.length}} clients</h4>
      </div>
      <div class="flex items-end justify-between">
        <div class="text-left mt-2">Quick Search:
           <input
              class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
              type="text"
              v-model="searchText"
              @input="onSearch($event)"
            />    
        </div>
        <div class="text-center">
          <router-link
            :to="{
              name: 'CreateClient',
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Add New Client
          </router-link>
        </div>
      </div>
      <div class="mt-2" v-if="clients.length>0">
        <div class="mt-4">
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
                      Primary Contact
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Licences
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Zones
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(client, index) in this.filtered" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'ClientDetail',
                          params: { clientId: client.clientId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 text-lg"
                        >{{ client.tradingName }}
                      </router-link>
                      <p class="text-gray-600 whitespace-no-wrap">
                        {{ client.legalName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ client.primaryContact }}
                      </p>
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ client.email }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <span class="text-gray-900 whitespace-no-wrap">
                        <div v-for="(licence, i) in client.licences" :key="i">
                          <router-link
                            :to="{
                              name: 'LicenceDetail',
                              params: {
                                licenceId: licence.licenceId,
                              },
                            }"
                            class="text-indigo-600 hover:text-indigo-900"
                            >Licence #{{licence.licenceId}}
                          </router-link>
                        </div>
                      </span>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <span class="text-gray-900 whitespace-no-wrap">
                        <div v-for="(siteZone, i) in client.siteZones" :key="i">
                          <router-link
                            :to="{
                              name: 'ZoneDetail',
                              params: {
                                siteZoneId: siteZone.siteZoneId,
                              },
                            }"
                            class="text-indigo-600 hover:text-indigo-900"
                            >{{ siteZone.zoneType.name }} - {{ siteZone.friendlyName }}
                          </router-link>
                        </div>
                      </span>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getBalance(client.invoices) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'UpdateClient',
                          params: { clientId: client.clientId },
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
import { getPermission, removeDuplicates, dynamicSort } from "../../helpers/index";
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
    filtered: [],
    siteClients: [],
    selSiteId: null,
    hasPermission: false
  }),
  setup() {
    return { getPermission, removeDuplicates, dynamicSort }
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
      this.$store.dispatch("sites/getClientById", { id: this.siteId });
    }
  },
  watch: {
    "$store.state.sites.siteClients": function () {
      this.siteClients = this.$store.state.sites.siteClients.siteClients;
      if (this.siteClients) {
        this.siteClients.forEach(element => {
          this.clients.push(element.client)
        });
        this.clients = this.clients.sort(this.dynamicSort("tradingName"));
        this.filtered = this.clients
        this.clients.forEach(client => {
          client.licences = client.licences.filter(licence => { return licence.active === true })
          client.siteZones = []
          client.licences.forEach(licence => {
            if (licence.licenceZones.length > 0) {
              licence.licenceZones.forEach(item => {
                client.siteZones.push(item.siteZone)
              });
            }
          });
          client.siteZones = this.removeDuplicates(client.siteZones, 'siteZoneId')
        });
        if (this.clients.length>0) {
          this.isLoading = false
        }
      }
    },
  },
  methods: {
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Clients',
          name: 'Clients',
          params: { siteId: this.siteId }
        },
      ]
    },
    getBalance: function (invoices) {
      invoices = invoices.filter((invoice) => {
        return parseInt(invoice.siteId) === parseInt(this.siteId);
      });
      let balance = 0;
      if (invoices.length === 0) {
        return "-";
      } else {
        invoices.forEach((invoice) => {
          invoice.chargeRegisters.forEach((chargeRegister) => {
            balance += chargeRegister.rateTotal;
          });
          invoice.payments.forEach((payment) => {
            balance -= payment.amount;
          });
        });
        return this.site.currency.symbol + balance.toFixed(2);
      }
    },
    onSearch: function (e) {
      let searchText = (e.target.value).toUpperCase()
      this.filtered = this.clients.filter(client => { return (client.tradingName).toUpperCase().includes(searchText) || (client.legalName).toUpperCase().includes(searchText) })
    }
  },
});
</script>