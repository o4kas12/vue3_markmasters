<template>
  <strong>В разработке</strong>
  <div>
    <div>
      <vue-speedometer
        :maxSegmentLabels="0"
        :segments="75"
        textColor="${textColor}"
        :value="33"
        :maxValue="50"
      />
    </div>
  </div>
</template>

<script>
import VueSpeedometer from "vue-speedometer";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "history.vue",
  components: { VueSpeedometer },
  template: `<vue-speedometer />`,
};
</script>

<style scoped></style>
