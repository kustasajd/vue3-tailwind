<template>
  <div class="flex h-screen bg-gray-200 font-roboto">
    <div></div>

    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container mx-auto px-6 py-8 h-full">
          <div class="h-full">
            <div
              class="h-full my-auto flex items-center justify-center"
              v-if="isLoading"
            >
              <img
                class="w-20 h-20"
                src="../../assets/icons/spinner.gif"
                alt=""
              />
            </div>
            <div v-if="!isLoading">
              <div class="flex items-center justify-between mt-6">
                <h3 class="text-gray-700 text-3xl font-semibold">
                  Select Your Site
                </h3>
              </div>
              <div class="mt-2">
                <div class="mt-2">
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
                              Currency
                            </th>
                            <th
                              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                            >
                              My Role
                            </th>
                            <th
                              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                            >
                              
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in userDetail.siteUsers"
                            :key="index"
                          >
                            <td
                              class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                            >
                              <p class="text-gray-900 whitespace-no-wrap">
                                {{ item.site.brandName }}
                              </p>
                            </td>
                            <td
                              class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                            >
                              <p class="text-gray-900 whitespace-no-wrap">
                                {{ item.site.currency.abbreviation }} -
                                {{ item.site.currency.symbol }}
                              </p>
                            </td>
                            <td
                              class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                            >
                              <p class="text-gray-900 whitespace-no-wrap">
                                {{ item.userRoleType.name }}
                              </p>
                            </td>
                            <td
                              class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                            >
                              <button
                                class="py-2 px-4 text-center bg-green-600 rounded-md w-40 text-white text-sm hover:bg-gray-800"
                                type="button"
                                @click="
                                  handleChange(item.site, item.userRoleType.userRolePermissions)
                                "
                              >
                                Select Site
                              </button>
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
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../../router";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import Header from "../../components/Header.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    Header,
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    user: {},
    userDetail: {},
    selectedSite: null,
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.selectedSite = this.user.user.selectedSite;
    this.$store.dispatch("users/getSites", { userId: this.user.user.userId });
  },
  watch: {
    "$store.state.users.userDetail": function () {
      this.userDetail = this.$store.state.users.userDetail.userDetail;
      if (this.userDetail && this.selectedSite) {
        this.getSelected(this.selectedSite);
      }
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.users.userDetail.userDetail) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Home",
          name: "Dashboard",
          params: null,
        },
      ];
    },
    getSelected: function (selectedSite) {
      this.userDetail.siteUsers.forEach((site) => {
        if (site.site.siteId === selectedSite.siteId) {
          site.isSelected = true;
        } else {
          site.isSelected = false;
        }
      });
    },
    handleChange: function (site, permissions) {
      this.user.user.selectedSite = this.selectedSite = site;
      this.user.user.permissions = permissions
      if (this.selectedSite) {
        this.getSelected(this.selectedSite);
        localStorage.setItem("user", JSON.stringify(this.user));
        router.push(`/`);
      }
    },
  },
});
</script>