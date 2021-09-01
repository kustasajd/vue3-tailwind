<template>
  <div class="h-full">
    <modal-form 
      :showConfirmModal="showConfirmModal" 
      :alertContent="alertContent" 
      @onNoConfirm="() => onNoConfirm()"
      @onCloseConfirmModal="() => onCloseConfirmModal()"
      @onConfirm="() => onConfirm()"
    >
    </modal-form>
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between">
        <div></div>
        <div class="flex items-center">
          <div class="text-center" v-if="isLicenceTerminate === true">
            <router-link
              :to="{
                name: 'LicenceTerminate',
                params: { licenceId: licenceId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mr-4"
              >Licence Terminate
            </router-link>
          </div>
          <div class="text-center">
            <router-link
              :to="{
                name: 'LicencePdf',
                params: { licenceId: licenceId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mr-4"
              >Template Pdf
            </router-link>
          </div>
          <div class="text-center">
            <button
              type="button"
              @click="onExportPdf()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mr-4"
            >
              Export PDF
            </button>
          </div>
          <div class="text-center">
            <router-link
              :to="{
                name: 'UpdateLicence',
                params: { licenceId: licenceId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mr-4"
              >Edit
            </router-link>
          </div>
          <div class="text-center">
            <button
              @click="onGenerate()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md text-white text-sm hover:bg-gray-800"
            >
              Create Initial Invoice
            </button>
          </div>
        </div>
      </div>
      <div id="element-to-print">
        <!-- Client Information -->
        <div class="-mt-4">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Licence #{{ licence.licenceId }}
          </h3>
          
          <div class="text-gray-900 font-bold text-lg mb-2">
            Licence Status
            <span class="text-gray-700 text-base mb-4 font-normal">
              {{ licence.licenceStatusType.name }}
            </span>
          </div>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Licence ID #{{ licence.licenceId }}</div>
                <p class="text-gray-700 text-base mb-4">
                  Licence Type: {{ licence.licenceType.name ? licence.licenceType.name : '-' }}
                </p>   
                <p class="text-gray-700 text-base mb-4">
                  {{ licence.client.legalName }}
                </p>
                <div class="text-gray-900 font-bold text-lg mb-2"></div>
                <p class="text-gray-700 text-base mb-4">
                  ABN: {{ licence.client.abn ? licence.client.abn : '-' }}
                </p>         
                <p class="text-gray-700 text-base mb-4">
                  {{ licence.client.phone ? licence.client.phone : '-' }}
                </p>
                <p class="text-gray-700 text-base mb-4">
                  {{ licence.client.mobile ? licence.client.mobile : '-' }}
                </p>
                <p class="text-gray-700 text-base mb-4">
                  {{ licence.client.email ? licence.client.email : '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Agreement Terms -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Terms</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Commencement Date
                  <span class="text-gray-700 text-base mb-4 font-normal">
                    {{ formatDate(licence.licenceStart) }}
                  </span>
                </div>
                <div class="text-gray-900 font-bold text-lg mb-2">Review Date
                  <span class="text-gray-700 text-base mb-4 font-normal">
                    {{ formatDate(licence.validUntil) }}
                  </span>
                </div>
                <div class="text-gray-900 font-bold text-lg mb-2">Term
                  <span class="text-gray-700 text-base mb-4 font-normal">
                    {{ getMonthDiff(licence.licenceStart, licence.validUntil) }}
                  </span>
                </div>
                <div class="text-gray-900 font-bold text-lg mb-2">Invoicing Day
                  <span class="text-gray-700 text-base mb-4 font-normal">
                    {{ licence.invoicingDay }} days
                  </span>
                </div>
                <div class="text-gray-900 font-bold text-lg mb-2">Payment Terms
                  <span class="text-gray-700 text-base mb-4 font-normal">
                    {{ licence.paymentTermsDaysFromInvoice }} days
                  </span>
                </div>
                <div class="text-gray-900 font-bold text-lg mb-2">Comments</div>
                <p class="text-gray-700 text-base mb-4 font-normal whitespace-pre">
                  {{ licence.notes }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Furniture -->
        <div class="mt-8" v-if="licence.furnitureNote">
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
        <div class="mt-8">
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
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Action
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
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <button
                          v-if="item.isDocuSign === false"
                          class="text-indigo-600 hover:text-indigo-900 mr-4"
                          type="button"
                          @click="onPreview(item.licenceDocumentId)"
                        >
                          View
                        </button>
                        <a v-if="item.isDocuSign === true" :href="`https://appdemo.docusign.com/documents/details/${item.docuSignDocumentRef}`">
                          View
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- Zones -->
        <div class="mt-8">
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
                        Type
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Building Level 
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
                          {{ item.siteZone.friendlyName }}
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
                          {{ parseFloat(item.siteZone.squareMeters) }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{site.currency.symbol}}{{ parseFloat(item.rate).toFixed(2) }}
                          {{ item.productChargeType.type }}
                          <span class="text-gray-600 italic">
                            (+{{item.taxRate.tax}} {{site.currency.symbol}}{{parseFloat(item.rate*item.taxRate.taxPercentage/100).toFixed(2).replace('.00','')}})
                          </span>
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="flex">
            <h3 class="text-gray-700 text-xl font-medium mr-3">
              Total Inc Tax: 
              {{site.currency.symbol}}{{(getTotalZone(licence.licenceZones)).toFixed(2)}}
            </h3>
            <h3 class="text-gray-700 text-xl font-light">
              (Sub Total: 
              {{site.currency.symbol}}{{(getTotalZone(licence.licenceZones)-getTotalTaxZone(licence.licenceZones)).toFixed(2)}},
              Tax: 
              {{site.currency.symbol}}{{(getTotalTaxZone(licence.licenceZones)).toFixed(2)}})
            </h3>
          </div>
        </div>
        <!-- Products -->
        <div class="mt-8">
          <div class="mt-6" v-for="(type, i) in productTypes" :key="i">
            <h3 class="text-gray-700 text-3xl font-medium">{{type.type}}</h3>
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
                        Total
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="flex">
              <h3 class="text-gray-700 text-xl font-medium mr-3">
                Total Inc Tax: 
                {{site.currency.symbol}}{{(getTotalProduct(licence[type.type])).toFixed(2)}}
              </h3>
              <h3 class="text-gray-700 text-xl font-light">
                (Sub Total: 
                {{site.currency.symbol}}{{(getTotalProduct(licence[type.type])-getTotalTaxProduct(licence[type.type])).toFixed(2)}},
                Tax: 
                {{site.currency.symbol}}{{(getTotalTaxProduct(licence[type.type])).toFixed(2)}})
              </h3>
            </div>
          </div>
        </div>

        <!-- Licence Status History -->
        <div class="mt-16">
          <h3 class="text-gray-600 text-2xl font-medium">Licence Status History</h3>
          <div class="-mt-4">
            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div
                class="inline-block min-w-full shadow rounded-lg overflow-hidden"
              >
                <table class="min-w-min leading-normal">
                  <thead>
                    <tr>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Date 
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in licenceStatusHistories"
                      :key="index"
                    >
                      <td
                        class="px-5 py-2 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ getDate(item.timestamp) }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-2 border-b border-gray-200 bg-white text-sm" :style="{'background': item.licenceStatusType.color}"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.licenceStatusType.name }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-2 border-b border-gray-200 bg-white text-sm"
                      >
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ item.user.fullName }}
                        </p>
                      </td>
                      <td
                        class="px-5 py-2 border-b border-gray-200 bg-white text-sm"
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
import router from "../../router";
import html2pdf from "html2pdf.js";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import { getDate, formatDate, removeDuplicates } from "../../helpers/index";
import ModalForm from "../../components/modals/ModalForm.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    ModalForm
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    licenceId: null,
    licence: {},
    licenceStatusHistories: {},
    site: {},
    siteId: null,
    productTypes: [],
    user: {},
    isLicenceTerminate: false,
    showConfirmModal: false,
  }),
  setup() {
    const toast = useToast();
    return {
      getDate, formatDate, removeDuplicates, toast
    };
  },
  created() {
    this.licenceId = this.$route.params.licenceId;
    this.$store.dispatch("licences/getById", {
      id: this.licenceId,
    });
    this.$store.dispatch("licences/getHistory", {
      id: this.licenceId,
    });
    let user = JSON.parse(localStorage.getItem('user'))
    if (user && user.user && user.user.permissions && user.user.permissions) {
      user.user.permissions.forEach(element => {
        if (element.permission.name === 'licence terminate') {
          this.isLicenceTerminate = true
        }
      });
    }    
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
  },
  watch: {
    "$store.state.licences.licence": function () {
      this.licence = this.$store.state.licences.licence.licence;
      if (this.licence) {
        this.licence.licenceZones = this.licence.licenceZones.filter(licenceZone => { return licenceZone.active === true })
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
    "$store.state.licences.licenceStatusHistories": function () {
      this.licenceStatusHistories = this.$store.state.licences.licenceStatusHistories.licenceStatusHistories;
      if (this.licenceStatusHistories) {
        this.checkLoading();
      }
    },
    "$store.state.invoices.invoice": function () {
      this.invoice = this.$store.state.invoices.invoice.invoice;
      if (this.invoice && this.invoice.invoiceId) {
        router.push(
          `/invoice/${this.invoice.invoiceId}`
        );
      }
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
      if (this.$store.state.licences.licence.licence && this.$store.state.licences.licenceStatusHistories.licenceStatusHistories) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    onExportPdf: function () {
      var element = document.getElementById("element-to-print");
      var opt = {
        margin: 0.5,
        filename: "licence.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      // New Promise-based usage:
      html2pdf().from(element).set(opt).save();
      const that = this;
      html2pdf()
        .from(element)
        .outputPdf()
        .then(function (pdf) {
          that.uploadPdf(pdf);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadPdf: function (pdf) {
      this.$store.dispatch("licences/exportPdf", {
        licenceId: this.licenceId,
        content: btoa(pdf),
      });
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Clients',
          name: 'Clients',
          params: { siteId: this.siteId }
        },
        {
          index: 2,
          title: this.licence.client.tradingName,
          name: "ClientDetail",
          params: {
            clientId: this.licence.clientId,
          },
        },
        {
          index: 3,
          title: 'Licence #' + this.licenceId,
          name: "LicenceDetail",
          params: {
            licenceId: this.licence.licenceId,
          },
        },
      ];
    },
    getTotalProduct: function (products) {
      let total = 0
      products.forEach(element => {
        total += element.overridePrice * (element.taxRate.taxPercentage/100 + 1)
      });
      return total
    },
    getTotalTaxProduct: function (products) {
      let total = 0
      products.forEach(element => {
        total += element.overridePrice * element.taxRate.taxPercentage/100
      });
      return total
    },
    getTotalZone: function (zones) {
      let total = 0
      zones.forEach(element => {
        total += element.rate * (element.taxRate.taxPercentage/100 + 1)
      });
      return total
    },
    getTotalTaxZone: function (zones) {
      let total = 0
      zones.forEach(element => {
        total += element.rate * element.taxRate.taxPercentage/100
      });
      return total
    },
    getMonthDiff: function(licenceStart, validUntil) {
      if (validUntil && licenceStart) {
        const start = moment(licenceStart).format("YYYY-MM-DD");
        const end = moment(validUntil).format("YYYY-MM-DD");
        return moment(end).diff(moment(start), 'months')+'months'
      } else {
        return '-'
      }
    },
    onGenerate: function () {
      this.alertContent = "Are you sure you want to generate an initial invoice for this licence?"
      this.showConfirmModal = true
    },
    onPreview: function (licenceDocumentId) {
      this.$store.dispatch("licences/licenceDocumentDetail", licenceDocumentId);
    },
    onConfirm () {
      this.isLoading = true
      const {clientId, siteId, licenceId, paymentTermsDaysFromInvoice, notes} = this.licence
      this.$store.dispatch("invoices/create", {
        currencyId: this.site.currency.currencyId,
        clientId: clientId,
        siteId: siteId,
        invoiceStatusTypeId: 1,
        licenceId: licenceId,
        termsDays: paymentTermsDaysFromInvoice,
        notes: notes,
        periodStart: null,
        periodEnd: null,
        totalChargesIncTax: 0,
        totaltax: 0
      });
    },
    onCloseConfirmModal() {
      this.showConfirmModal = false
      this.alertContent = ""
    },
    onNoConfirm() {
      this.showConfirmModal = false
      this.alertContent = ""
    },
  },  
});
</script>
