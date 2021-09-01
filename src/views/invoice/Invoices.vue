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
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-gray-700 text-3xl font-medium">
          {{ site.brandName }} - Invoices
        </h3>
        <div class="flex items-center">
          <div class="text-center mr-4" v-if="viewDownload && invoicesOutsanding.length>0">
            <button
              type="button"
              @click="onDownload()"
              class="py-2 px- text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Download PDFs
            </button>
          </div>
          <div class="text-center mr-4">
            <router-link
              :to="{
                name: 'GenerateInvoice',
                params: { siteId: siteId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md text-white text-sm hover:bg-gray-800"
              >Generate Outstanding Invoices
            </router-link>
          </div>
          <div class="text-center">
            <router-link
              :to="{
                name: 'GenerateCharge',
                params: { siteId: siteId },
              }"
              class="py-2 px-4 text-center bg-gray-700 rounded-md text-white text-sm hover:bg-gray-800"
              >Generate Single Invoice
            </router-link>
          </div>
        </div>
      </div>
      <div>
        <div class="mt-4 mb-8">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="text-lg"><span class="italic">Total Number:</span> {{ totalItemsNum }}</div>
              <div class="text-lg"><span class="italic">Total value of invoices:</span> {{site.currency.symbol}}{{ parseFloat(totalValue).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between border-2 border-gray-600 rounded-md p-3 bg-gray-300 ">
        <span class="text-gray-700 text-xl font-semibold">Filters</span> 
        <div class="text-left w-40">
          <span class="text-gray-700 text-base font-semibold">Paid/OutStanding</span> 
          <select-box
            class="mr-4"
            nameField="name"
            valueField="value"
            :options="options"
            :selectedValue="selected"
            @onSelect="(value) => change(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">Invoice DueDate</span> 
          <select-box
            nameField="name"
            valueField="value"
            :options="overdueOptions"
            :selectedValue="selectedOverdue"
            @onSelect="(value) => changeOverdue(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">With Zone</span> 
          <select-box
            nameField="name"
            valueField="value"
            :options="zoneOptions"
            :selectedValue="selectedZone"
            @onSelect="(value) => changeZoneFilter(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">With Licence</span> 
          <select-box
            nameField="name"
            valueField="value"
            :options="licenceOptions"
            :selectedValue="selectedLicence"
            @onSelect="(value) => changeLicenceFilter(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">Licence Type</span> 
          <select-box
            nameField="name"
            valueField="licenceTypeId"
            :options="licenceTypes"
            :selectedValue="selectedLicenceType"
            @onSelect="(value) => changeLicenceTypeFilter(value)"
          ></select-box>
        </div>
        <div class="text-left">
          <span class="text-gray-700 text-base font-semibold">Sort</span> 
          <select-box
            nameField="name"
            valueField="value"
            :options="sortList"
            :selectedValue="sortProperty"
            @onSelect="(value) => changeSortProperty(value)"
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
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID &amp; Client
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payments
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount Due
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>   
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date Created
                    </th>                 
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody v-if="filtered">
                  <tr v-for="(item, index) in filtered" :key="index">
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <router-link
                        :to="{
                          name: 'InvoiceDetail',
                          params: { invoiceId: item.invoiceId },
                        }"
                        class="whitespace-no-wrap font-semibold text-blue-700 hover:text-gray-700 text-base"
                        >#{{ item.invoiceId }}<br />{{ item.client.tradingName }}
                      </router-link>     
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-lg font-bold">
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.currency.symbol
                        }}{{ parseFloat(getTotalCharge(item.chargeRegisters)).toFixed(2) }}
                      </p>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.currency.symbol
                        }}{{ getTotalPayment(item.payments) }}
                      </p>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.currency.symbol
                        }}{{
                          (getTotalCharge(item.chargeRegisters) -
                          getTotalPayment(item.payments)).toFixed(2)
                        }}
                      </p>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getDate(item.dueDate) }}
                      </p>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getDate(item.dateCreated) }}
                      </p>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p
                        class="text-gray-900 whitespace-no-wrap"
                        v-if="item.invoiceStatusType"
                      >
                        {{ item.invoiceStatusType.status }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <button
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        type="button"
                        @click="onDownloadPdf(item)"
                      >
                        Download Pdf
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(invoice, i) in invoicesOutsanding" :key="i">
        <div class="hidden" :id="invoice.invoiceId">
          <InvoicePdf 
            :invoiceId="invoice.invoiceId"
            :invoice="invoice"
          />
        </div>
      </div>
      <div id="element-to-print" class="hidden" v-if="selectedInvoice.invoiceId">
        <InvoicePdf 
          :invoiceId="selectedInvoice.invoiceId"
          :invoice="selectedInvoice"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import html2pdf from "html2pdf.js";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import moment from 'moment'
import { getDate, getPermission, dynamicSort, getDaysDiffFromNow, dynamicSortDec } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import SelectBox from "../../components/common/SelectBox.vue";
import ModalConfirm from "../../components/modals/ModalConfirm.vue";
import InvoicePdf from "../../components/invoice/InvoicePdf.vue"

export default defineComponent({
  components: {
    Breadcrumb,
    SelectBox,
    NoPermission,
    ModalConfirm,
    InvoicePdf
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    siteId: null,
    site: {},
    invoices: [],
    hasPermission: false,
    invoicesPaid: [],
    invoicesOutsanding: [],
    filtered: [],
    query: {},
    options: [
      { name: "All", value: "all" },
      { name: "Paid", value: "paid" },
      { name: "Outsanding", value: "outsanding" },
    ],
    selected: "all",
    overdueOptions: [
      { name: "All", value: "all" },
      { name: "Overdue", value: "overdue" },
      { name: "Due next 7 days", value: "7days" },
      { name: "Due next 14 days", value: "14days" },
      { name: "Due 15+ days", value: "15+days" },
    ],
    selectedOverdue: "all",
    zoneOptions: [
      { name: "All", value: "all" },
      { name: "With Zones", value: "withZones" },
      { name: "Without Zones", value: "withoutZones" },
    ],
    selectedZone: "all",
    licenceOptions: [
      { name: "All", value: "all" },
      { name: "With Licence", value: "withLicence" },
      { name: "Without Licence", value: "withoutLicence" },
    ],
    selectedLicence: "all",
    licenceTypes: [],
    selectedLicenceType: "all",
    sortList: [
      { name: 'Created Date', value: 'dateCreated' },
      { name: 'Client', value: 'clientName' },
      { name: 'Due Date ASC', value: 'dueDateAsc' },
      { name: 'Due Date DESC', value: 'dueDateDesc' }
    ],
    sortProperty: 'dateCreated',
    viewDownload: false,
    data: [],
    newZip: null,
    selectedInvoice: {},
    totalItemsNum: 0,
    totalValue: 0,
    pdfs: []
  }),
  setup() {
    return { getDate, getPermission, dynamicSort, dynamicSortDec, getDaysDiffFromNow };
  },
  created() {
    this.newZip = new JSZip();
    this.siteId = this.$route.params.siteId;
    this.query = {
      siteId: this.siteId,
      selectedOverdue: this.selectedOverdue,
      selectedZone: this.selectedZone,
      selectedLicence: this.selectedLicence,
      selectedLicenceType: this.selectedLicenceType
    }
    this.hasPermission = this.getPermission(this.siteId);
    if (!this.hasPermission) {
      this.isLoading = false;
    } else {
      this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
      this.$store.dispatch("licences/getLicenceType");   
      this.filter()   
    }
  },
  watch: {
    "$store.state.invoices.invoices": function () {
      this.invoices = this.$store.state.invoices.invoices.invoices;
      if (this.invoices) {        
        this.filtered = this.invoices;
        this.getSummary(this.filtered);
        this.invoicesPaid = []
        this.invoicesOutsanding = []
        this.invoices.forEach((invoice) => {
          invoice.tradingName = invoice.client.tradingName
          invoice.daysDiff = this.getDaysDiffFromNow(invoice.dueDate)
          let diff =
            this.getTotalCharge(invoice.chargeRegisters) -
            this.getTotalPayment(invoice.payments);
          if (diff === 0) {
            this.invoicesPaid.push(invoice);
          } else {
            this.invoicesOutsanding.push(invoice);
          }
          invoice.advanceCharge = []
          invoice.expensesCharge = []
          invoice.chargeRegisters.forEach(item => {
            if (item.paidInAdvance === true) invoice.advanceCharge.push(item)
            else invoice.expensesCharge.push(item)
          });
          invoice.advanceCharge = invoice.advanceCharge.sort(this.dynamicSort("productChargeTypeId"));
          invoice.expensesCharge = invoice.expensesCharge.sort(this.dynamicSort("productChargeTypeId"));
        });
        this.checkLoading();
      }
    },
    "$store.state.invoices.pdfs": function () {
      this.pdfs = this.$store.state.invoices.pdfs.pdfs;
      if (this.pdfs) {
        const linkSource = `data:application/zip;base64,${this.pdfs}`;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        const now = moment(new Date()).format('YYYY-MM-DD')
        downloadLink.download = `${now}-outstanding-invoices.zip`;
        downloadLink.click(); 
        this.isLoading = false
      }
    },
    "$store.state.invoices.pdf": function () {
      this.pdf = this.$store.state.invoices.pdf.pdf;
      if (this.pdf) {
        const linkSource = `data:application/pdf;base64,${this.pdf}`;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = `Invoice-${this.selectedInvoice.invoiceId}-${this.selectedInvoice.site.brandName}.pdf`;
        downloadLink.click(); 
        this.isLoading = false
      }
    },
    "$store.state.licences.licenceTypes": function () {
      this.licenceTypes = this.$store.state.licences.licenceTypes.licenceTypes;
      if (this.licenceTypes) {
        this.licenceTypes = [{
          licenceTypeId: "all",
          name: "All"
        }].concat(this.licenceTypes)
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.invoices.invoices.invoices && this.$store.state.licences.licenceTypes.licenceTypes) {
        this.linkItems = this.getLinkItems();
        this.change(this.selected)
        this.changeSortProperty(this.sortProperty)
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: this.site.brandName + " - invoices",
          name: "Invoices",
          params: {
            siteId: this.siteId,
          },
        },
      ];
    },
    getTotalCharge: function (chargeRegisters) {
      let total = 0;
      if (!chargeRegisters) {
        return 0;
      } else {
        chargeRegisters.forEach((item) => {
          total += item.rateTotal*(item.taxRate.taxPercentage/100 + 1);
        });
        return total;
      }
    },    
    getTotalTax: function (chargeRegisters) {
      let total = 0;
      if (!chargeRegisters) {
        return 0;
      } else {
        chargeRegisters.forEach((item) => {
          total += (item.rateTotal * item.taxRate.taxPercentage) / 100;
        });
        return total.toFixed(2);
      }
    },
    getTotalPayment: function (payments) {
      let total = 0;
      payments.forEach((item) => {
        total += item.amount;
      });
      return total.toFixed(2);
    },   
    getSummary: function (invoices) {
      this.totalItemsNum = invoices.length
      this.totalValue = 0
      invoices.forEach(invoice => {
        this.totalValue += this.getTotalCharge(invoice.chargeRegisters)
      });
    },
    change: function (value) {
      this.viewDownload = false;
      this.selected = value;
      if (value === "all") {
        this.filtered = this.invoices;
      } else if (value === "paid") {
        this.filtered = this.invoicesPaid;
      } else if (value === "outsanding") {
        this.filtered = this.invoicesOutsanding;
        this.viewDownload = true;
      }
      this.getSummary(this.filtered)
      this.changeSortProperty(this.sortProperty)
    },
    filter: function () {
      this.isLoading = true
      this.$store.dispatch("invoices/filter", this.query);
    },
    changeOverdue: function (value) {
      this.selectedOverdue = value
      this.query.selectedOverdue = value
      this.filter()
    },
    changeZoneFilter: function (value) {
      this.selectedZone = value
      this.query.selectedZone = value
      this.filter()
    },
    changeLicenceFilter: function (value) {
      this.selectedLicence = value
      this.query.selectedLicence = value
      this.filter()
    },
    changeLicenceTypeFilter: function (value) {
      this.selectedLicenceType = value
      this.query.selectedLicenceType = value
      this.filter()
    },
    changeSortProperty: function (value) {
      this.sortProperty = value
      switch(value) {
        case 'dateCreated':
          this.filtered = this.filtered.sort(this.dynamicSort("dateCreated"));
          break;
        case 'clientName':
          this.filtered = this.filtered.sort(this.dynamicSort("tradingName"));
          break;
        case 'dueDateDesc':
          this.filtered = this.filtered.sort(this.dynamicSort("daysDiff"));
          break;
        case 'dueDateAsc':
          this.filtered = this.filtered.sort(this.dynamicSortDec("daysDiff"));
          break;
      }
    },
    onDownload: function () {
      this.invoicesOutsanding.forEach((invoice) => 
        this.onExportPdf(invoice.invoiceId, invoice.site.brandName)
      )
    },   
    onExportPdf: function (id, siteName) {
      var element = document.getElementById(id);
      element.style.display = "block";
      this.data.push({
        invoiceId: id,
        content: element.outerHTML,
        title: `Invoice-${id}-${siteName}.pdf`
      });
      element.style.display = "none";
      if (this.invoicesOutsanding.length === this.data.length) {
        this.uploadPdfs(this.data)
      }
    },   
    uploadPdfs: function (pdfs) {
      this.isLoading = true
      this.$store.dispatch("invoices/exportPdfs", {pdfs});
    }, 

    onDownloadPdf: function (invoice) {
      this.selectedInvoice = invoice
      setTimeout(()=>{
        var element = document.getElementById("element-to-print");
        element.style.display = "block";
        let pdf = {
          invoiceId: invoice.invoiceId,
          content: element.outerHTML,
          title: `Invoice-${invoice.invoiceId}-${invoice.site.brandName}.pdf`
        }
        element.style.display = "none";
        this.isLoading = true
        this.$store.dispatch("invoices/downloadPdf", pdf)
      }, 100)
    },
  },
});
</script>