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
      <!-- Product Detail -->
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold flex items-center">
            <span class="material-icons mr-3" v-if="product.icon">{{product.icon}}</span>
            {{ product.name }}
          </h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'UpdateProduct',
                params: { productId: $route.params.productId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Update Product
            </router-link>
          </div>
        </div>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
            v-if="product && product.productId"
          >
            <div>
              <div class="text-gray-900 font-bold text-lg mb-2">Name</div>
              <p class="text-gray-700 text-base mb-4 flex items-center">
                <span class="material-icons mr-3" v-if="product.icon">{{product.icon}}</span>
                {{ product.name }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Description
              </div>
              <p class="text-gray-700 text-base mb-4">
                {{ product.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Site Products -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Sites</h3>
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
                      Site
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Street
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in sites" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.brandName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.addressStreet }}
                      </p>
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
import { removeDuplicates } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    Breadcrumb
  },
  setup () {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { removeDuplicates, metaData }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    product: {},
    siteProducts: [],
    sites: []
  }),
  created() {
    this.$store.dispatch("products/getById", {
      id: this.$route.params.productId,
    });
    this.$store.dispatch("products/getSiteProducts", {
      id: this.$route.params.productId,
    });
  },
  watch: {
    "$store.state.products.product": function () {
      this.product = this.$store.state.products.product.product;
      this.checkLoading();
    },
    "$store.state.products.siteProducts": function () {
      this.siteProducts = this.$store.state.products.siteProducts.siteProducts;
      if (this.siteProducts) {
        this.siteProducts.forEach(item => {
          this.sites.push(item.site)
        });
        this.sites = this.removeDuplicates(this.sites, 'siteId')
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.products.product.product &&
        this.$store.state.products.siteProducts.siteProducts
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `${this.product.name} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Products',
          name: 'Products',
          params: null
        },
        {
          index: 2,
          title: this.product.name,
          name: 'ProductDetail',
          params: {
            productId: this.product.productId,
          }
        },
      ]
    },
  },
});
</script>
