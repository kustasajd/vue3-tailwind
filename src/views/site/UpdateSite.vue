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
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <!-- Site Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Edit Site - {{ site.brandName }}
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
            v-if="site && site.siteId"
          >
            <div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="tradingName"
                  >Brand Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="site.brandName"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="addressStreet"
                  >Address Street</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="site.addressStreet"
                />
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Currency</div>
                <select-box
                  nameField="name"
                  valueField="currencyId"
                  :options="currencies"
                  :selectedValue="site.currencyId"
                  @onSelect="(value) => changeCurrencyId(value)"
                ></select-box>
              </div>
            </div>
          </div>
        </div>
      </form>
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
                      <div class="w-64">
                        <select-box
                          nameField="name"
                          valueField="userRoleTypeId"
                          :options="allUserRoleTypes"
                          :selectedValue="u.userRoleType.userRoleTypeId"
                          :data="u"
                          @onSelect="(value, u) => changeUserRoleTypeId(value, u)"
                        ></select-box>
                      </div>
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
        <h3 class="text-gray-700 text-3xl font-medium">Clients</h3>
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

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
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
    isModalVisible: false,
    alertContent: "",
    site: {},
    users: [],
    clients: [],
    currencies: [],
    allUserRoleTypes: [],
    submitted: false
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.$store.dispatch("sites/getById", { id: this.siteId });
    this.$store.dispatch("users/getAll", { id: this.siteId });
    this.$store.dispatch("clients/getAll", { id: this.siteId });
    this.$store.dispatch("sites/getCurrencies");
    this.$store.dispatch("users/getAllUserRoleTypes");
  },
  watch: {
    "$store.state.sites.site": function () {
      this.site = this.$store.state.sites.site.site;
      if (this.site && this.submitted === false) {
        this.metaData.meta.title = `Update ${this.site.brandName} | AKARA`
        this.checkLoading();
      } else if (this.site && this.submitted === true) {
        router.push(`/site/${this.site.siteId}`);
      }
    },
    "$store.state.users.all": {
      deep: true,
      handler: function () {
        this.users = this.$store.state.users.all.items;
        this.checkLoading();
      },
    },
    "$store.state.clients.all": function () {
      this.clients = this.$store.state.clients.all.items;
      this.checkLoading();
    },
    "$store.state.sites.currencies": function () {
      this.currencies = this.$store.state.sites.currencies.currencies;
      this.checkLoading();
    },
    "$store.state.users.allUserRoleTypes": function () {
      this.allUserRoleTypes = this.$store.state.users.allUserRoleTypes.allUserRoleTypes;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.sites.site.site &&
        this.$store.state.users.all.items &&
        this.$store.state.clients.all.items &&
        this.$store.state.sites.currencies.currencies && 
        this.$store.state.users.allUserRoleTypes.allUserRoleTypes
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
        {
          index: 4,
          title: 'Edit',
          name: 'UpdateSite',
          params: {
            siteId: this.site.siteId,
          }
        },
      ]
    },
    handleSubmit(e) {
      const { brandName, addressStreet, currencyId, siteId } = this.site;
      if (brandName && addressStreet && currencyId) {
        this.submitted = true
        this.isLoading = true;
        this.$store.dispatch("sites/update", {
          siteId: siteId,
          brandName: brandName,
          addressStreet: addressStreet,
          currencyId: currencyId
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },

    changeCurrencyId(value) {
      this.site.currencyId = value;
    },
    changeUserRoleTypeId(value, user) {
      user.userRoleType.userRoleTypeId = value
      user.userRoleTypeId = value
      this.$store.dispatch("sites/updateSiteUser", user);
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
