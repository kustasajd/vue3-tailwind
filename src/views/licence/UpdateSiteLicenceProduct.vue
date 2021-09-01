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
            {{ licenceTemplateDetail.site.brandName }} -
            {{ licenceTemplateDetail.name }} - Update Licence Product
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
                  Site Product
                </div>
                <select-box
                  nameField="productName"
                  valueField="siteProductId"
                  :options="siteProduct"
                  :selectedValue="licenceProductDetail.siteProductId"
                  @onSelect="(value) => changeSiteProductId(value)"
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
                  :selectedValue="licenceProductDetail.siteProductPricingId"
                  @onSelect="(value) => changeSiteProductPricingId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="licenceProductDetail.overridePrice">
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
                  v-model="licenceProductDetail.overridePrice"
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
                  :selectedValue="licenceProductDetail.paidInAdvance"
                  @onSelect="(value) => changePaidInAdvanceStatus(value)"
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
                  :selectedValue="licenceProductDetail.licenceProductTypeId"
                  @onSelect="(value) => changeLicenceProductTypeId(value)"
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
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import { getPermission } from "../../helpers/index"
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
    siteLicenceProductId: null,
    licenceTemplateDetail: {},
    licenceProduct: {},
    licenceProductDetail: {},
    licenceProductId: null,
    licenceTypes: [],
    siteProductPricing: [],
    siteProductsBySiteId: [],
    siteProduct: [],
    paidInAdvanceStatus: [
      {name: 'Active', paidInAdvance: true},
      {name: 'InActive', paidInAdvance: false}
    ],
    licenceProductTypes: [],
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
    this.siteLicenceTemplateId = this.$route.params.siteLicenceTemplateId;
    this.siteLicenceProductId = this.$route.params.siteLicenceProductId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/licenceTemplateDetail", {
        siteId: this.siteId,
        siteLicenceTemplateId: this.siteLicenceTemplateId,
      });
      this.$store.dispatch(
        "sites/licenceProductDetail",
        this.siteLicenceProductId
      );
      this.$store.dispatch("sites/getSiteProductsBySiteId", { id: this.siteId });
      this.$store.dispatch("licences/getLicenceProductType");
    }
  },
  watch: {
    "$store.state.sites.licenceTemplateDetail": function () {
      this.licenceTemplateDetail = this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail;
      this.checkLoading();
    },
    "$store.state.sites.licenceProductDetail": function () {
      this.licenceProductDetail = this.$store.state.sites.licenceProductDetail.licenceProductDetail;
      if (this.licenceProductDetail) {
        this.licenceProductDetail.siteProductId = this.licenceProductDetail.siteProductPricing.siteProductId;
        if (this.siteProductsBySiteId) {
          this.changeSiteProductId(this.licenceProductDetail.siteProductId);
        }
      }
      this.checkLoading();
    },
    "$store.state.sites.licenceProduct.licenceProduct": function () {
      if (this.$store.state.sites.licenceProduct.licenceProduct) {
        router.push(
          `/site/${this.siteId}/licence-template/${this.siteLicenceTemplateId}/edit`
        );
      }
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
        if (this.licenceProductDetail && this.licenceProductDetail.siteProductId) {
          this.changeSiteProductId(this.licenceProductDetail.siteProductId);
        }
      }
      this.checkLoading();
    },
    "$store.state.licences.licenceProductTypes": function () {
      this.licenceProductTypes = this.$store.state.licences.licenceProductTypes.licenceProductTypes;
      this.checkLoading();
    },
  },
  methods: {
    handleSubmit(e): void {
      const { siteProductPricingId, overridePrice, paidInAdvance, licenceProductTypeId } = this.licenceProductDetail;
      if (siteProductPricingId && paidInAdvance && licenceProductTypeId) {
        this.isLoading = true;
        this.$store.dispatch("sites/updateLicenceProduct", {
          siteLicenceTemplateId: this.siteLicenceTemplateId,
          overridePrice: overridePrice,
          siteProductPricingId: siteProductPricingId,
          paidInAdvance: paidInAdvance,
          licenceProductTypeId: licenceProductTypeId,
          siteLicenceProductId: this.siteLicenceProductId,
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail &&
        this.$store.state.sites.licenceProductDetail.licenceProductDetail &&
        this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId && 
        this.$store.state.licences.licenceProductTypes.licenceProductTypes
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Update Product | ${this.licenceTemplateDetail.name} | ${this.licenceTemplateDetail.site.brandName} | AKARA`
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
          title: this.licenceTemplateDetail.site.brandName,
          name: 'SiteDetail',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
          }
        },
        {
          index: 3,
          title: this.licenceTemplateDetail.name,
          name: 'LicenceTemplateDetail',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
      ]
    },
    changeSiteProductPricingId: function (value) {
      this.licenceProductDetail.siteProductPricingId = value;
      this.siteProductPricing.forEach((element) => {
        if (element.siteProductPricingId === parseInt(value)) {
          this.licenceProductDetail.overridePrice = parseInt(element.baseRate);
        }
      });
    },
    changeSiteProductId: function (value) {
      this.siteProductsBySiteId.forEach((element) => {
        if (element.siteProductId === parseInt(value)) {
          this.siteProductPricing = element.siteProductPricings;   
          this.siteProductPricing.forEach(element => {
            element.productChargeTypeAndBaseRate = element.optionName ? `${element.optionName} - ${element.productChargeType.type} - ${(element.baseRate).toFixed(2)}`
                                                    : `${element.productChargeType.type} - ${(element.baseRate).toFixed(2)}`
          });
          return;
        }
      });
    },
    changePaidInAdvanceStatus: function (value) {
      this.licenceProductDetail.paidInAdvance = value
    },
    changeLicenceProductTypeId: function (value) {
      this.licenceProductDetail.licenceProductTypeId = value
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
