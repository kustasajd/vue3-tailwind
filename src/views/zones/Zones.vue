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
          {{ site.brandName }} - Zones
        </h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'AddZone',
              params: { siteId: $route.params.siteId },
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Add New Zone
          </router-link>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-center">
          <select-box
            nameField="name"
            valueField="zoneTypeId"
            :options="zoneTypes"
            :selectedValue="zoneTypeId"
            @onSelect="(value) => change(value)"
          ></select-box>
        </div>
      </div>        
      <div class="mt-8">
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
                    Name &amp; Type
                  </th>             
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Level
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Workstations
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Rack Rates
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Exclusive
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Available For client hire
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Active Licences
                  </th>                  
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(zone, index) in filtered" :key="index">
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ zone.friendlyName }}<br />
                      <span class="text-gray-600 whitespace-no-wrap italic">
                        {{ zone.zoneType.name }}
                      </span>
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ zone.buildingLevel }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ zone.squareMeters }}sqm
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ zone.workstations }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <span class="text-gray-900 whitespace-no-wrap">
                      <div v-for="(siteZoneRate, i) in zone.siteZoneRates" :key="i">
                        {{zone.site.currency.symbol}}{{ parseFloat(siteZoneRate.rackRate).toFixed(2).replace('.00','') }}
                        {{siteZoneRate.productChargeType.type}}
                        <span v-if="siteZoneRate.taxRateId==1" class="text-orange-500 italic">
                          (No tax)
                        </span>
                        <span v-if="siteZoneRate.taxRateId!=1" class="text-gray-600 italic">
                          (+{{siteZoneRate.taxRate.tax}} {{zone.site.currency.symbol}}{{parseFloat(siteZoneRate.rackRate*siteZoneRate.taxRate.taxPercentage/100).toFixed(2).replace('.00','')}})
                        </span>
                      </div>
                    </span>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ zone.exclusive!==null ? zone.exclusive : '-' }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ zone.availableForClients!==null ? zone.availableForClients : '-' }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <span class="text-gray-900 whitespace-no-wrap">
                      <div v-for="(licenceZone, i) in zone.licenceZones" :key="i">
                        {{licenceZone.licence.client.tradingName}} - 
                        {{zone.site.currency.symbol}}{{ parseFloat(licenceZone.rate).toFixed(2) }}
                          (Licence <router-link
                            :to="{
                              name: 'LicenceDetail',
                              params: {
                                licenceId: licenceZone.licence.licenceId,
                              },
                            }"
                            class="text-indigo-600 hover:text-indigo-900"
                            >#{{licenceZone.licence.licenceId}}
                          </router-link>)
                      </div>
                    </span>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <router-link
                      :to="{
                        name: 'ZoneDetail',
                        params: { siteZoneId: zone.siteZoneId },
                      }"
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                      >Detail
                    </router-link>
                    <router-link
                      :to="{
                        name: 'UpdateZone',
                        params: { siteZoneId: zone.siteZoneId },
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission, dynamicSort } from "../../helpers/index";
import SelectBox from "../../components/common/SelectBox.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    NoPermission,
    SelectBox
  },
  setup() {
    return { getPermission, dynamicSort }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    siteId: null,
    site: {},
    zones: [],
    zoneTypes: [],
    zoneTypeId: 'all',
    filtered: [],
    selSiteId: null,
    hasPermission: false
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
      this.$store.dispatch("zones/getZonesBySite", { id: this.siteId });
      this.$store.dispatch("zones/getZoneTypes");
    }
  },
  watch: {
    "$store.state.zones.zones": function () {
      this.zones = this.$store.state.zones.zones.zones;
      if (this.zones) {
        this.zones.forEach(zone => {
          zone.licenceZones = zone.licenceZones.filter(licenceZone => {
            return licenceZone.licence.active === true
          });
        });

        this.filtered = this.zones
        this.filtered = this.filtered.sort(this.dynamicSort("friendlyName"));
        this.checkLoading();
      }
    },
    "$store.state.zones.zoneTypes": function () {
      this.zoneTypes = this.$store.state.zones.zoneTypes.zoneTypes;
      if (this.zoneTypes) {
        this.zoneTypes = [{
          zoneTypeId: 'all',
          name: 'All'
        }].concat(this.zoneTypes)
      }
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.zones.zones.zones && this.$store.state.zones.zoneTypes.zoneTypes
      ) {
        this.linkItems = this.getLinkItems()
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: this.site.brandName + ' - zones',
          name: 'Zones',
          params: {
            siteId: this.siteId,
          }
        },
      ]
    },
    change: function (value) {
      if (value === 'all') {
        this.filtered = this.zones
        this.filtered = this.filtered.sort(this.dynamicSort("friendlyName"));
      } else {
        this.filtered = this.zones.filter(item=> {return parseInt(item.zoneType.zoneTypeId) === parseInt(value)})
        this.filtered = this.filtered.sort(this.dynamicSort("friendlyName"));
      }
    }
  },
});
</script>