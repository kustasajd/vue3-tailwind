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
            Licence#{{ licenceId }} - Add Product
          </h3>
          <div class="text-center" v-if="showFields === true">
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
            v-if="licenceProduct"
          >
            <div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Product
                </div>
                <select-box
                  nameField="productName"
                  valueField="siteProductId"
                  :options="siteProduct"
                  :selectedValue="licenceProduct.siteProductId"
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
              <div class="mb-4" v-if="showFields === true && isSpecial === true">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Product Charge Type
                </div>
                <select-box
                  nameField="type"
                  valueField="productChargeTypeId"
                  :options="productChargeTypes"
                  :selectedValue="licenceProduct.productChargeTypeId"
                  @onSelect="(value) => changeProductChargeTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="showFields === true">
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
              <div class="mb-4" v-if="showFields === true">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Paid In Advance
                </div>
                <select-box
                  nameField="name"
                  valueField="paidInAdvance"
                  :options="paidInAdvanceStatus"
                  :selectedValue="licenceProduct.paidInAdvance"
                  @onSelect="(value) => changePaidInAdvanceStatus(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="showFields === true">
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
    licenceProduct: {
      paidInAdvance: false
    },
    formSubmit: false,
    licenceProductTypes: [],
    productChargeTypes: [],
    siteProduct: [],
    paidInAdvanceStatus: [
      { name: "Active", paidInAdvance: true },
      { name: "InActive", paidInAdvance: false },
    ],
    showFields: false,
    isSpecial: false
  }),
  setup() {
    return { removeDuplicates }
  },
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.siteId = this.site.siteId;
    this.licenceId = this.$route.params.licenceId;
    this.$store.dispatch("products/getProductsBySiteId", { id: this.siteId });
    this.$store.dispatch("licences/getLicenceProductType");
  },
  watch: {
    "$store.state.licences.licenceProduct": function () {
      this.licenceProduct = this.$store.state.licences.licenceProduct.licenceProduct;
      if (
        this.licenceProduct &&
        this.licenceProduct.licenceProductId &&
        this.formSubmit === true
      ) {
        router.push(`/licence/${this.licenceProduct.licenceId}/edit`);
      }
    },
    "$store.state.licences.licenceProductTypes": function () {
      this.licenceProductTypes = this.$store.state.licences.licenceProductTypes.licenceProductTypes;
      this.checkLoading();
    },
    "$store.state.products.siteProducts": function () {
      this.siteProducts = this.$store.state.products.siteProducts.siteProducts;
      if (this.siteProducts) {
        this.siteProducts.forEach((item) => {
          this.siteProduct.push({
            productName: item.product.name,
            productId: item.product.productId,
            siteProductId: item.siteProductId,
          });
        });
      }
      this.checkLoading();
    },
    "$store.state.sites.siteProductPricing": function () {
      this.siteProductPricing = this.$store.state.sites.siteProductPricing.siteProductPricing;
      if (this.siteProductPricing) {
        this.licenceProduct.productChargeTypeId = null
        this.licenceProduct.overridePrice = null
        this.licenceProduct.taxRateId = null
        this.showFields = true
        if (this.siteProductPricing.length === 0) {
          this.showFields = false
          this.openAlert("No available charge type for this product");
        } else {
          this.productChargeTypes = []
          this.siteProductPricing.forEach((item) => {
            this.productChargeTypes.push({
              productChargeTypeId: item.productChargeType.productChargeTypeId,
              type: item.productChargeType.type,
              baseRate: item.baseRate,
              taxRateId: item.taxRate.taxRateId
            });
          });
          this.productChargeTypes = this.removeDuplicates(this.productChargeTypes, 'productChargeTypeId')
        }
        this.isLoading = false
      }
    },
  },
  methods: {    
    handleSubmit(e) {
      const {
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
        this.$store.dispatch("licences/createLicenceProduct", {
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
        this.$store.state.licences.licenceProductTypes.licenceProductTypes
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
      const selected = this.siteProducts.filter((item) => {
        return item.siteProductId === parseInt(value);
      })[0];
      this.licenceProduct.productId = selected.product.productId;
      this.licenceProduct.siteProductId = selected.siteProductId
      this.isLoading = true
      this.$store.dispatch("sites/getSiteProductPricing", {
        siteId: this.siteId,
        siteProductId: selected.siteProductId,
      });
    },
    changeLicenceProductTypeId: function (value) {
      this.isLoading = true
      let licenceProductTypeId = parseInt(value)
      this.isSpecial = false
      this.licenceProduct.licenceProductTypeId = licenceProductTypeId
      if (licenceProductTypeId === 2) {
        this.licenceProduct.paidInAdvance = true
      } else {
        this.licenceProduct.paidInAdvance = false
      }
      if (licenceProductTypeId === 5) {
        this.isSpecial = true
      } else {
        let productChargeTypeId
        switch(licenceProductTypeId) {
          case 1:
            productChargeTypeId = 1
            break;
          case 2:
            productChargeTypeId = 2
            break;
          case 3:
            productChargeTypeId = 1
            break;
          case 4:
            productChargeTypeId = 1
            break;
        }
        
        this.changeProductChargeTypeId(productChargeTypeId)
      }
      setTimeout(() => {
        this.isLoading = false
      }, 1);
    },
    changeProductChargeTypeId: function (value) {
      this.licenceProduct.productChargeTypeId = value;
      this.licenceProduct.overridePrice = null
      this.licenceProduct.taxRateId = null
      let selected = (this.productChargeTypes.filter(item=>{return parseInt(item.productChargeTypeId) === parseInt(value)}))[0]
      if (selected) {
        this.licenceProduct.overridePrice = selected.baseRate
        this.licenceProduct.taxRateId = selected.taxRateId
      }
    },
    changePaidInAdvanceStatus: function (value) {
      this.licenceProduct.paidInAdvance = value;      
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
