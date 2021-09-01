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
      <!-- Site Detail -->
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Site - {{ site.brandName }}
          </h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'UpdateSite',
                params: { siteId: $route.params.siteId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Edit Site
            </router-link>
          </div>
        </div>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="text-gray-900 font-bold text-lg mb-2">Brand Name</div>
              <p class="text-gray-700 text-base mb-4">
                {{ site.brandName }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Address Street
              </div>
              <p class="text-gray-700 text-base mb-4">
                {{ site.addressStreet }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">Currency</div>
              <p class="text-gray-700 text-base mb-4">
                {{ site.currency.abbreviation }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2" v-if="site.logoUrl">Logo</div>
              <div class="block w-24 h-12 overflow-hidden border rounded object-centain" v-if="site.logoUrl">
                <img class="w-full h-full object-contain" :src="site.logoUrl"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Site Users -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-medium">Users</h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'AddUser',
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Add User
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
                      User Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      User Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, index) in users" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ u.user.fullName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ u.userRoleType.name }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Site Clients -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-medium">Clients</h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'CreateClient',
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Add Client
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
                      Image
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Trading Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Primary Contact
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(client, index) in clients" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img
                            class="w-full h-full rounded-full object-cover"
                            :src="
                              client.profilePic
                                ? client.profilePic
                                : 'https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80'
                            "
                            alt
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ client.tradingName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ client.primaryContact }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ client.email }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'ClientDetail',
                          params: { clientId: client.clientId },
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
      <!-- Site Products -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-medium">Products</h3>
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
                      Product Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Charge Types
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Product Description
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
                            {{item.productChargeType.type}} - {{site.currency.symbol}}{{ parseFloat(item.baseRate).toFixed(2) }}
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
      <!-- Site Licence -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Licence Templates</h3>
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
                      Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Number of Documents
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Number of Products
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in licenceTemplates" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.licenceType.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.licenceType.description }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteLicenceDocuments.length }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.siteLicenceProducts.length }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'LicenceTemplateDetail',
                          params: {
                            siteId: item.site.siteId,
                            siteLicenceTemplateId: item.siteLicenceTemplateId,
                          },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
                      </router-link>
                      <router-link
                        :to="{
                          name: 'UpdateLicenceTemplate',
                          params: {
                            siteId: item.site.siteId,
                            siteLicenceTemplateId: item.siteLicenceTemplateId,
                          },
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

export default defineComponent({
  components: {
    Breadcrumb
  },
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { metaData }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    siteId: null,
    site: {},
    users: [],
    clients: [],
    licenceTemplates: []
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.$store.dispatch("sites/getById", { id: this.siteId });
    this.$store.dispatch("users/getAll", { id: this.siteId });
    this.$store.dispatch("clients/getAll", { id: this.siteId });
    this.$store.dispatch("sites/getLicenceTemplate", { id: this.siteId });
    this.$store.dispatch("sites/getSiteProductsBySiteId", { id: this.siteId });
  },
  watch: {
    "$store.state.sites.site": function () {
      this.site = this.$store.state.sites.site.site;
      if (this.site) {
        this.metaData.meta.title = `${this.site.brandName} | AKARA`
        this.checkLoading();
      }
    },
    "$store.state.users.all": function () {
      this.users = this.$store.state.users.all.items;
      this.checkLoading();
    },
    "$store.state.clients.all": function () {
      this.clients = this.$store.state.clients.all.items;
      this.checkLoading();
    },
    "$store.state.sites.licenceTemplates": function () {
      this.licenceTemplates = this.$store.state.sites.licenceTemplates.licenceTemplates;
      this.checkLoading();
    },    
     "$store.state.sites.siteProductsBySiteId": function () {
      this.siteProductsBySiteId = this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.sites.site.site &&
        this.$store.state.users.all.items &&
        this.$store.state.clients.all.items &&
        this.$store.state.sites.licenceTemplates.licenceTemplates && 
        this.$store.state.sites.siteProductsBySiteId.siteProductsBySiteId
      ) {
        this.linkItems = this.getLinkItems()
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
        {
          index: 3,
          title: this.site.brandName,
          name: 'SiteDetail',
          params: {
            siteId: this.site.siteId,
          }
        },
      ]
    },
  },
});
</script>
