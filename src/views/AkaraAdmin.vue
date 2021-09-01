<template>
  <div class="h-full">
    <div>
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Akara Admin</h3>
      </div>
      <div class="mt-4 mb-3">
        <div class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4">
          <div class="mb-2">
            <router-link
              :to="{
                name: 'Permissions',
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >Permissions
            </router-link>
          </div>
          <div class="mb-2">
            <router-link
              :to="{
                name: 'Products',
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >Master Product List
            </router-link>
          </div>
          <div class="mb-2">
            <router-link
              :to="{
                name: 'Sites',
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >Site Management
            </router-link>
          </div>
          <div>
            <span class="italic text-lg text-gray-600">Licence Types</span>
            <router-link v-show="false"
              :to="{
                name: 'AkaraAdmin',
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >Licence Types
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({}),
  created() {},
});
</script>
