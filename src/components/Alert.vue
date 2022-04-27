<template>
  <div style="position: relative">
    <div
      style="position: absolute; bottom: 0; right: 0"
      class="alert"
      :class="{ 'alert-danger': true, 'alert-success': false }"
      role="alert"
    >
      {{ message }}
      <br />
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Alert",
  props: ["message"],
};
</script>

<style scoped></style>
