<template>
  <div class="card" style="width: 15rem">
    <div class="card-body">
      <vue-speedometer
        :maxSegmentLabels="0"
        :segments="5"
        :needleHeightRatio="0.6"
        :value="30"
        :maxValue="100"
        :width="100"
        :height="60"
        :ringWidth="30"
      />
      <h5 class="card-title">A1-01</h5>
      <p class="card-text">Молоко пастер.2,5% ТФА 0,9л (12)</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>
</template>

<script>
import VueSpeedometer from "vue-speedometer";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "history.vue",
  components: {
    VueSpeedometer,
  },
};
</script>

<style scoped></style>
