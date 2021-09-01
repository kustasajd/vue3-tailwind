<template>
  <div class="h-full">
    <div>
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Reports</h3>
      </div>
      <div class="mt-4 mb-3">
        <div class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4">
          <div class="mb-2">
            <router-link
              :to="{
                name: 'Report1',
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >Monthly Management Report
            </router-link>
          </div>
          <div class="mb-2">
            <router-link
              :to="{
                name: 'Report2',
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >End of Month Snapshot
            </router-link>
          </div>
          <div class="mb-2">
            <router-link
              :to="{
                name: 'Report3'
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >Revenue Summary
            </router-link>
          </div>
          <div class="mb-2">
            <router-link
              :to="{
                name: 'Report4'
              }"
              class="text-indigo-600 text-lg hover:text-indigo-900 mr-4"
              >Site Property Report
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
