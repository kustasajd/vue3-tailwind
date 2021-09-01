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
    <no-permission :isLoading="isLoading" :hasPermission="hasPermission" />
    <!-- Charge Detail -->
    <div v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Charge#{{ charge.chargeRegisterId }} - Update Charge
          </h3>          
        </div>
        <div class="mt-4 pb-4">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Client</div>
                <div class="text-center">
                  <select-box
                    nameField="tradingName"
                    valueField="clientId"
                    :options="clients"
                    :selectedValue="charge.clientId"
                    @onSelect="(value) => changeClientId(value)"
                  ></select-box>
                </div>
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Product</div>
                <div class="text-center">
                  <select-box
                    nameField="name"
                    valueField="siteProductId"
                    :options="siteProductsBySiteId"
                    :selectedValue="charge.siteProductId"
                    @onSelect="(value) => changeProductId(value)"
                  ></select-box>
                </div>
              </div>
              <div class="mb-4" v-if="siteProductPricing">
                <div class="text-gray-900 font-bold text-lg mb-2">Pricing</div>
                <div class="text-center">
                  <select-box
                    nameField="name"
                    valueField="siteProductPricingId"
                    :options="siteProductPricing"
                    :selectedValue="charge.siteProductPricingId"
                    @onSelect="(value) => changeSiteProductPricingId(value)"
                  ></select-box>
                </div>
              </div>
              <div class="mb-4" v-if="charge.productChargeTypeId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="rate"
                  >Rate</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="charge.rate"
                />
              </div>
              <div class="mb-4" v-if="charge.productChargeTypeId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="quantity"
                  >Quantity</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="charge.quantity"
                />
              </div>
              <div class="mb-4" v-if="charge.productChargeTypeId">
                <div class="text-gray-900 font-bold text-lg mb-2">Total Rate</div>
                <p class="text-gray-700 text-base mb-4">
                  {{ site.currency.symbol }}{{parseFloat(charge.rate * charge.quantity).toFixed(2)}}
                </p>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="timestamp"
                  >Added time</label
                >
                <div class="mt-1 w-full">
                  <a-date-picker class="w-full" size="large" @change="onChangeAddedTime" :defaultValue="getDate(charge.timestamp)"/>
                </div>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="notes"
                  >Note</label
                >
                <textarea
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="charge.notes"
                ></textarea>
              </div>
              <div class="flex items-center">
                <div class="mr-4">
                  <button
                    type="submit"
                    class="py-2 px-4 text-center bg-gray-900 rounded-md text-white text-sm hover:bg-gray-800"
                  >
                    Update Charge and Close
                  </button>
                </div>
                <div class="text-center">
                  <button
                    type="button"
                    @click="deleteCharge()"
                    class="py-2 px-4 text-center bg-gray-900 rounded-md text-white text-sm hover:bg-gray-800 mr-4"
                  >
                    Delete
                  </button>
                </div>
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
import { getPermission, dynamicSort, getDate } from "../../helpers/index";
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import ModalConfirm from "../../components/modals/ModalConfirm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    NoPermission,
    ModalConfirm
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    siteId: null,
    chargeRegisterId: null,
    site: {},
    charge: {
      quantity: 1,
    },
    clients: [],
    siteProductsBySiteId: [],
    products: [],
    clientLicences: [],
    hasPermission: false,
    formSubmit: false,
    showConfirmModal: false,
    alertContent: "",
    onClickDel: false
  }),
  setup() {
    return {
      getPermission,
      dynamicSort,
      getDate
    };
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.chargeRegisterId = this.$route.params.chargeRegisterId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.charge.timestamp = this.getDate(new Date())
      this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
      this.$store.dispatch("charges/getDetail", { id: this.chargeRegisterId });
      this.$store.dispatch("clients/getAll", { id: this.siteId });
      this.$store.dispatch("sites/getSiteProductsBySiteId", { id: this.siteId });
    }
  },
  watch: {
    "$store.state.clients.all": function () {
      this.clients = this.$store.state.clients.all.items;
      if (this.clients) {
        this.clients = this.clients.sort(this.dynamicSort("tradingName"));
        this.checkLoading();
      }
    },
    "$store.state.sites.siteProductsBySiteId": function () {
      this.siteProductsBySiteId = this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId;
      if (this.siteProductsBySiteId) {
        this.siteProductsBySiteId.forEach(element => {
          element.name = element.product.name
        });
        this.checkLoading();
      }
    },
    "$store.state.sites.siteProductPricing": function () {
      this.siteProductPricing = this.$store.state.sites.siteProductPricing.siteProductPricing;
      if (this.siteProductPricing) {
        this.siteProductPricing.forEach(item => {
          item.name = item.optionName ? `${item.optionName || ''} - ${item.productChargeType.type} -${this.site.currency.symbol}${item.baseRate.toFixed(2)}`
                      : `${item.productChargeType.type} -${this.site.currency.symbol}${item.baseRate.toFixed(2)}`
        });
        if (this.siteProductPricing.length > 0) {
          this.charge.siteProductPricingId = this.siteProductPricing[0].siteProductPricingId
          this.changeSiteProductPricingId(this.siteProductPricing[0].siteProductPricingId)
        }
        this.isLoading = false;
      }
    },
    "$store.state.charges.charge.charge": function () {
      this.charge = this.$store.state.charges.charge.charge
      if ((this.formSubmit === true && this.charge && this.charge.chargeRegisterId) || (this.onClickDel === true && this.charge)) {
        this.isLoading = false
        router.push(`/site/${this.siteId}/charge-register`);
      } else if (this.formSubmit === false && this.charge && this.charge.chargeRegisterId) {
        this.checkLoading();
      }
    },
  },
  methods: {
    handleSubmit(e) {
      this.formSubmit = true
      const { clientId, productId, rate, taxRateId, timestamp, quantity } = this.charge;
      this.charge.rateTotal = rate * quantity
      const currencyId = this.site.currency.currencyId;
      if (!clientId || !productId || !rate || !taxRateId || !currencyId || !timestamp) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.$store.dispatch("charges/update", this.charge);
      }
    },    
    checkLoading: function () {
      if (
        this.$store.state.charges.charge.charge &&
        this.$store.state.clients.all.items &&
        this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId
      ) {
        this.linkItems = this.getLinkItems()
        this.charge.siteProductId = (this.siteProductsBySiteId.filter(product=> { return product.product.productId === this.charge.productId }))[0].siteProductId
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: this.site.brandName + ' - charges',
          name: 'Charges',
          params: {
            siteId: this.siteId,
          }
        },
      ]
    },
    changeClientId: function (value) {
      this.charge.clientId = value;
    },
    changeProductId: function (value) {
      this.charge.siteProductId = value;
      let selected = this.siteProductsBySiteId.filter(
        (item) => parseInt(item.siteProductId) == parseInt(value)
      )[0]
      this.charge.productId = selected.product.productId;
      this.isLoading = true;
      this.$store.dispatch("sites/getSiteProductPricing", {
        siteId: this.siteId,
        siteProductId: value,
      });
    },
    changeSiteProductPricingId: function (value) {
      this.charge.siteProductPricingId = value
      const selectedSiteProductPricing = this.siteProductPricing.filter((item) => item.siteProductPricingId == value)[0]
      this.charge.taxRateId = selectedSiteProductPricing.taxRate.taxRateId;
      this.charge.productChargeTypeId = selectedSiteProductPricing.productChargeType.productChargeTypeId
      this.charge.rate = this.siteProductPricing.filter(
        (item) => item.siteProductPricingId == value
      )[0].baseRate;
    },
    onChangeAddedTime(date, dateString) {
      this.charge.timestamp = dateString
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
    deleteCharge: function () {
      this.showConfirmModal = true
      if (this.charge.invoiceId === null) {
        this.alertContent = "Are you sure you want to delete this item?"
      } else {
        this.alertContent = "This charge register item is included in an invoice! Are you sure you want to delete it?"
      }
    },
    onDelete() {
      this.showConfirmModal = false
      this.alertContent = ""
      this.onClickDel = true
      this.isLoading = true
      this.$store.dispatch("charges/deleteCharge", {
        id: this.chargeRegisterId,
      });
    },
    onCloseConfirmModal() {
      this.showConfirmModal = false
      this.alertContent = ""
    },
  },
});
</script>
