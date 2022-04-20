<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>
          <AccordionStations msg="Welcome to Your Vue.js App" />
        </h1>
        <hr />
        <br />
        <div class="accordion" id="accordionPanelsStayOpenExample">
          <div
            class="accordion-item"
            v-for="(item, index) in machines"
            v-bind:key="index"
          >
            <h2 class="accordion-header" :id="'panelsStayOpen-heading' + index">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#panelsStayOpen-collapse' + index"
                aria-expanded="false"
                :aria-controls="'panelsStayOpen-collapse' + index"
              >
                {{ machines[index]["main"]["id"] }}
                {{
                  productList[
                    productList
                      .map((x) => x.cod_gp)
                      .indexOf(
                        String(machines[index]["main"]["current_cod_gp"]),
                        0
                      )
                  ].name_gp
                }}
              </button>
            </h2>
            <ul
              :id="'panelsStayOpen-collapse' + index"
              class="accordion-collapse collapse"
              :aria-labelledby="'panelsStayOpen-heading' + index"
            >
              <li
                class="nostyle accordion-content1"
                v-for="(item, index) in machines[index]['main']"
                :key="index"
              >
                {{ index }} = {{ item }} <br />
              </li>
              <li
                class="nostyle accordion-content1"
                v-for="(item, index) in machines[index]['counters']"
                :key="index"
              >
                {{ index }} = {{ item }} <br />
              </li>
              <li
                class="nostyle accordion-content1"
                v-for="(item, index) in machines[index]['plc_state']"
                :key="index"
              >
                {{ index }} = {{ item }} <br />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AccordionStations from "@/components/AccordionStations.vue";
import axios from "axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Bottling",
  data() {
    return {
      machines: [],
      machine: null,
      checkedMachines: [],
      productList: [],
    };
  },
  components: {
    AccordionStations,
  },
  methods: {
    getIds(interval) {
      setInterval(async () => {
        const f = await fetch(
          "http://192.168.100.100/terminal/markstation/get_all_stat"
        );
        const data = await f.json();
        console.log(data);
        this.machines = data;
      }, interval);
      console.log("getIDs");
    },
    getProduct() {
      const path =
        "http://192.168.100.100/terminal/markstation/get_product_list";
      axios.get(path).then((res) => {
        this.productList = res.data;
        console.log(res.data);
      });
    },
  },
  created() {
    this.getProduct();
    this.getIds(3000);
  },
};
</script>
