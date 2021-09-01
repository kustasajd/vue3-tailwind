<template>
  <div class="flex justify-center items-center h-screen bg-gray-200 px-6">
      <span class="text-gray-700 font-semibold text-2xl text-center">Required permission: {{selected.length>0 ? selected[0].permissionName : ''}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import permissionNames from "../helpers/permissionNames"

export default defineComponent({
  props: ["isLoading", "hasPermission"],
  data: () => ({
    permissionName: null,
  }),
  created() {
    this.permissionName = this.$route.query.permissionName;
    this.selected = permissionNames.filter(item => { return item.routeName === this.permissionName })
  },
  methods: {},
});
</script>