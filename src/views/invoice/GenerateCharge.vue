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
      <!-- Invoice Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Generate One Off Invoice
          </h3>
          <div class="text-center">
            <button
              type="submit"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Generate
            </button>
          </div>
        </div>

        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
            v-if="invoice"
          >
            <div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Client
                </div>
                <select-box
                  nameField="tradingName"
                  valueField="clientId"
                  :options="clients"
                  :selectedValue="invoice.clientId"
                  @onSelect="(value) => changeClientId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="licences.length>0">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Licence
                </div>
                <select-box
                  nameField="licenceName"
                  valueField="licenceId"
                  :options="licences"
                  :selectedValue="invoice.licenceId"
                  @onSelect="(value) => changeLicenceId(value)"
                ></select-box>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="">
        <div class="-mt-6">
          <div class="-mx-4 px-4 py-4 overflow-x-auto">
            <div class="text-left my-2">
              <span class="text-gray-600 text-base font-bold">
                Total Inc Tax:
              </span>
              <span class="text-gray-600 text-base font-bold">
                {{site.currency.symbol}}{{parseFloat(this.totalRateIncTax).toFixed(2)}}
              </span>
              <span class="text-gray-600 text-base">
                (Sub Total:
              </span>
              <span class="text-gray-600 text-base">
                {{site.currency.symbol}}{{parseFloat(this.totalRate).toFixed(2)}}
              </span>
              <span class="text-gray-600 text-base">
                Tax:
              </span>
              <span class="text-gray-600 text-base">
                {{site.currency.symbol}}{{parseFloat(this.totalTax).toFixed(2)}})
              </span>
            </div>
            <div
              class="inline-block min-w-full shadow rounded-lg overflow-hidden mt-8"
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
                      Rate Total
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Charge Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody v-if="chargeRegisters.length>0">
                  <tr v-for="(item, index) in chargeRegisters" :key="index">                    
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
                        <span>{{site.currency.symbol}}{{parseFloat(item.rateTotal).toFixed(2)}}</span>
                        <span> ({{parseFloat(item.quantity)}} x {{site.currency.symbol}}{{parseFloat(item.rate).toFixed(2)}})</span>
                      </p>
                    </td>                    
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{item.productChargeType.type}}
                      </p>
                    </td>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dynamicSort, getDate } from "../../helpers/index";
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
  },
  setup() {
    return { dynamicSort, getDate }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    invoice: {},
    siteId: null,
    clients: [],
    chargeRegisters: [],
    licences: [],
    totalRate: 0,
    totalTax: 0,
    totalRateIncTax: 0,
    isModalVisible: false,
    alertContent: "",
  }),
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.siteId = this.$route.params.siteId
    this.invoice = {
      siteId: this.siteId,
      currencyId: this.site.currency.currencyId,
    }
    this.$store.dispatch("invoices/getOutstandingClients", { id: this.siteId });
    this.$store.dispatch("invoices/getAllInvoiceStatusTypes");
  },
  watch: {
    "$store.state.invoices.outstandingClients": function () {
      this.clients = this.$store.state.invoices.outstandingClients.outstandingClients;
      if (this.clients) {
        this.clients = this.clients.sort(this.dynamicSort('tradingName'));
        this.checkLoading();
      }
    },
    "$store.state.invoices.invoice.invoice": function () {
      this.invoice = this.$store.state.invoices.invoice.invoice;
      if (this.invoice && this.invoice.invoiceId) {
        router.push(`/invoice/${this.invoice.invoiceId}`);
      }
    },
  },
  methods: {
    handleSubmit(e) {      
      const { siteId, currencyId, clientId, totaltax, totalChargesIncTax, licenceId, termsDays, notes, periodEnd, periodStart } = this.invoice;
      if (!siteId || !currencyId || !clientId) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.$store.dispatch("invoices/create", {
          siteId: siteId,
          currencyId: currencyId,
          clientId: clientId,
          totaltax: totaltax || 0,
          totalChargesIncTax: totalChargesIncTax || 0,
          licenceId: licenceId,
          termsDays: termsDays || 0,
          notes: notes,
          invoiceStatusTypeId: 1,
          periodStart: periodStart,
          periodEnd: periodEnd
        });
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.invoices.outstandingClients.outstandingClients 
      ) {
        this.linkItems = this.getLinkItems()
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
      ]
    },
    changeClientId: function (value) {
      this.isLoading = true
      this.invoice.clientId = parseInt(value)
      const client = (this.clients.filter(client => { return client.clientId === this.invoice.clientId }))[0]
      this.chargeRegisters = client.chargeRegisters.filter((item) => { return item.invoiceId === null })
      this.licences = client.licences
      this.licences.forEach(licence => {
        licence.licenceName = `Licence#${licence.licenceId}`
      });
      if (this.licences.length === 1) {
        this.invoice.licenceId = this.licences[0].licenceId
      }
      this.totalRate = 0
      this.totalRateIncTax = 0
      this.totalTax = 0
      this.chargeRegisters.forEach(chargeRegister => {
        this.totalRate += chargeRegister.rateTotal
        this.totalTax += chargeRegister.rateTotal * (chargeRegister.taxRate.taxPercentage/100)
        this.totalRateIncTax += chargeRegister.rateTotal * (1+ chargeRegister.taxRate.taxPercentage/100)
      });
      this.invoice.totaltax = this.totaltax
      this.invoice.totalChargesIncTax = this.totalRateIncTax
      setTimeout(() => {
        this.isLoading = false
      }, 10);
    },
    changeLicenceId: function (value) {
      const licence = this.licences.filter(licence => { return licence.licenceId === parseInt(value) })[0]
      this.invoice.termsDays = licence.paymentTermsDaysFromInvoice
      this.invoice.notes = licence.notes      
      this.invoice.periodStart = licence.licenceStart      
      this.invoice.periodEnd = licence.validUntil      
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
