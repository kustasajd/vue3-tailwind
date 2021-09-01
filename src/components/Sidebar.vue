<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      @click="isOpen = false"
      class="fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden"
    ></div>
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-akara-dark overflow-y-auto lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
          <div class="block overflow-hidden">
            <img class="w-auto px-5" src="/logo-akara.png" />
          </div>

      </div>

      <nav class="mt-10">
        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/"
        >
          <span class="material-icons">dashboard</span>
          <span class="mx-4">Dashboard</span>
        </router-link>
        <router-link
          v-if="hasPermission('akara admin')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'AkaraAdmin' ? activeClass : inactiveClass]"
          to="/akara-admin"
        >
          <span class="material-icons">admin_panel_settings</span>
          <span class="mx-4">Akara Admin</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('user view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Users' ? activeClass : inactiveClass]"
          :to="{
            name: 'Users',
            params: { siteId: user.selectedSite.siteId },
          }"
        >
          <span class="material-icons">people_alt</span>
          <span class="mx-4">Users</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('client view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Clients' ? activeClass : inactiveClass]"
          :to="{
            name: 'Clients',
            params: { siteId: user.selectedSite.siteId },
          }"
        >
          <span class="material-icons">groups</span>
          <span class="mx-4">Clients</span>
        </router-link>        
        <router-link
          v-if="user && user.selectedSite && hasPermission('charge view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Charges' ? activeClass : inactiveClass]"
          :to="{
            name: 'Charges',
            params: { siteId: user.selectedSite.siteId },
          }"
        >
          <span class="material-icons">price_change</span>
          <span class="mx-4">Charge Register</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('invoice view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Invoices' ? activeClass : inactiveClass]"
          :to="{
            name: 'Invoices',
            params: { siteId: user.selectedSite.siteId },
          }"
        >
          <span class="material-icons">receipt</span>
          <span class="mx-4">Invoices</span>
        </router-link>
        <router-link
          v-if="hasPermission('payment view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Payments' ? activeClass : inactiveClass]"
          to="/payments"
        >
          <span class="material-icons">paid</span>
          <span class="mx-4">Payments</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('zone view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Zones' ? activeClass : inactiveClass]"
          :to="{
            name: 'Zones',
            params: { siteId: user.selectedSite.siteId },
          }"
        >
          <span class="material-icons">room_preferences</span>
          <span class="mx-4">Zones</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('floorplan view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Floorplans' ? activeClass : inactiveClass]"
          :to="{
            name: 'Floorplans',
            params: null,
          }"
        >
          <span class="material-icons">view_module</span>
          <span class="mx-4">Floorplans</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('room reservation view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'RoomReservations' ? activeClass : inactiveClass]"
          :to="{
            name: 'RoomReservations',
            params: null,
          }"
        >
          <span class="material-icons">book_online</span>
          <span class="mx-4">Room Reservation</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('licence view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Licences' ? activeClass : inactiveClass]"
          to="/licences"
        >
          <span class="material-icons">history_edu</span>
          <span class="mx-4">Licences</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('licence-template view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'LicenceTemplates' ? activeClass : inactiveClass]"
          :to="{
            name: 'LicenceTemplates',
            params: { siteId: user.selectedSite.siteId },
          }"
        >
          <span class="material-icons">history_edu</span>
          <span class="mx-4">Licence Templates</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('site product view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'SiteProducts' ? activeClass : inactiveClass]"
          :to="{
            name: 'SiteProducts',
            params: { siteId: user.selectedSite.siteId },
          }"
        >
          <span class="material-icons">inventory_2</span>
          <span class="mx-4">Site Products</span>
        </router-link>
        <router-link
          v-if="user && user.selectedSite && hasPermission('report view')"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Reports' ? activeClass : inactiveClass]"
          :to="{
            name: 'Reports',
            params: null,
          }"
        >
          <span class="material-icons">summarize</span>
          <span class="mx-4">Reports</span>
        </router-link>        
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";

export default defineComponent({
  setup() {
    const { isOpen } = useSidebar();
    const activeClass = ref(
      "bg-gray-600 bg-opacity-25 text-akara-orange border-akara-orange hover:text-akara-orange"
    );
    const inactiveClass = ref(
      "border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-akara-yellow"
    );
    const user = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).user : null;
    return {
      isOpen,
      activeClass,
      inactiveClass,
      user,
    };
  },
  methods: {
    hasPermission: function(name) {
      if (this.user && this.user.permissions && this.user.permissions.length>0) {
        let data = this.user.permissions.filter(permission => {
          return permission.permission.name === name
        });
        if (data.length>0) 
          {return true} 
        else 
          {return false}
      } else {
        return false
      }
      
    }
  }
});
</script>
