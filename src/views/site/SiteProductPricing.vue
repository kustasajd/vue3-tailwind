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
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-medium">
          {{siteProduct.product.name}} - Pricing Options
        </h3>
        <div class="text-center">
          <router-link
            :to="{ name: 'AddProductPricing', params: { siteId: siteId, siteProductId: siteProductId }}"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Add Pricing Option
          </router-link>
        </div>
      </div>
      <div class="mt-8" v-if="siteProductPricing.length>0">
        <div class="mt-6">
          <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div
              class="inline-block min-w-full shadow rounded-lg overflow-hidden"
            >
              <table class="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Charge Type
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Option
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Base Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Tax Rate
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in siteProductPricing" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.productChargeType.type }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.optionName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ site.currency.symbol }}{{ parseFloat(item.baseRate).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        +{{ item.taxRate.tax }} -
                        {{ item.taxRate.taxPercentage }}%
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'UpdateProductPricing',
                          params: { siteId: siteId, siteProductPricingId: item.siteProductPricingId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Edit
                      </router-link>
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
import { useMeta } from 'vue-meta'
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission } from "../../helpers/index"

export default defineComponent({
  components: {
    Breadcrumb,
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
    siteProductPricing: [],
    siteId: null,
    siteProductId: null,
    siteProduct: {},
    hasPermission: false
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.siteProductId = this.$route.params.siteProductId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
      this.$store.dispatch("sites/getSiteProductById", { siteId: this.siteId, siteProductId: this.siteProductId });
      this.$store.dispatch("sites/getSiteProductPricing", {
        siteId: this.siteId,
        siteProductId: this.siteProductId,
      });
    }
  },
  watch: {
    "$store.state.sites.siteProductPricing": function () {
      this.siteProductPricing = this.$store.state.sites.siteProductPricing.siteProductPricing;
      this.checkLoading();
    },
    "$store.state.sites.siteProduct": function () {
      this.siteProduct = this.$store.state.sites.siteProduct.siteProduct;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.sites.siteProductPricing.siteProductPricing && this.$store.state.sites.siteProduct.siteProduct) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Pricing Options | ${this.siteProduct.product.name} | ${this.siteProduct.site.brandName} | AKARA`
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
          title: this.siteProduct.site.brandName,
          name: 'SiteDetail',
          params: {
            siteId: this.siteProduct.site.siteId,
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
  },
});
</script>