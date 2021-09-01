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
          {{ user.fullName }}
        </h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'UpdateUser',
              params: { userId: $route.params.userId },
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Update User
          </router-link>
        </div>
      </div>
      <div class="mt-4 mb-3">
        <div
          class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
        >
          <div
            class="block h-24 w-24 rounded-full overflow-hidden shadow focus:outline-none mr-10"
          >
            <img
              class="h-full w-full object-contain"
              :src="
                user.profileImg
                  ? user.profileImg
                  : '../../src/assets/images/profile.png'
              "
              alt="Your avatar"
            />
          </div>
          <div>
            <div class="text-gray-900 font-bold text-lg mb-2">Full Name</div>
            <p class="text-gray-700 text-base mb-4">
              {{ user.fullName }}
            </p>
            <div class="text-gray-900 font-bold text-lg mb-2">Email</div>
            <p class="text-gray-700 text-base">
              {{ user.email }}
            </p>
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
    user: {},
    siteId: null
  }),
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.$store.dispatch("users/getById", { id: this.$route.params.userId });
  },
  watch: {
    "$store.state.users.user": function () {
      this.user = this.$store.state.users.user.user;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.users.user.user) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `${this.user.fullName} | ${this.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Users',
          name: 'Users',
          params: { siteId: this.siteId }
        },
        {
          index: 2,
          title: this.user.fullName,
          name: 'UserDetail',
          params: {
            userId: this.user.userId,
          }
        },
      ]
    },
  },
});
</script>
