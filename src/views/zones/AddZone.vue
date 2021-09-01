<template>
  <div class="h-full">
    <alert-form
      :isModalVisible="isModalVisible"
      :alertContent="alertContent"
      @onClose="() => onClose()"
    ></alert-form>
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <no-permission :isLoading="isLoading" :hasPermission="hasPermission" />
    <div v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">{{site.brandName}} - Add Zone</h3>
          <div class="text-center">
            <button
              type="submit"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Add New Zone
            </button>
          </div>
        </div>
        <!-- Zone Detail -->
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Zone Type
                </div>
                <select-box
                  nameField="name"
                  valueField="zoneTypeId"
                  :options="zoneTypes"
                  :selectedValue="zone.zoneTypeId"
                  @onSelect="(value) => changeZoneTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="buildingLevel"
                  >Building Level</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="zone.buildingLevel"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="friendlyName"
                  >Friendly Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="zone.friendlyName"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="squareMeters"
                  >Square Meters</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="zone.squareMeters"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="squareMeters"
                  >Workstations</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="zone.workstations"
                />
              </div>
              <div class="mb-4">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  v-model="zone.exclusive"
                /><span class="ml-2 text-gray-700">Exclusive (Only one client licence at a time)</span>
              </div>
              <div class="mb-4">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  v-model="zone.availableForClients"
                /><span class="ml-2 text-gray-700">Available For client hire</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Pricing Options -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-semibold">Pricing Options</h3>
          <div class="flex items-end justify-between mb-4">
            <div>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Product Charge Type
              </div>
              <select-box
                nameField="type"
                valueField="productChargeTypeId"
                :options="productChargeTypes"
                :selectedValue="productChargeTypeId"
                @onSelect="(value) => changeProductChargeTypeId(value)"
              ></select-box>
            </div>
            <div>
              <div class="text-gray-900 font-bold text-lg mb-2">Rack Rate({{this.site.currency.symbol}})</div>
              <input
                class="form-input w-full rounded-md focus:border-indigo-600 max-w-xs mr-2"
                type="number"
                step="0.01"
                placeholder="Rack Rate"
                v-model="rackRate"
              />
            </div>            
            <div>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Tax Rate
              </div>
              <select-box
                nameField="tax"
                valueField="taxRateId"
                :options="taxRates"
                :selectedValue="taxRateId"
                @onSelect="(value) => changeTaxRateId(value)"
              ></select-box>
            </div>
            <button
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              type="button"
              @click="addItem()"
            >
              Add
            </button>
          </div>

          <div
            class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto"
            v-if="zone.siteZoneRates && zone.siteZoneRates.length > 0"
          >
            <div
              class="inline-block min-w-full shadow rounded-lg overflow-hidden"
            >
              <table class="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Rack Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Product Charge Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Tax Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in zone.siteZoneRates" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{site.currency.symbol}}{{ parseFloat(item.rackRate).toFixed(2) }}
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
                        {{ item.taxRate.tax }} - %{{ item.taxRate.taxPercentage }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <button
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        type="button"
                        @click="deleteItem(index)"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission } from "../../helpers/index"

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    NoPermission
  },
  setup() {
    return { getPermission }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    siteId: null,
    site: {},
    zone: {},
    zoneTypes: [],
    productChargeTypes: [],
    taxRates: [],
    selSiteId: null,
    hasPermission: false
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/getById", { id: this.siteId });
      this.$store.dispatch("zones/getZoneTypes");
      this.$store.dispatch("sites/getAllProductChargeType");
      this.$store.dispatch("sites/getAllTaxRate");
    }
  },
  watch: {
    "$store.state.sites.site": function () {
      this.site = this.$store.state.sites.site.site;
      this.checkLoading();
    },
    "$store.state.zones.zoneTypes": function () {
      this.zoneTypes = this.$store.state.zones.zoneTypes.zoneTypes;
      this.checkLoading();
    },
    "$store.state.sites.productChargeTypes": function () {
      this.productChargeTypes = this.$store.state.sites.productChargeTypes.productChargeTypes;
      this.checkLoading();
    },
    "$store.state.sites.taxRates": function () {
      this.taxRates = this.$store.state.sites.taxRates.taxRates;
      this.checkLoading();
    },
    "$store.state.zones.zone.zone": function () {
      this.zone = this.$store.state.zones.zone.zone;
      if (this.zone && this.zone.siteZoneId) {
        this.isLoading = false
        router.push(`/site/${this.siteId}/zone/${this.zone.siteZoneId}`);
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const {
        zoneTypeId,
        buildingLevel,
        friendlyName,
        squareMeters,
        siteZoneRates,
        workstations,
        exclusive,
        availableForClients
      } = this.zone;
      if (!zoneTypeId || !workstations) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.$store.dispatch("zones/create", {
          siteId: this.siteId,
          zoneTypeId: zoneTypeId,
          buildingLevel: buildingLevel,
          friendlyName: friendlyName,
          squareMeters: squareMeters,
          siteZoneRates: siteZoneRates ? siteZoneRates: [],
          workstations: workstations,
          exclusive: exclusive,
          availableForClients: availableForClients
        });
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.zones.zoneTypes.zoneTypes &&
        this.$store.state.sites.site.site &&
        this.$store.state.sites.productChargeTypes.productChargeTypes && 
        this.$store.state.sites.taxRates.taxRates
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
    changeZoneTypeId(value) {
      this.zone.zoneTypeId = value;
    },
    addItem() {
      if (this.rackRate && this.productChargeTypeId && this.taxRateId) {
        const selected = this.productChargeTypes.filter((item) => {
          return (
            parseInt(item.productChargeTypeId) ===
            parseInt(this.productChargeTypeId)
          );
        });
        const selectedTax = this.taxRates.filter((item) => {
          return (
            parseInt(item.taxRateId) ===
            parseInt(this.taxRateId)
          );
        });
        if (!this.zone.siteZoneRates) this.zone.siteZoneRates = [];
        this.zone.siteZoneRates.push({
          productChargeType: selected[0],
          rackRate: this.rackRate,
          taxRate: selectedTax[0]
        });
        
      } else {
        this.openAlert("Insert required fields");
      }
    },
    deleteItem(index) {
      this.zone.siteZoneRates.splice(index, 1)
    },
    changeProductChargeTypeId(value) {
      this.productChargeTypeId = value;
    },
    onClose() {
      this.isModalVisible = false;
      this.alertContent = "";
    },
    changeTaxRateId(value) {
      this.taxRateId = value;
    },
    openAlert(value) {
      this.alertContent = value;
      this.isModalVisible = true;
      return;
    },
  },
});
</script>
