<template>
  <div
    class="flex justify-center items-center h-full bg-gray-200 px-6"
    v-if="!isLoading && !hasPermission"
  >
    <span class="text-gray-700 font-semibold text-2xl text-center"
      >You do not have permission to view this page</span
    >
  </div>
</template>

<script>
export default {
  props: ["isLoading", "hasPermission"],
};
</script>