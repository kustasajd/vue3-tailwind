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
      <!-- Licence Product Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Licence#{{ licenceId }} - Update Product
          </h3>
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
            v-if="licenceProduct"
          >
            <div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Product
                </div>
                <select-box
                  nameField="productName"
                  valueField="productId"
                  :options="siteProduct"
                  :selectedValue="licenceProduct.productId"
                  @onSelect="(value) => changeProductId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Product Type
                </div>
                <select-box
                  nameField="type"
                  valueField="licenceProductTypeId"
                  :options="licenceProductTypes"
                  :selectedValue="licenceProduct.licenceProductTypeId"
                  @onSelect="(value) => changeLicenceProductTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4" >
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Charge Type
                </div>
                <select-box
                  nameField="type"
                  valueField="productChargeTypeId"
                  :options="productChargeTypes"
                  :selectedValue="licenceProduct.productChargeTypeId"
                  @onSelect="(value) => changeProductChargeTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4" >
                <div class="text-gray-900 font-bold text-lg mb-2">Tax Rate</div>
                <select-box
                  nameField="tax"
                  valueField="taxRateId"
                  :options="taxRates"
                  :selectedValue="licenceProduct.taxRateId"
                  @onSelect="(value) => changeTaxRateId(value)"
                ></select-box>
              </div>
              <div class="mb-4" >
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="overridePrice"
                  >Override Price({{ site.currency.symbol }})</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="licenceProduct.overridePrice"
                />
              </div>
              <div class="mb-4" >
                <div class="text-gray-900 font-bold text-lg mb-2">
                  PaidIn Advance
                </div>
                <select-box
                  nameField="name"
                  valueField="paidInAdvance"
                  :options="paidInAdvanceStatus"
                  :selectedValue="licenceProduct.paidInAdvance"
                  @onSelect="(value) => changePaidInAdvanceStatus(value)"
                ></select-box>
              </div>
              <div class="mb-4" >
                <label class="text-gray-900 font-bold text-lg mb-2" for="notes"
                  >Note</label
                >
                <textarea
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="licenceProduct.notes"
                ></textarea>
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
import { removeDuplicates } from "../../helpers/index";
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
    licenceProduct: {},
    formSubmit: false,
    licenceProductTypes: [],
    taxRates: [],
    productChargeTypes: [],
    siteProduct: [],
    paidInAdvanceStatus: [
      { name: "Active", paidInAdvance: true },
      { name: "InActive", paidInAdvance: false },
    ],
    showFields: true
  }),
  setup() {
    return { removeDuplicates }
  },
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.siteId = this.site.siteId;
    this.licenceId = this.$route.params.licenceId;
    this.licenceProductId = this.$route.params.licenceProductId;
    this.$store.dispatch("products/getProductsBySiteId", { id: this.siteId });
    this.$store.dispatch("licences/getLicenceProductType");
    this.$store.dispatch("licences/licenceProductDetail", this.licenceProductId);
    this.$store.dispatch("sites/getAllTaxRate");
    this.$store.dispatch("sites/getAllProductChargeType");
  },
  watch: {
    "$store.state.licences.licenceProduct": function () {
      this.licenceProduct = this.$store.state.licences.licenceProduct.licenceProduct;
      if (
        this.licenceProduct &&
        this.licenceProduct.licenceProductId &&
        this.formSubmit === true
      ) {
        this.isLoading = false
        router.push(`/licence/${this.licenceProduct.licenceId}/edit`);
      } else if(this.licenceProduct && this.formSubmit === false) {
        this.checkLoading();
      }
    },
    "$store.state.licences.licenceProductTypes": function () {
      this.licenceProductTypes = this.$store.state.licences.licenceProductTypes.licenceProductTypes;
      this.checkLoading();
    },
    "$store.state.sites.taxRates": function () {
      this.taxRates = this.$store.state.sites.taxRates.taxRates;
      this.checkLoading();
    },
    "$store.state.sites.productChargeTypes": function () {
      this.productChargeTypes = this.$store.state.sites.productChargeTypes.productChargeTypes;
      this.checkLoading();
    },
    "$store.state.products.siteProducts": function () {
      this.siteProducts = this.$store.state.products.siteProducts.siteProducts;
      if (this.siteProducts) {
        this.siteProducts.forEach((item) => {
          this.siteProduct.push({
            productName: item.product.name,
            productId: item.product.productId,
          });
          this.siteProduct = this.removeDuplicates(this.siteProduct, 'productId')
        });
      }
      this.checkLoading();
    },
  },
  methods: {    
    handleSubmit(e) {
      const {
        licenceProductId,
        productId,
        productChargeTypeId,
        overridePrice,
        taxRateId,
        paidInAdvance,
        licenceProductTypeId,
        notes,
      } = this.licenceProduct;
      if (productChargeTypeId && productId && licenceProductTypeId && taxRateId) {
        this.isLoading = true;
        this.formSubmit = true;
        this.$store.dispatch("licences/updateLicenceProduct", {
          licenceProductId: licenceProductId,
          licenceId: this.licenceId,
          productId: productId,
          productChargeTypeId: productChargeTypeId,
          paidInAdvance: paidInAdvance,
          licenceProductTypeId: licenceProductTypeId,
          overridePrice: overridePrice,
          taxRateId: taxRateId,
          notes: notes,
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.products.siteProducts.siteProducts && 
        this.$store.state.licences.licenceProductTypes.licenceProductTypes && 
        this.$store.state.sites.taxRates.taxRates && 
        this.$store.state.licences.licenceProduct.licenceProduct &&
        this.$store.state.sites.productChargeTypes.productChargeTypes
      ) {
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
    changeProductId: function (value) {
      this.licenceProduct.productId = value;
    },
    changeLicenceProductTypeId: function (value) {
      this.licenceProduct.licenceProductTypeId = value
    },
    changeProductChargeTypeId: function (value) {
      this.licenceProduct.productChargeTypeId = value;
    },
    changePaidInAdvanceStatus: function (value) {
      this.licenceProduct.paidInAdvance = value;      
    },
    changeTaxRateId: function (value) {
      this.licenceProduct.taxRateId = value
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
