<template>
  <div class="app-spinner">
    <div class="app-spinner-overlay" />
    <div class="app-spinner-icon" />
  </div>
</template>

<script>
export default {
  name: "AppSpinner",
  props: {
    fullscreen: Boolean,
  },
};
</script>

<style scoped></style>
