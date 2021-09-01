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
    <!-- Payment Detail -->
    <form @submit.prevent="handleSubmit" v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Add Payment</h3>
        <div class="text-center">
          <button
            type="submit"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
          >
            Create
          </button>
        </div>
      </div>

      <div class="mt-4 mb-3">
        <div
          class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          v-if="payment"
        >
          <div>
            <div class="mb-4" v-if="fromInvoice === false">
              <div class="text-gray-900 font-bold text-lg mb-2">Client</div>
              <select-box
                nameField="tradingName"
                valueField="clientId"
                :options="clients"
                :selectedValue="payment.clientId"
                @onSelect="(value) => changeClientId(value)"
              ></select-box>
            </div>
            <div class="mb-4" v-if="fromInvoice === true">
              <div class="text-gray-900 font-bold text-lg mb-2">Client</div>
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="invoice.client.tradingName"
                disabled
              />
            </div>
            <div class="mb-4" v-if="fromInvoice === false && payment.clientId">
              <div class="text-gray-900 font-bold text-lg mb-2">Invoice</div>
              <select-box
                nameField="invoiceName"
                valueField="invoiceId"
                :options="invoices"
                :selectedValue="payment.invoiceId"
                @onSelect="(value) => changeInvoiceId(value)"
              ></select-box>
            </div>
            <div class="mb-4" v-if="fromInvoice === true">
              <div class="text-gray-900 font-bold text-lg mb-2">Invoice</div>
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="invoice.invoiceName"
                disabled
              />
            </div>
            <div class="mb-4" v-if="payment.clientId">
              <div class="text-gray-900 font-bold text-lg mb-2">
                Payment Type
              </div>
              <select-box
                nameField="type"
                valueField="paymentTypeId"
                :options="paymentTypes"
                :selectedValue="payment.paymentTypeId"
                @onSelect="(value) => changePaymentTypeId(value)"
              ></select-box>
            </div>
            <div class="mb-4" v-if="payment.clientId">
              <label class="text-gray-900 font-bold text-lg mb-2" for="amount"
                >Amount</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="number"
                step="0.01"
                v-model="payment.amount"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dynamicSort } from "../../helpers/index";
import moment from "moment";
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    AlertForm,
    Breadcrumb,
    SelectBox,
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    payment: {},
    site: {},
    invoiceId: null,
    clients: [],
    invoices: [{
      invoiceId: null,
      invoiceName: 'No Specific Invoice'
    }],
    fromInvoice: false
  }),
  setup() {
    return {
      dynamicSort
    };
  },
  created() {
    this.invoiceId = this.$route.query.invoiceId;
    if (this.invoiceId) {
      this.fromInvoice = true
      this.payment.invoiceId = this.invoiceId
      this.$store.dispatch("invoices/getDetailById", { id: this.invoiceId });
    };
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.payment.siteId = this.site.siteId,
    this.payment.currencyId = this.site.currency.currencyId
    this.$store.dispatch("clients/getAll", { id: this.siteId });
    this.$store.dispatch("payments/getPaymentTypes");
  },
  watch: {
    "$store.state.clients.all": function () {
      this.clients = this.$store.state.clients.all.items;
      if (this.clients) {
        this.clients = this.clients.sort(this.dynamicSort("tradingName"));
        this.checkLoading();
      }
    },
    "$store.state.payments.paymentTypes": function () {
      this.paymentTypes = this.$store.state.payments.paymentTypes.paymentTypes;
      this.checkLoading();
    },
    "$store.state.invoices.invoicesbyClient": function () {
      this.invoicesbyClient = this.$store.state.invoices.invoicesbyClient.invoicesbyClient;
      if (this.invoicesbyClient) {        
        this.payment.invoiceId = null;
        this.invoicesbyClient.forEach((item) => {
          if (item.dueDate) {
            item.dueDate = '-Due' +  moment(item.dueDate).format("DD/MM/YY")
          } else {
            item.dueDate = ''
          }
          this.invoices.push({
            invoiceId: item.invoiceId,
            invoiceName:
              "Invoice#" + item.invoiceId + '-' + this.site.currency.symbol + item.totalChargesIncTax + item.dueDate
          });
        });
          
        this.isLoading = false;
      }      
    },
    "$store.state.invoices.invoice": function () {
      this.invoice = this.$store.state.invoices.invoice.invoice;
      if (this.invoice) {
        this.checkLoading();
        if (this.invoice.dueDate) {
          this.invoice.dueDate = '-Due' +  moment(this.invoice.dueDate).format("DD/MM/YY")
        } else {
          this.invoice.dueDate = ''
        }
        this.invoice.invoiceName = "Invoice#" + this.invoice.invoiceId + '-' + this.site.currency.symbol + this.invoice.totalChargesIncTax + this.invoice.dueDate
        this.payment.clientId = this.invoice.invoiceId
        this.payment.amount = this.invoice.totalChargesIncTax
      }
    },
    "$store.state.payments.payment": function () {
      this.payment = this.$store.state.payments.payment.payment;
      if (this.payment && this.payment.paymentId) {
        this.isLoading = false
        router.push(`/payments`);
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const { paymentTypeId, amount, clientId } = this.payment;
      if (paymentTypeId && amount && clientId) {
        this.isLoading = true
        this.$store.dispatch("payments/create", this.payment);
      } else {
        this.openAlert("Insert required fields");
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.clients.all.items &&
        this.$store.state.payments.paymentTypes.paymentTypes
      ) {
        if (this.fromInvoice === true && this.$store.state.invoices.invoice.invoice) {
          this.linkItems = this.getLinkItems();
          this.isLoading = false;
        } else if(this.fromInvoice === false) {
          this.linkItems = this.getLinkItems();
          this.isLoading = false;
        }
        
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Payments",
          name: "Payments",
          params: null,
        },
      ];
    },
    changeClientId: function (value) {
      this.payment.clientId = value;
      this.payment.invoiceId = null
      this.payment.paymentTypeId = null
      this.payment.amount = null
      this.isLoading = true;
      this.$store.dispatch("invoices/getInvoicesbyClient", {
        siteId: this.site.siteId,
        clientId: value,
      });
    },
    changeInvoiceId: function (value) {
      this.payment.invoiceId = value;
      this.payment.amount = (this.invoicesbyClient.filter(invoice => { return invoice.invoiceId === parseInt(value) }))[0].totalChargesIncTax
    },
    changePaymentTypeId: function (value) {
      this.payment.paymentTypeId = value;
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
