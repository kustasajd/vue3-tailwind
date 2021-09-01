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
    <no-permission :isLoading="isLoading" :hasPermission="hasPermission" />
    <!-- Product Pricing Detail -->
    <form @submit.prevent="handleSubmit" v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">
          {{siteProductPricing.siteProduct.site.brandName}} - {{siteProductPricing.siteProduct.product.name}} - Update pricing
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
        >
          <div>
            <div class="mb-4">
              <div class="text-gray-900 font-bold text-lg mb-2">Tax Rate</div>
              <select-box
                nameField="tax"
                valueField="taxRateId"
                :options="taxRates"
                :selectedValue="siteProductPricing.taxRateId"
                @onSelect="(value) => changeTaxRateId(value)"
              ></select-box>
            </div>
            <div class="mb-4">
              <div class="text-gray-900 font-bold text-lg mb-2">
                Product Charge Type
              </div>
              <select-box
                nameField="type"
                valueField="productChargeTypeId"
                :options="productChargeTypes"
                :selectedValue="siteProductPricing.productChargeTypeId"
                @onSelect="(value) => changeProductChargeTypeId(value)"
              ></select-box>
            </div>
            <div class="mb-4">
              <label class="text-gray-900 font-bold text-lg mb-2" for="baseRate"
                >Base Rate</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="number" step="0.01"
                v-model="siteProductPricing.baseRate"
              />
            </div>
            <div class="mb-4">
              <label class="text-gray-900 font-bold text-lg mb-2" for="optionName"
                >Option Name</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="siteProductPricing.optionName"
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
import { useMeta } from 'vue-meta'
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission } from "../../helpers/index"

export default defineComponent({
  components: {
    SelectBox,
    Breadcrumb,
    AlertForm,
    NoPermission
  },
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getPermission, metaData }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    productChargeTypes: [],
    taxRates: [],
    siteId: null,
    siteProductPricingId: null,
    siteProductPricing: {},
    hasPermission: false,
    formSubmit: false,
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.siteProductPricingId = this.$route.params.siteProductPricingId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/getSiteProductPricingById", { siteId: this.siteId, siteProductPricingId: this.siteProductPricingId });
      this.$store.dispatch("sites/getAllTaxRate");
      this.$store.dispatch("sites/getAllProductChargeType");
    }
  },
  watch: {
    "$store.state.sites.siteProduct": function () {
      this.siteProduct = this.$store.state.sites.siteProduct.siteProduct;
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
    "$store.state.sites.siteProductPricing": function () {
      this.siteProductPricing = this.$store.state.sites.siteProductPricing.siteProductPricing;
      if (this.formSubmit == false) {
        this.checkLoading();
      } else if (this.siteProductPricing && this.siteProductPricing.siteProductPricingId && this.formSubmit === true) {
        router.push(`/site/${this.siteId}/product/${this.siteProductPricing.siteProductId}`);
      }
    },
    
  },
  methods: {
    handleSubmit(e) {
      this.formSubmit = true
      const { siteProductId, taxRateId, productChargeTypeId, baseRate } = this.siteProductPricing
      if (siteProductId && taxRateId && productChargeTypeId && baseRate) {
        this.isLoading = true;
        this.$store.dispatch("sites/updateSiteProductPricing", this.siteProductPricing);
      } else {
        this.openAlert("Insert required fields");
      }
    },

    changeTaxRateId(value) {
      this.siteProductPricing.taxRateId = value;
    },
    changeProductChargeTypeId(value) {
      this.siteProductPricing.productChargeTypeId = value;
    },
    checkLoading: function () {
      if (
        this.$store.state.sites.productChargeTypes.productChargeTypes &&
        this.$store.state.sites.taxRates.taxRates && 
        this.$store.state.sites.siteProductPricing.siteProductPricing
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Update Pricing Option | ${this.siteProductPricing.siteProduct.product.name} | ${this.siteProductPricing.siteProduct.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Sites',
          name: 'Sites',
          params: null
        },
        {
          index: 2,
          title: this.siteProductPricing.siteProduct.site.brandName,
          name: 'SiteDetail',
          params: {
            siteId: this.siteProductPricing.siteProduct.site.siteId,
          }
        },
        {
          index: 3,
          title: 'Site Products',
          name: 'SiteProducts',
          params: {
            siteId: this.siteId,
          }
        },
      ]
    },
    onClose() {
      this.isModalVisible = false;
      this.alertContent = "";
    },
    openAlert(value) {
      this.alertContent = value;
      this.isModalVisible = true;
      return
    },
  },
});
</script>
