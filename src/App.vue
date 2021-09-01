<template>
  <component :is="layout">
    <metainfo>
      <template v-slot:title="{ content }">{{ content }}</template>
    </metainfo>
    <router-view />
  </component>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const defaultLayout = "default";

export default defineComponent({
  setup() {
    const { currentRoute } = useRouter();
    const toast = useToast();
    const layout = computed(
      () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
    );

    return {
      layout,
      toast,
    };
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.$store.dispatch("alert/clear");
    },
    "$store.state.alert.message": function () {
      if (this.$store.state.alert.type === "alert-success") {
        this.toast.success(this.$store.state.alert.message);
      } else if (this.$store.state.alert.type === "alert-danger") {
        this.toast.error(this.$store.state.alert.message);
      }
    },
  },  
});
</script>
