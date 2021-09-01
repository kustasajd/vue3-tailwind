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
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">
          Master Product List
        </h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'CreateProduct',
            }"
            class="
              py-2
              px-4
              text-center
              bg-gray-900
              rounded-md
              w-40
              text-white text-sm
              hover:bg-gray-800
            "
            >Create Product
          </router-link>
        </div>
      </div>
      <div class="mt-8">
        <div class="mt-6">
          <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div
              class="inline-block min-w-full shadow rounded-lg overflow-hidden"
            >
              <table class="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      class="
                        px-5
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Icon
                    </th>
                    <th
                      class="
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Name
                    </th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Description
                    </th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Number of sites
                    </th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody v-if="products">
                  <tr v-for="(item, index) in products" :key="index">
                    <td
                      class="
                        px-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p
                        class="text-gray-900 whitespace-no-wrap"
                        v-if="item.icon"
                      >
                        <span class="material-icons">{{ item.icon }}</span>
                      </p>
                    </td>
                    <td
                      class="
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.name }}
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.description }}
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteProducts.length }}
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <router-link
                        :to="{
                          name: 'ProductDetail',
                          params: { productId: item.productId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
                      </router-link>
                      <router-link
                        :to="{
                          name: 'UpdateProduct',
                          params: { productId: item.productId },
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
import { removeDuplicates, dynamicSort } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    Breadcrumb,
  },
  setup () {
    return { removeDuplicates, dynamicSort }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    products: [],
  }),
  created() {
    this.siteId = JSON.parse(
      localStorage.getItem("user")
    ).user.selectedSite.siteId;
    this.$store.dispatch("products/getAll", { id: this.siteId });
  },
  watch: {
    "$store.state.products.all": function () {
      this.products = this.$store.state.products.all.items;
      if (this.products) {
        this.products.forEach((product) => {
          product.siteProducts = product.siteProducts.filter((item) => {
            return item.active === true;
          });
          product.siteProducts = this.removeDuplicates(product.siteProducts, 'siteId');
        });
        this.products = this.products.sort(this.dynamicSort("name"));
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.products.all.items) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Akara Admin",
          name: "AkaraAdmin",
          params: null,
        },
        {
          index: 2,
          title: "Master Product List",
          name: "Products",
          params: null,
        },
      ];
    },
  },
});
</script>