<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div
        class="mt-8"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">{{site.brandName}} - Products</h3>
          <div class="text-center">
            <router-link
              :to="{ name: 'AddSiteProduct', params: { siteId: siteId }}"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Add Product
            </router-link>
          </div>
        </div>
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
                      Product
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Pricing
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Description
                    </th>                    
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in siteProductsBySiteId"
                    :key="index"
                  >
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
                        <span class="text-gray-900 whitespace-no-wrap">
                          <div v-for="(item, i) in item.siteProductPricings" :key="i">
                            <span v-if="item.optionName">{{item.optionName}}</span>
                            {{site.currency.symbol}}{{ parseFloat(item.baseRate).toFixed(2).replace('.00','') }}
                            {{item.productChargeType.type}}
                            <span v-if="item.taxRateId==1" class="text-orange-500 italic">(No tax)</span>
                            <span v-if="item.taxRateId!=1" class="text-gray-600 italic">(+{{item.taxRate.tax}})</span>
                          </div>
                        </span>
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.product.description }}
                      </p>
                    </td>                    
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'SiteProductPricing',
                          params: {
                            siteProductId: item.siteProductId,
                            siteId: siteId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
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
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    Breadcrumb
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    siteProductsBySiteId: [],
    siteId: null,
    site: {}
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.$store.dispatch("sites/getSiteProductsBySiteId", { id: this.siteId });
  },
  watch: {
    "$store.state.sites.siteProductsBySiteId": function () {
      this.siteProductsBySiteId = this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId) {
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
  },
});
</script>