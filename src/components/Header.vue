<template>
  <header
    class="flex justify-between items-center py-4 px-6 bg-white border-b-4 shadow-lg border-akara-yellow"
  >
    <div class="flex items-center">
      <button
        @click="isOpen = true"
        class="text-gray-500 focus:outline-none lg:hidden mr-4 lg:mr-0"
        v-show="$route.name!=='SiteSelect'"
      >
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div class="flex items-center" v-show="$route.name!=='SiteSelect'">
        <div class="block -my-16 border p-1 -mx-2 overflow-hidden rounded object-contain" v-if="user && user.user && user.user.selectedSite">
          <img
            class="w-auto h-8 object-contain"
            :src="
              user.user.selectedSite.logoUrl
                ? user.user.selectedSite.logoUrl
                : '../../src/assets/images/Default-Logo.svg'
            "
          />
        </div>
        <div class="flex mx-4 font-medium max-sm:hidden" v-if="user && user.user && user.user.selectedSite">
          {{user.user.selectedSite.brandName}}
        </div>
        <div class="text-center" v-if="user && user.user && user.user.siteUsers && user.user.siteUsers.length !== 1">
          <router-link
            :to="{
              name: 'SiteSelect',
            }"
            class="py-2 px-2 text-center bg-gray-600 rounded-md text-white hover:text-white text-sm hover:bg-gray-800"
            >Change Site
          </router-link>
        </div>
      </div>
    </div>

    <div class="flex items-center">
      <div class="bg-red-600 text-white px-2 py-1 rounded-md text-sm animate-pulse border-dashed border-2 border-red-300" v-if="this.$store.state.account.user && this.$store.state.account.user.isTestDB === true"><span class="material-icons align-middle pr-2">cloud_off</span>CONNECTED TO STAGING DB</div>
      <span
        @click="dropdownOpen = !dropdownOpen"
        class="flex mx-4 font-medium"
        v-if="
          this.$store.state.account.user && this.$store.state.account.user.user
        "
      >
        {{ this.$store.state.account.user.user.fullName }}
      </span>

      <div class="relative">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none"
        >
          <img
            class="h-full w-full object-contain"
            v-if="
              this.$store.state.account.user &&
              this.$store.state.account.user.user
            "
            :src="
              this.$store.state.account.user.user.profileImg
                ? this.$store.state.account.user.user.profileImg
                : '../../src/assets/images/profile.png'
            "
            alt="Your avatar"
          />
        </button>

        <div
          v-show="dropdownOpen"
          @click="dropdownOpen = false"
          class="fixed inset-0 h-full w-full z-10"
        ></div>

        <div
          v-show="dropdownOpen"
          class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20"
        >
          <a
            href="/profile"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
            >Profile</a
          >
          <router-link
            to="/login"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
            >Log out</router-link
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";

export default defineComponent({
  setup(_, { emit }) {
    const dropdownOpen = ref(false);
    const { isOpen } = useSidebar();
    const user = JSON.parse(localStorage.getItem("user"))
    return {
      isOpen,
      dropdownOpen,
      user
    };
  },
});
</script>
