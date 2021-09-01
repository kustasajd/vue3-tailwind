<template>
  <div class="h-full">
    <alert-form
      :isModalVisible="isModalVisible"
      :alertContent="alertContent"
      @onClose="() => onClose()"
    ></alert-form>
    <modal-confirm 
      :showConfirmModal="showConfirmModal" 
      :alertContent="alertContent" 
      @onCloseConfirmModal="() => onCloseConfirmModal()"
      @onDelete="() => onDelete()"
    >
    </modal-confirm>
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div id="element-to-print">
        <!-- Licence Detail -->
        <form @submit.prevent="handleSubmit">
          <div class="flex items-center justify-between">
            <h3 class="text-gray-700 text-3xl font-semibold">Update Licence</h3>
            <div class="text-center">
              <button
                type="submit"
                class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >
                Update
              </button>
            </div>
          </div>

          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
              v-if="licence"
            >
              <div>
                <div class="mb-4">
                  <div class="text-gray-900 font-bold text-lg mb-2">
                    Status Type
                  </div>
                  <select-box
                    nameField="name"
                    valueField="licenceStatusTypeId"
                    :options="licenceStatusTypes"
                    :selectedValue="licence.licenceStatusTypeId"
                    @onSelect="(value) => changeLicenceStatusTypeId(value)"
                  ></select-box>
                </div>
                <div class="mb-4">
                  <div class="text-gray-900 font-bold text-lg mb-2">
                    Licence Type
                  </div>
                  <select-box
                    nameField="name"
                    valueField="licenceTypeId"
                    :options="licenceTypes"
                    :selectedValue="licence.licenceTypeId"
                    @onSelect="(value) => changeLicenceTypeId(value)"
                  ></select-box>
                </div>
                <div class="mb-4">
                  <label
                    class="text-gray-900 font-bold text-lg mb-2"
                    for="invoicingDay"
                    >Invoicing Day</label
                  >
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="number"
                    v-model="licence.invoicingDay"
                  />
                </div>
                <div class="mb-4">
                  <label class="text-gray-900 font-bold text-lg mb-2" for="licenceStart"
                    >Licence Start</label
                  >
                  <div class="mt-1 w-full">
                    <a-date-picker class="w-full" size="large" @change="onChangeLicenceStart" :defaultValue="formatDate(licence.licenceStart)"/>
                  </div>
                </div>
                <div class="mb-4">
                  <label class="text-gray-900 font-bold text-lg mb-2" for="validUntil"
                    >Valid Until</label
                  >
                  <div class="mt-1 w-full">
                    <a-date-picker class="w-full" size="large" @change="onChangeValidUntil" :defaultValue="formatDate(licence.validUntil)"/>
                  </div>
                </div>
                <div class="mb-4">
                  <label
                    class="text-gray-900 font-bold text-lg mb-2"
                    for="paymentTermsDaysFromInvoice"
                    >Invoicing Day</label
                  >
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="number"
                    v-model="licence.paymentTermsDaysFromInvoice"
                  />
                </div>
                <div class="mb-4">
                  <label
                    class="text-gray-900 font-bold text-lg mb-2"
                    for="notes"
                    >Note</label
                  >
                  <textarea
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="text"
                    v-model="licence.notes"
                  ></textarea>
                </div>
                <div class="mb-4">
                  <label
                    class="text-gray-900 font-bold text-lg mb-2"
                    for="furnitureNote"
                    >Furniture</label
                  >
                  <textarea
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="text"
                    v-model="licence.furnitureNote"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </form>
        <!-- Zones -->
        <div class="mt-8">
          <div class="flex items-center justify-between">
            <h3 class="text-gray-700 text-3xl font-semibold">
              Zones
            </h3>
            <div class="text-center">
              <router-link
                :to="{
                  name: 'CreateLicenceZone',
                  params: { licenceId: this.licenceId },
                }"
                class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
                >Add new zone
              </router-link>
            </div>
          </div>
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
                        Type
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Building Level 
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Square Meters
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Rate
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Start date
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Note
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Active
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Action
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
                          {{ item.siteZone.zoneType.name }}
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
                          {{ item.siteZone.friendlyName }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ parseFloat(item.siteZone.squareMeters).toFixed(2) }}
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
                          {{ item.notes }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.active }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <button
                          class="text-indigo-600 hover:text-indigo-900 mr-4"
                          type="button"
                          v-if="isDeleteLicenceZone"
                          @click="deleteZone(item.licenceZoneId, index)"
                        >
                          Delete
                        </button>
                        <router-link
                          :to="{
                            name: 'UpdateLicenceZone',
                            params: { licenceId: licenceId, licenceZoneId: item.licenceZoneId },
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
        <!-- Documents -->
        <div class="mt-8">
          <div class="flex items-center justify-between">
            <h3 class="text-gray-700 text-3xl font-semibold">
              Documents
            </h3>
            <div class="text-center">
              <router-link
                :to="{
                  name: 'CreateLicenceDocument',
                  params: { licenceId: this.licenceId },
                }"
                class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
                >Add new document
              </router-link>
            </div>
          </div>
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
                        Description
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        DocuSign
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
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.isDocuSign }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- Products -->
        <div class="mt-8">
          <div class="flex items-center justify-between">
            <h3 class="text-gray-700 text-3xl font-semibold">
              Products
            </h3>
            <div class="text-center">
              <router-link
                :to="{
                  name: 'CreateLicenceProduct',
                  params: { licenceId: this.licenceId },
                }"
                class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
                >Add new product
              </router-link>
            </div>
          </div>
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
                        Product	
                      </th>	
                      <th	
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"	
                      >	
                        Product Type
                      </th>	
                      <th	
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"	
                      >	
                        Charge Type	
                      </th>	
                      <th	
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"	
                      >	
                        Paid in Advance	
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Tax
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Note
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in licence.licenceProducts"
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
                          {{ item.licenceProductType.type }}	
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
                          {{ item.paidInAdvance }}	
                        </p>	
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ site.currency.symbol
                          }}{{ parseFloat(item.overridePrice).toFixed(2) }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ site.currency.symbol}}{{(item.overridePrice * item.taxRate.taxPercentage / 100).toFixed(2)}}
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
                        <button
                          class="text-indigo-600 hover:text-indigo-900 mr-4"
                          type="button"
                          v-if="isDeleteLicenceProduct"
                          @click="deleteProduct(item.licenceProductId, index)"
                        >
                          Delete
                        </button>
                        <router-link
                          :to="{
                            name: 'UpdateLicenceProduct',
                            params: { licenceId: licenceId, licenceProductId: item.licenceProductId },
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from 'moment'
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import ModalConfirm from "../../components/modals/ModalConfirm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import { getDate, dynamicSort } from "../../helpers/index";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    ModalConfirm
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    licence: {},
    client: {},
    clientId: null,
    siteId: null,
    licenceTypes: [],
    licenceTypeId: null,
    licenceStatusTypes: [],
    licenceStatusTypeId: null,
    licenceId: null,
    isModalVisible: false,
    showConfirmModal: false,
    alertContent: "",
    formSubmit: false,
    isDeleteLicenceProduct: false,
    isDeleteLicenceZone: false
  }),
  setup() {
    return {
      getDate, dynamicSort
    };
  },
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    let user = JSON.parse(localStorage.getItem('user'))
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    if (user && user.user && user.user.permissions && user.user.permissions) {
      user.user.permissions.forEach(element => {
        if (element.permission.name === 'licence product delete') {
          this.isDeleteLicenceProduct = true
        } else if (element.permission.name === 'licence zone delete') {
          this.isDeleteLicenceZone = true
        }
      });
    }
    this.licenceId = this.$route.params.licenceId;
    this.clientId = this.$route.params.clientId;
    this.$store.dispatch("licences/getById", {
      id: this.licenceId,
    });
    this.$store.dispatch("licences/getLicenceType");
    this.$store.dispatch("licences/getLicenceStatusType");
  },
  watch: {
    "$store.state.licences.licence": function () {
      this.licence = this.$store.state.licences.licence.licence;
      if (this.licence && this.formSubmit === false) {
        this.licence.licenceZones = this.licence.licenceZones.filter(licenceZone => { return licenceZone.active === true })
        this.checkLoading();
      } else if (
        this.licence &&
        this.licence.licenceId &&
        this.formSubmit === true
      ) {
        this.isLoading = false
        router.push(`/licence/${this.licence.licenceId}`);
      }
    },
    "$store.state.licences.licenceTypes": function () {
      this.licenceTypes = this.$store.state.licences.licenceTypes.licenceTypes;
      this.checkLoading();
    },
    "$store.state.licences.licenceStatusTypes": function () {
      this.licenceStatusTypes = this.$store.state.licences.licenceStatusTypes.licenceStatusTypes;
      this.checkLoading();
    },
    "$store.state.licences.licence.licence": function () {
      this.licence = this.$store.state.licences.licence.licence;
      if (this.licence) {
        if (this.licence.licenceProducts && this.licence.licenceProducts.length>0) {
          this.licence.licenceProducts = this.licence.licenceProducts.sort(this.dynamicSort("licenceProductTypeId"));
        }
        this.checkLoading();
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const {
        notes,
        furnitureNote,
        invoicingDay,
        paymentTermsDaysFromInvoice,
        clientId,
        licenceTypeId,
        licenceStatusTypeId,
        licenceStart,
        validUntil
      } = this.licence;
      if (
        !this.siteId ||
        !licenceTypeId ||
        !licenceStatusTypeId ||
        !invoicingDay || 
        !paymentTermsDaysFromInvoice
      ) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.formSubmit = true;
        this.$store.dispatch("licences/update", {
          licenceId: this.licenceId,
          clientId: clientId,
          notes: notes,
          furnitureNote: furnitureNote,
          invoicingDay: invoicingDay,
          paymentTermsDaysFromInvoice: paymentTermsDaysFromInvoice,
          siteId: this.siteId,
          licenceTypeId: licenceTypeId,
          licenceStatusTypeId: licenceStatusTypeId,
          licenceStart: licenceStart,
          validUntil: validUntil
        });
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.licences.licenceStatusTypes.licenceStatusTypes &&
        this.$store.state.licences.licence.licence &&
        this.$store.state.licences.licenceTypes.licenceTypes
      ) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Clients",
          name: "Clients",
          params: { siteId: this.siteId },
        },
        {
          index: 2,
          title: this.licence.client ? this.licence.client.tradingName : '',
          name: "ClientDetail",
          params: {
            clientId: this.licence.clientId,
          },
        },
        {
          index: 3,
          title: "Licence#" + this.licence.licenceId,
          name: "LicenceDetail",
          params: {
            licenceId: this.licence.licenceId,
          },
        },
      ];
    },
    changeLicenceTypeId(value) {
      this.licence.licenceTypeId = value;
    },
    changeLicenceStatusTypeId(value) {
      this.licence.licenceStatusTypeId = value;
    },
    changeClientId(value) {
      this.licence.clientId = value;
    },
    onChangeLicenceStart(date, dateString) {
      this.licence.licenceStart = dateString
    },
    onChangeValidUntil(date, dateString) {
      this.licence.validUntil = dateString
    },
    formatDate: function(date) {
      if (date) {
        return moment(date).format('YYYY-MM-DD')
      } else {
        return '-'
      }
    },
    deleteProduct: function (id, index) {
      this.alertContent = "Are you sure you want to remove this product from the licence?"
      this.showConfirmModal = true
      this.selectedId = id
      this.selectedIndex = index
    },
    deleteZone: function (id, index) {
      this.alertContent = "Are you sure you want to remove this Zone?"
      this.showConfirmModal = true
      this.selectedId = id
      this.selectedIndex = index
    },
    onDelete() {
      this.showConfirmModal = false
      if (this.alertContent === 'Are you sure you want to remove this Zone?') {
          this.$store.dispatch("zones/deleteLicenceZone", {
            id: this.selectedId,
          });
          this.licence.licenceZones.splice(this.selectedIndex, 1)
      } else {
        this.$store.dispatch("licences/deleteLicenceProduct", {
          id: this.selectedId,
        });
        this.licence.licenceProducts.splice(this.selectedIndex, 1)
      }
      this.alertContent = ""
    },
    onCloseConfirmModal() {
      this.showConfirmModal = false
      this.alertContent = ""
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
