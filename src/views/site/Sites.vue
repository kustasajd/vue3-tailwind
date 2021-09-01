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
      <h3 class="text-gray-700 text-3xl font-medium mt-2">Site Management</h3>
      <div class="">
        <div class="mt-4">
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
                      
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Site
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Address
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Currency
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Users
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Clients
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody v-if="sites">
                  <tr v-for="(item, index) in sites" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <div class="block w-16 h-8 overflow-hidden border rounded object-centain" v-if="item.logoUrl">
                        <img class="w-full h-full object-contain" :src="item.logoUrl"/>
                      </div>
                    </td>
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
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.currency.abbreviation }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteUsers ? item.usersNumber : 0 }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteClients ? item.clientsNumber : 0 }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'SiteDetail',
                          params: { siteId: item.siteId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
                      </router-link>
                      <router-link
                        :to="{
                          name: 'UpdateSite',
                          params: { siteId: item.siteId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Edit
                      </router-link>
                      <router-link
                        :to="{
                          name: 'SiteProducts',
                          params: { siteId: item.siteId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Products
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
    Breadcrumb,
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    sites: [],
  }),
  created() {
    this.linkItems = this.getLinkItems();
    this.$store.dispatch("sites/getAll");
  },
  watch: {
    "$store.state.sites.all": function () {
      this.checkLoading();
      if (this.$store.state.sites.all.items) {
        this.$store.state.sites.all.items.forEach((site) => {
          site.usersNumber = this.getNum(site.siteUsers);
          site.clientsNumber = this.getNum(site.siteClients);
        });
        this.sites = this.$store.state.sites.all.items;
      }
    },
  },
  methods: {
    getNum: function (items) {
      let number = items.filter((user) => (user.active = true)).length;
      return number;
    },
    checkLoading: function () {
      if (this.$store.state.sites.all.items) {
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
          title: "Site Management",
          name: "Sites",
          params: null,
        },
      ];
    },
  },
});
</script>