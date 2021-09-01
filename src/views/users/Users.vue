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
        <h3 class="text-gray-700 text-3xl font-semibold">Users</h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'AddUser',
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Add New User
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
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Photo
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Roles
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, index) in users" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img
                            class="w-full h-full rounded-full object-cover"
                            :src="
                              u.profileImg
                                ? u.profileImg
                                : '../../src/assets/images/profile.png'
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
                        {{ u.fullName }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ u.email }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <span class="text-gray-900 whitespace-no-wrap">
                        <div v-for="(role, i) in u.roles" :key="i" class="mr-2">
                          {{ role }}
                        </div>
                      </span>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'UserDetail',
                          params: { userId: u.userId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
                      </router-link>
                      <router-link
                        :to="{
                          name: 'UpdateUser',
                          params: { userId: u.userId },
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
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission } from "../../helpers/index"

export default defineComponent({
  components: {
    Breadcrumb,
    NoPermission
  },
  setup() {
    return { getPermission }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    users: [],
    siteId: null,
    selSiteId: null,
    hasPermission: false
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/getUserById", { id: this.siteId });
    }
  },
  watch: {
    "$store.state.sites.siteUsers.siteUsers": function () {
      this.siteUsers = this.$store.state.sites.siteUsers.siteUsers;
      this.users = [];
      if (this.siteUsers) {
        this.siteUsers.forEach((siteUser) => {
          if (siteUser.user) {
            siteUser.user.roles = [siteUser.userRoleType.name];
            this.users.push(siteUser.user);
          }
        });
        this.isLoading = false;
      }
    },
  },
  methods: {
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Users',
          name: 'Users',
          params: { siteId: this.selSiteId }
        },
      ]
    },
  },
});
</script>