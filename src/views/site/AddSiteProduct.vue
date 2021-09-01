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
    <!-- Product Detail -->
    <form @submit.prevent="handleSubmit" v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">
          {{ site.brandName }} - Add Product 
        </h3>
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
        >
          <div>
            <div class="mb-4">
              <div class="text-gray-900 font-bold text-lg mb-2">Product</div>
              <select-box
                nameField="name"
                valueField="productId"
                :options="products"
                :selectedValue="productId"
                @onSelect="(value) => changeProductId(value)"
              ></select-box>
            </div>
            <div class="mb-4">
              <div class="text-gray-900 font-bold text-lg mb-2">Tax Rate</div>
              <select-box
                nameField="tax"
                valueField="taxRateId"
                :options="taxRates"
                :selectedValue="taxRateId"
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
                :selectedValue="productChargeTypeId"
                @onSelect="(value) => changeProductChargeTypeId(value)"
              ></select-box>
            </div>
            <div class="mb-4">
              <label class="text-gray-900 font-bold text-lg mb-2" for="baseRate"
                >Base Rate</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="number"
                step="0.01"
                v-model="baseRate"
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
import router from "../../router";
import { dynamicSort } from "../../helpers/index";
import SelectBox from "../../components/common/SelectBox.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import AlertForm from "../../components/modals/AlertForm.vue";

export default defineComponent({
  components: {
    SelectBox,
    Breadcrumb,
    AlertForm
  },
  setup() {
    return { dynamicSort };
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    products: [],
    productChargeTypes: [],
    taxRates: [],
    siteId: null,
    site: {},
    productId: null,
    taxRateId: null,
    productChargeTypeId: null,
    baseRate: 0
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.$store.dispatch("sites/getById", { id: this.siteId });
    this.$store.dispatch("products/getAll");
    this.$store.dispatch("sites/getAllTaxRate");
    this.$store.dispatch("sites/getAllProductChargeType");
  },
  watch: {
    "$store.state.sites.site": function () {
      this.site = this.$store.state.sites.site.site;
      this.checkLoading();
    },
    "$store.state.products.all": function () {
      this.products = this.$store.state.products.all.items;
      if (this.products) {
        this.products = this.products.sort(this.dynamicSort('name'))
        this.checkLoading();
      }
    },
    "$store.state.sites.productChargeTypes": function () {
      this.productChargeTypes = this.$store.state.sites.productChargeTypes.productChargeTypes;
      this.checkLoading();
    },
    "$store.state.sites.taxRates": function () {
      this.taxRates = this.$store.state.sites.taxRates.taxRates;
      this.checkLoading();
    },
    "$store.state.sites.siteProduct.siteProduct": function () {
      this.siteProduct = this.$store.state.sites.siteProduct.siteProduct;
      if (this.siteProduct && this.siteProduct.siteProductId) {
        router.push(`/site/${this.siteId}/products`);
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const { siteId, productId, taxRateId, productChargeTypeId, baseRate } = this
      if (siteId && productId && taxRateId && productChargeTypeId && baseRate>=0) {
        this.isLoading = true;
        this.$store.dispatch("sites/createSiteProduct", {
          siteId: siteId,
          productId: productId,
          taxRateId: taxRateId,
          productChargeTypeId: productChargeTypeId,
          baseRate: baseRate
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },

    changeProductId(value) {
      this.productId = value;
    },
    changeTaxRateId(value) {
      this.taxRateId = value;
    },
    changeProductChargeTypeId(value) {
      this.productChargeTypeId = value;
    },
    checkLoading: function () {
      if (
        this.$store.state.sites.site.site &&
        this.$store.state.products.all.items &&
        this.$store.state.sites.productChargeTypes.productChargeTypes &&
        this.$store.state.sites.taxRates.taxRates
      ) {
        this.linkItems = this.getLinkItems()
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
          title: this.site.brandName,
          name: 'SiteDetail',
          params: {
            siteId: this.site.siteId,
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
