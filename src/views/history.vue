<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>
          <AccordionStations msg="Welcome to Your Vue.js App" />
        </h1>
        <hr />
        <button @click="getIds()">GET PRODUCTS</button>
        <hr />
        <br />
        <div class="accordion" id="accordionPanelsStayOpenExample">
          <div
            class="accordion-item"
            :id="'item' + index"
            v-for="(item, index) in machines"
            v-bind:key="index"
          >
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
              <button
                class="accordion-button"
                type="button"
                :data-bs-toggle="'collapse' + index"
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
              >
                {{ index }}
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingOne"
            >
              <div class="accordion-body">
                {{ machines[index] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AccordionStations from "@/components/AccordionStations.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Bottling",
  data() {
    return {
      machines: [],
      checkedMachines: [],
    };
  },
  components: {
    AccordionStations,
  },
  methods: {
    getIds() {
      const path = "http://192.168.100.100/terminal/markstation/get_all_stat";
      setInterval(async () => {
        const f = await fetch(path);
        const data = await f.json();
        this.machines = data;
      }, 3000);
      console.log("getIDs");
    },
  },
};
</script>
