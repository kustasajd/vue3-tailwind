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
        <h3 class="text-gray-700 text-3xl font-semibold">
          {{ zone.friendlyName }} Detail
        </h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'UpdateZone',
              params: { siteZoneId: zone.siteZoneId },
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Edit
          </router-link>
        </div>
      </div>
      <div class="mt-4 mb-3">
        <div
          class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
        >
          <div>
            <div class="text-gray-900 font-bold text-lg mb-2">Site</div>
            <p class="text-gray-700 text-base mb-4">
              {{ zone.site.brandName }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Building Level
            </div>
            <p class="text-gray-700 text-base">
              {{ zone.buildingLevel }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Size</div>
            <p class="text-gray-700 text-base">
              {{ zone.squareMeters }}sqm
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Name
            </div>
            <p class="text-gray-700 text-base">
              {{ zone.friendlyName }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Zone Type
            </div>
            <p class="text-gray-700 text-base">
              {{ zone.zoneType.name }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Workstations
            </div>
            <p class="text-gray-700 text-base">
              {{ zone.workstations }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Exclusive
            </div>
            <p class="text-gray-700 text-base">
              {{ zone.exclusive!==null ? zone.exclusive : '-' }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Available For client hire
            </div>
            <p class="text-gray-700 text-base">
              {{ zone.availableForClients!==null ? zone.availableForClients : '-' }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-semibold">
          Rack Rates
        </h3>
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
                      Charge type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Tax Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Total inc tax
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in zone.siteZoneRates"
                    :key="index"
                  >
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
                        {{zone.site.currency.symbol}}{{ (item.rackRate).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{item.taxRate.tax}}
                        {{zone.site.currency.symbol}}{{ (item.rackRate * item.taxRate.taxPercentage/100).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{zone.site.currency.symbol}}{{ (item.rackRate * (item.taxRate.taxPercentage/100 + 1)).toFixed(2) }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-semibold">
          Licences
        </h3>
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
                      Id &amp; Client
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Start Date
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in zone.licenceZones"
                    :key="index"
                  >
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'LicenceDetail',
                          params: {
                            licenceId: item.licence.licenceId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >#{{ item.licence.licenceId }} - {{ item.licence.client.tradingName }}
                      </router-link>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{zone.site.currency.symbol}}{{ parseFloat(item.rate).toFixed(2) }}
                        </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getDate(item.licence.licenceStart) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.active }}
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
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission, getDate } from "../../helpers/index";
export default defineComponent({
  components: {
    Breadcrumb,
    NoPermission
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    zone: {},
    siteZoneId: null,
    siteId: null,
    selSiteId: null,
    hasPermission: false
  }),
  setup() {
    return { getPermission, getDate }
  },
  created() {
    this.siteZoneId = this.$route.params.siteZoneId;
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId);
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("zones/getById", { siteZoneId: this.siteZoneId });
    }
  },
  watch: {
    "$store.state.zones.zone": function () {
      this.zone = this.$store.state.zones.zone.zone;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.zones.zone.zone) {
        this.linkItems = this.getLinkItems()
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'zones',
          name: 'Zones',
          params: {
            siteId: this.zone.site.siteId,
          }
        },
      ]
    },
  },
});
</script>