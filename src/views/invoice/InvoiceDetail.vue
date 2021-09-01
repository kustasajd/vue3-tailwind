<template>
  <div class="h-full">
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
      <div class="flex items-center justify-between">
        <div></div>
        <div class="flex items-center">
          <div class="text-center">
            <router-link
              :to="{
                name: 'InvoicePdf',
                params: { invoiceId: invoiceId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mx-2"
              >Template Pdf
            </router-link>
          </div>
          <div class="text-center">
            <button
              type="button"
              @click="onExportPdf()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mx-2"
            >
              Export PDF
            </button>
          </div>
          <div class="text-center">
            <router-link
              :to="{
                name: 'CreatePayment',
                query: { invoiceId: invoiceId }
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mx-2"
              >Add Payment
            </router-link>
          </div>
          <div class="text-center">
            <button
              v-if="isDelInvoice && invoice.payments.length === 0"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mx-2"
              type="button"
              @click="deleteInvoice(invoiceId)"
            >
              Delete Invoice
            </button>
            <div v-if="isDelInvoice && invoice.payments.length !== 0" class="tooltip cursor-pointer py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800 mx-2">Delete Invoice
              <span class="tooltiptext">Cannot delete invoice as there is a payment attached to it</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Client Information -->
      <div class="-mt-10">
        <h3 class="text-gray-700 text-3xl font-medium">Invoice #{{invoice.invoiceId}}</h3>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Client
              </div>
              <p class="text-gray-700 text-base mb-4">
                {{ invoice.client.legalName }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">Licence</div>
              <p class="text-gray-700 text-base mb-4">
                #{{ invoice.licence.licenceId }} - {{ invoice.licence.licenceType.name }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Period
              </div>
              <p class="text-gray-700 text-base mb-4">
                {{ getDate(invoice.periodStart) }} - {{ getDate(invoice.periodEnd) }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">Status</div>
              <p class="text-gray-700 text-base mb-4">
                {{
                  invoice.invoiceStatusType
                    ? invoice.invoiceStatusType.status
                    : ""
                }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">Total Inc Tax</div>
              <p class="text-gray-700 text-base mb-4">
                {{ invoice.currency.symbol
                }}{{
                  parseFloat(getTotal(invoice.chargeRegisters)).toFixed(2)
                }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">Total Tax</div>
              <p class="text-gray-700 text-base mb-4">
                {{ invoice.currency.symbol
                }}{{
                  parseFloat(getTotalTax(invoice.chargeRegisters)).toFixed(2)
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Charge Register  -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Charges</h3>
        <!-- Summary -->
        <div>
          <h3 class="text-gray-700 text-xl font-medium">Summary</h3>
          <div class="">
            <div
              class="rounded bg-white overflow-hidden shadow-lg px-6 py-4 flex"
            >
              <div>
                <div v-for="(product, i) in products" :key="i">
                  {{product.name}} - {{product.count}} items - {{invoice.currency.symbol}}{{parseFloat(product.totalRate).toFixed(2)}} + {{invoice.currency.symbol}}{{parseFloat(product.totalTax).toFixed(2)}} GST
                </div>
                <button
                  @click="onShowDetail()"
                  class="py-1 px-4 text-center bg-gray-600 rounded-md text-white text-sm hover:bg-gray-800 mt-4"
                >
                  Show Charge Details
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6" v-if="invoice.advanceCharge.length>0 && showDetail === true">
          <h3 class="text-gray-700 text-xl font-medium">In Advance Charges</h3>
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
                      Total Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Tax
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Added By
                    </th>
                    <th
                      v-if="isEditInvoice"
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in invoice.advanceCharge"
                    :key="index"
                  >                      
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                        <span v-if="item.siteProductPricing && item.siteProductPricing.optionName">{{item.siteProductPricing.optionName}}-</span>
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
                        <span>{{parseFloat(item.quantity)}} x {{invoice.currency.symbol}}{{parseFloat(item.rate).toFixed(2)}} = {{invoice.currency.symbol}}{{parseFloat(item.rateTotal).toFixed(2)}}</span>
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">                          
                        <span>{{invoice.currency.symbol}}{{parseFloat(item.rateTotal*item.taxRate.taxPercentage/100).toFixed(2)}}({{item.taxRate.tax}})</span>
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
                      v-if="isEditInvoice"
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'UpdateInvoice',
                          params: { invoiceId: invoiceId, chargeRegisterId: item.chargeRegisterId },
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
          <div class="flex">
            <h3 class="text-gray-700 text-xl font-medium mr-6">
              Total Inc Tax: {{ invoice.currency.symbol
              }}{{ getTotal(invoice.advanceCharge) }}
            </h3>
            <h3 class="text-gray-700 text-xl font-light">
              (Total: {{ invoice.currency.symbol
              }}{{
                (getTotal(invoice.advanceCharge) -
                getTotalTax(invoice.advanceCharge)).toFixed(2)
              }}
              ,Tax: {{ invoice.currency.symbol
              }}{{ getTotalTax(invoice.advanceCharge) }})
            </h3>
          </div>
        </div>
        <div class="mt-6" v-if="invoice.expensesCharge.length>0 && showDetail === true">
          <h3 class="text-gray-700 text-xl font-medium">Expenses for the current month</h3>
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
                      Total Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Tax
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Added By
                    </th>
                    <th
                      v-if="isEditInvoice"
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Added By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in invoice.expensesCharge"
                    :key="index"
                  >                      
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap flex flex-items">
                        <span v-if="item.siteProductPricing && item.siteProductPricing.optionName">{{item.siteProductPricing.optionName}}-</span>
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
                        <span>{{parseFloat(item.quantity)}} x {{invoice.currency.symbol}}{{parseFloat(item.rate).toFixed(2)}} = {{invoice.currency.symbol}}{{parseFloat(item.rateTotal).toFixed(2)}}</span>
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">                          
                        <span>{{invoice.currency.symbol}}{{parseFloat(item.rateTotal*item.taxRate.taxPercentage/100).toFixed(2)}}({{item.taxRate.tax}}) </span>
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
                      v-if="isEditInvoice"
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'UpdateInvoice',
                          params: { invoiceId: invoiceId, chargeRegisterId: item.chargeRegisterId },
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
          <div class="flex">
            <h3 class="text-gray-700 text-xl font-medium mr-6">
              Total Inc Tax: {{ invoice.currency.symbol
              }}{{ getTotal(invoice.expensesCharge) }}
            </h3>
            <h3 class="text-gray-700 text-xl font-light">
              (Total: {{ invoice.currency.symbol
              }}{{
                (getTotal(invoice.expensesCharge) -
                getTotalTax(invoice.expensesCharge)).toFixed(2)
              }}
              ,Tax: {{ invoice.currency.symbol
              }}{{ getTotalTax(invoice.expensesCharge) }}
              )
            </h3>
          </div>
        </div>          
      </div>
      <!-- Payments  -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Payments</h3>
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
                      Timestamp
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Payment Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in invoice.payments" :key="index">
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
                        {{invoice.currency.symbol}}{{ parseFloat(item.amount).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.paymentType.type }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <h3 class="text-gray-700 text-xl font-medium">Total: {{invoice.currency.symbol}}{{getTotalAmount(invoice.payments)}}</h3>
      </div>
      <!-- Invoice Status History  -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Invoice Status History</h3>
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
                      Timestamp
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                    >
                      Color
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Updated By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in invoice.invoiceStatusHistories" :key="index">
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
                        {{ item.invoiceStatusType.status }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <div class="w-4 h-4 rounded border mx-auto" :style="{'background': item.invoiceStatusType.color}">
                        &nbsp;
                      </div>
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
      <!-- Template -->
      <div id="element-to-print" class="hidden">
        <InvoicePdf 
          :invoiceId="invoiceId"
          :invoice="invoice"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../../router";
import html2pdf from "html2pdf.js";
import { getDate, dynamicSort, removeDuplicates } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import ModalConfirm from "../../components/modals/ModalConfirm.vue";
import InvoicePdf from "../../components/invoice/InvoicePdf.vue"

export default defineComponent({
  components: {
    Breadcrumb,
    ModalConfirm,
    InvoicePdf
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    invoiceId: null,
    siteId: null,
    invoice: {},
    products: [],
    showDetail: false,
    showConfirmModal: false,
    alertContent: "",
    isDelInvoice: false,
    isEditInvoice: false,
    onClickDel: false
  }),
  setup() {
    return { getDate, dynamicSort, removeDuplicates };
  },
  created() {
    this.invoiceId = this.$route.params.invoiceId;
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    let user = JSON.parse(localStorage.getItem('user'))
    if (user && user.user && user.user.permissions && user.user.permissions) {
      user.user.permissions.forEach(element => {
        if (element.permission.name === 'invoice delete') {
          this.isDelInvoice = true
        } else if (element.permission.name === 'invoice update') {
          this.isEditInvoice = true
        }
      });
    }
    this.$store.dispatch("invoices/getDetailById", { id: this.invoiceId });
  },
  watch: {
    "$store.state.invoices.invoice": function () {
      this.invoice = this.$store.state.invoices.invoice.invoice;
      if (this.invoice && this.onClickDel === false) {
        this.invoice.advanceCharge = []
        this.invoice.expensesCharge = []
        this.invoice.chargeRegisters.forEach(item => {
          this.products.push(item.product)
          if (item.paidInAdvance === true) this.invoice.advanceCharge.push(item)
          else this.invoice.expensesCharge.push(item)
        });
        this.invoice.advanceCharge = this.invoice.advanceCharge.sort(this.dynamicSort("productChargeTypeId"));
        this.invoice.expensesCharge = this.invoice.expensesCharge.sort(this.dynamicSort("productChargeTypeId"));
        this.products = this.removeDuplicates(this.products, 'productId')
        this.products.forEach(product => {
          product.totalRate = 0
          product.totalTax = 0
          product.count = 0
          this.invoice.chargeRegisters.forEach(chargeRegister => {
            if (chargeRegister.productId === product.productId) {
              product.count++
              product.totalRate += chargeRegister.rateTotal
              product.totalTax += chargeRegister.rateTotal * (chargeRegister.taxRate.taxPercentage/100)
            }
          });
        });
        this.checkLoading();
      } else if(this.invoice && this.onClickDel === true) {
        router.push(`/site/${this.siteId}/invoices`);
      }
    },
    "$store.state.invoices.pdf": function () {
      this.pdf = this.$store.state.invoices.pdf.pdf;
      if (this.pdf && this.pdf.exportId) {
        this.$store.dispatch("invoices/getDetailById", { id: this.invoiceId });
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.invoices.invoice.invoice
      ) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: this.invoice.site.brandName + " - invoices",
          name: "Invoices",
          params: {
            siteId: this.invoice.site.siteId,
          },
        },
      ];
    },
    getTotal: function (chargeRegisters) {
      let total = 0;
      chargeRegisters.forEach((item) => {
        total += item.rateTotal*(item.taxRate.taxPercentage/100 + 1);
      });
      return total.toFixed(2);
    },
    getTotalTax: function (chargeRegisters) {
      let total = 0;
      chargeRegisters.forEach((item) => {
        total += item.rateTotal*item.taxRate.taxPercentage/100;
      });
      return total.toFixed(2);
    },
    onExportPdf: function () {
      var element = document.getElementById("element-to-print");
      element.style.display = "block";
      var opt = {
        margin: 0.5,
        filename: `invoice-${this.invoiceId}.pdf`,
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
          element.style.display = "none";
          that.uploadPdf(pdf);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadPdf: function (pdf) {
      this.isLoading = true
      this.$store.dispatch("invoices/exportPdf", {
        invoiceId: this.invoiceId,
        content: btoa(pdf),
        invoiceName: `invoice-${this.invoice.site.siteId}-${this.invoice.client.clientId}-${this.invoiceId}-${new Date().getTime()}.pdf`
      });
    },
    getTotalAmount: function (payments) {
      let total = 0
      payments.forEach(item => {
        total += item.amount
      });
      return total.toFixed(2)
    },
    deleteInvoice: function (id) {
      this.alertContent = "Are you sure you want to delete this invoice?"
      this.showConfirmModal = true
      this.selectedId = id
    },
    onDelete() {
      this.showConfirmModal = false
      this.alertContent = ""
      this.onClickDel = true
      this.isLoading = true
      this.$store.dispatch("invoices/deleteInvoice", {
        id: this.selectedId,
      });
    },
    onShowDetail: function () {
      this.showDetail = !this.showDetail
    },
    onCloseConfirmModal() {
      this.showConfirmModal = false
      this.alertContent = ""
    },
  },
});
</script>

<style lang="scss">
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 240px;
  background-color: black;
  color: #fff;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
.tooltip .tooltiptext {
  width: 240px;
  top: 100%;
  left: 0%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
}
</style>
