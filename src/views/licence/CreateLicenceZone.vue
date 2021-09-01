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
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Licence#{{ licenceId }} - Add Zone
          </h3>
          <div class="text-center" v-if="showFields === true">
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
                <div class="text-gray-900 font-bold text-lg mb-2">Zone</div>
                <select-box
                  nameField="zoneTypeName"
                  valueField="siteZoneId"
                  :options="zones"
                  :selectedValue="licenceZone.siteZoneId"
                  @onSelect="(value) => changeSiteZoneId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="showFields === true">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Charge Type
                </div>
                <select-box
                  nameField="type"
                  valueField="productChargeTypeId"
                  :options="productChargeTypes"
                  :selectedValue="licenceZone.productChargeTypeId"
                  @onSelect="(value) => changeProductChargeTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Tax Rate</div>
                <select-box
                  nameField="tax"
                  valueField="taxRateId"
                  :options="taxRates"
                  :selectedValue="licenceZone.taxRateId"
                  @onSelect="(value) => changeTaxRateId(value)"
                ></select-box>
              </div>          
              <div class="mb-4">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  v-model="licenceZone.isSelected"
                  @change="
                    handleCheckboxChange(licenceZone.isSelected)
                  "
                /><span class="ml-2 text-gray-700">Add a security deposit for this zone?</span>
              </div>   
              <div class="mb-4" v-if="licenceZone.isSelected">
                <select-box
                  nameField="name"
                  valueField="value"
                  :options="multiple"
                  :selectedValue="licenceZone.mulit"
                  @onSelect="(value) => changeMultiple(value)"
                ></select-box>
              </div>           
              <div class="mb-4" v-if="showFields === true">
                <label class="text-gray-900 font-bold text-lg mb-2" for="rate"
                  >Rate ({{ site.currency.symbol }})</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="licenceZone.rate"
                />
              </div>   
              <div class="mb-4" v-if="showFields === true">
                <label class="text-gray-900 font-bold text-lg mb-2" for="startDate"
                  >Start Date</label
                >
                <div class="mt-1 w-full">
                  <a-date-picker class="w-full" size="large" @change="onChangeStartDate" :defaultValue="datePickerformatDate(licenceZone.startDate)"/>
                </div>
              </div>           
              <div class="mb-4" v-if="showFields === true">
                <label class="text-gray-900 font-bold text-lg mb-2" for="notes"
                  >Note</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="licenceZone.notes"
                />
              </div>
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
import { removeDuplicates, dynamicSort, datePickerformatDate } from "../../helpers/index";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    siteId: null,
    site: {},
    productChargeTypes: [],
    taxRates: [],
    zones: [],
    licenceZone: {
      isSelected: false,
      mulit: 1,
      startDate: new Date()
    },
    formSubmit: false,
    showFields: true,
    multiple: [
      { name: '1 month', value: 1 },
      { name: '2 month', value: 2 },
      { name: '3 month', value: 3 }
    ]
  }),
  setup () {
    return { removeDuplicates, dynamicSort, datePickerformatDate }
  },
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.siteId = this.site.siteId;
    this.licenceId = this.$route.params.licenceId;
    this.$store.dispatch("licences/getZones", { id: this.siteId });
    this.$store.dispatch("sites/getAllTaxRate");
  },
  watch: {
    "$store.state.zones.zone": function () {
      this.zone = this.$store.state.zones.zone.zone;
      if (this.zone) {
        this.licenceZone.productChargeTypeId = null
        this.licenceZone.rate = null
        this.showFields = true
        if (this.zone.siteZoneRates.length === 0) {
          this.showFields = false
          this.openAlert("No available charge rates available for this Zone");
        } else {
          this.productChargeTypes = []
          this.zone.siteZoneRates.forEach((item) => {
            this.productChargeTypes.push({
              productChargeTypeId: item.productChargeType.productChargeTypeId,
              type: item.productChargeType.type,
              rackRate: item.rackRate,
              taxRateId: item.taxRateId
            });
          });
          this.productChargeTypes = this.removeDuplicates(this.productChargeTypes, 'productChargeTypeId')
          this.licenceZone.productChargeTypeId = this.productChargeTypes[0].productChargeTypeId
          this.changeProductChargeTypeId(this.licenceZone.productChargeTypeId)
        }
        this.isLoading = false
      }
    },
    "$store.state.licences.zones": function () {
      this.zones = this.$store.state.licences.zones.zones;
      if (this.zones) {
        this.zones.forEach((zone) => {
          zone.zoneTypeName =
            zone.friendlyName + ' - ' + zone.zoneType.name;
        });
        this.zones = this.zones.sort(this.dynamicSort("zoneTypeName"));
        this.checkLoading();
      }
    },
    "$store.state.zones.licenceZone": function () {
      this.licenceZone = this.$store.state.zones.licenceZone.licenceZone;
      if (
        this.licenceZone &&
        this.licenceZone.licenceZoneId &&
        this.formSubmit === true
      ) {
        this.isLoading = false
        router.push(`/licence/${this.licenceZone.licenceId}/edit`);
      }
    },
    "$store.state.sites.taxRates": function () {
      this.taxRates = this.$store.state.sites.taxRates.taxRates;
      this.checkLoading();
    },
  },
  methods: {
    handleSubmit(e) {
      const { siteZoneId, productChargeTypeId, rate, notes, taxRateId, isSelected, mulit, startDate } = this.licenceZone;
      const selectedTax = (this.taxRates.filter(taxRate => { return parseInt(taxRate.taxRateId) === parseInt(taxRateId) }))[0]
      if (!siteZoneId || !productChargeTypeId || !rate || !taxRateId) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.formSubmit = true;
        this.$store.dispatch("zones/createLicenceZone", {
          licenceId: this.licenceId,
          siteZoneId: siteZoneId,
          productChargeTypeId: productChargeTypeId,
          rate: rate,
          taxRateId: taxRateId,
          startDate: startDate,
          notes: notes,
          isSelected: isSelected,
          securityDepositPrice: rate*mulit*(1+selectedTax.taxPercentage/100),
          securityDepositNote: mulit+' Month Deposit'
        });
      }
    },
    checkLoading: function () {
      if (this.$store.state.licences.zones.zones && this.$store.state.sites.taxRates.taxRates) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Licence#" + this.licenceId,
          name: "LicenceDetail",
          params: {
            licenceId: this.licenceId,
          },
        },
      ];
    },
    changeSiteZoneId(value) {
      this.licenceZone.siteZoneId = value;
      this.isLoading = true;
      this.$store.dispatch("zones/getById", { siteZoneId: value });
    },
    changeProductChargeTypeId(value) {
      this.licenceZone.productChargeTypeId = value;
      let selected = (this.productChargeTypes.filter(item=>{return item.productChargeTypeId === parseInt(value)}))[0]
      this.licenceZone.rate = selected.rackRate
      this.licenceZone.taxRateId = selected.taxRateId
    },
    changeTaxRateId: function(value) {
      this.licenceZone.taxRateId = value
    },
    onChangeStartDate(date, dateString) {
      this.licenceZone.startDate = dateString
    },
    changeMultiple: function(value) {
      this.licenceZone.mulit = parseInt(value)
      this.licenceZone.rate = this.licenceZone.rate
    },
    handleCheckboxChange(isChecked) {
      console.log(isChecked)
    },
    onClose() {
      this.isModalVisible = false;
      this.alertContent = "";
    },
    openAlert(value) {
      this.alertContent = value;
      this.isModalVisible = true;
      return;
    },
  },
});
</script>
