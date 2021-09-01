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
    <div v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <!-- Licence Product Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            {{ licenceTemplateDetail.name }} <br /> New Licence Template Product
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
                  @onSelect="(value) => changeSiteProductId(value)"
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
              <div
                class="mb-4"
                v-if="siteProductPricing && siteProductPricing.length > 0"
              >
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Product Pricing
                </div>
                <select-box
                  nameField="productChargeTypeAndBaseRate"
                  valueField="siteProductPricingId"
                  :options="siteProductPricing"
                  :selectedValue="licenceProduct.siteProductPricingId"
                  @onSelect="(value) => changeSiteProductPricingId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="licenceProduct.siteProductPricingId">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="overridePrice"
                  >Override Price({{
                    licenceTemplateDetail.site.currency.symbol
                  }})</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="licenceProduct.overridePrice"
                />
              </div>
              <div class="mb-4">
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
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from 'vue-meta'
import { getPermission } from "../../helpers/index"
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    NoPermission
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    siteId: null,
    siteLicenceTemplateId: null,
    licenceTemplateDetail: {},
    licenceProduct: {},
    licenceProductId: null,
    licenceTypes: [],
    siteProductPricing: [],
    siteProductsBySiteId: [],
    siteProduct: [],
    licenceProductTypes: [],
    paidInAdvanceStatus: [
      {name: 'Active', paidInAdvance: true},
      {name: 'InActive', paidInAdvance: false}
    ],
    hasPermission: false
  }),
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getPermission, metaData }
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    this.siteLicenceTemplateId = this.$route.params.siteLicenceTemplateId;
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/licenceTemplateDetail", {
        siteId: this.siteId,
        siteLicenceTemplateId: this.siteLicenceTemplateId,
      });
      this.$store.dispatch("sites/getSiteProductsBySiteId", { id: this.siteId });
      this.$store.dispatch("licences/getLicenceProductType");
    }
  },
  watch: {
    "$store.state.sites.licenceProduct.licenceProduct": function () {
      this.licenceProduct = this.$store.state.sites.licenceProduct.licenceProduct;
      if (this.licenceProduct && this.licenceProduct.siteLicenceProductId) {
        router.push(
          `/site/${this.siteId}/licence-template/${this.siteLicenceTemplateId}/edit`
        );
      }
    },
    "$store.state.sites.licenceTemplateDetail": function () {
      this.licenceTemplateDetail = this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail;
      this.checkLoading();
    },
    "$store.state.sites.siteProductsBySiteId": function () {
      this.siteProductsBySiteId = this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId;
      if (this.siteProductsBySiteId) {
        this.siteProductsBySiteId.forEach((item) => {
          this.siteProduct.push({
            productName: item.product.name,
            siteProductId: item.siteProductId,
          });
        });
      }
      this.checkLoading();
    },
    "$store.state.licences.licenceProductTypes": function () {
      this.licenceProductTypes = this.$store.state.licences.licenceProductTypes.licenceProductTypes;
      this.checkLoading();
    },
  },
  methods: {
    handleSubmit(e) {
      const { siteProductPricingId, overridePrice, paidInAdvance, licenceProductTypeId } = this.licenceProduct;
      if (siteProductPricingId && paidInAdvance) {
        this.isLoading = true;
        this.$store.dispatch("sites/createLicenceProduct", {
          siteLicenceTemplateId: this.siteLicenceTemplateId,
          overridePrice: overridePrice,
          siteProductPricingId: siteProductPricingId,
          paidInAdvance: paidInAdvance,
          licenceProductTypeId: licenceProductTypeId,
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail &&
        this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId && 
        this.$store.state.licences.licenceProductTypes.licenceProductTypes
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Add Product | ${this.licenceTemplateDetail.name} | ${this.licenceTemplateDetail.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Licence Templates',
          name: 'LicenceTemplates',
          params: {
            siteId: this.siteId
          }
        },
        {
          index: 2,
          title: this.licenceTemplateDetail.name,
          name: 'LicenceTemplateDetail',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
        {
          index: 3,
          title: 'Edit',
          name: 'UpdateLicenceTemplate',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
        {
          index: 4,
          title: 'Add Product',
          name: 'CreateSiteLicenceProduct',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
      ]
    },
    changeSiteProductPricingId: function (value) {
      this.licenceProduct.siteProductPricingId = value;
      this.siteProductPricing.forEach(element => {
        if (element.siteProductPricingId === parseInt(value)) {
          this.licenceProduct.overridePrice = parseInt(element.baseRate)
        }
      });
    },
    changeSiteProductId: function (value) {
      this.siteProductsBySiteId.forEach((element) => {
        if (element.siteProductId === parseInt(value)) {
          this.siteProductPricing = element.siteProductPricings;   
          this.siteProductPricing.forEach(element => {
            element.productChargeTypeAndBaseRate = element.optionName ? `${element.optionName}-${element.productChargeType.type}-${this.licenceTemplateDetail.site.currency.symbol}${(element.baseRate).toFixed(2)}`
                                                    : `${element.productChargeType.type}-${this.licenceTemplateDetail.site.currency.symbol}${(element.baseRate).toFixed(2)}`
          });
          return;
        }
      });
    },
    changePaidInAdvanceStatus: function (value) {
      this.licenceProduct.paidInAdvance = value
    },
    changeLicenceProductTypeId: function (value) {
      this.licenceProduct.licenceProductTypeId = value
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
