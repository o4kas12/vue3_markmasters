<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <h1>
          <AccordionStations msg="Welcome to Your Vue.js App" />
        </h1>
        <!-- <alert :message="message" v-if="showMessage"></alert> /-->
        <p style="text-align: left">
          <a
            class="btn btn-primary"
            data-bs-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Фильтр
          </a>
        </p>
        <div class="collapse" id="collapseExample">
          <div class="card card-body">
            <ul class="input-group col-sm-9">
              <li
                class="nostyle checkboxesAccordion"
                v-for="(item, index) in machines"
                v-bind:key="index"
              >
                <input
                  type="checkbox"
                  checked="checked"
                  :id="'chkbx' + machines[index]['main']['id']"
                  :value="checkedMachines[index]"
                  v-model="checkedMachines[index]"
                />
                {{ machines[index]["main"]["id"] }}
              </li>
              {{
                checkedMachines
              }}
            </ul>
            <hr v-if="machines.length > 0" />
            <ul class="input-group">
              <li
                class="nostyle checkboxesAccordion"
                v-for="index in 3"
                v-bind:key="index"
              >
                <input
                  type="checkbox"
                  checked="checked"
                  :value="checkedZone[index]"
                  v-model="checkedZone[index]"
                />
                ЦЕХ
                {{ index }}
              </li>
              {{
                checkedZone
              }}
            </ul>
          </div>
        </div>
        <div class="accordion" id="accordionPanelsStayOpenExample">
          <div
            class="accordion-item"
            :id="machines[index]['main']['id']"
            v-for="(item, index) in machines"
            v-bind:key="index"
          >
            <h2 class="accordion-header" :id="machines[index]['main']['id']">
              <button
                class="accordion-button collapsed"
                :class="{
                  greenClass: machineState[index] === 'greenClass',
                  redClass: machineState[index] === 'redClass',
                  classOne: machines[index]['main']['id'].includes('A1'),
                }"
                type="button"
                v-if="checkedMachines[index]"
                data-bs-toggle="collapse"
                :data-bs-target="'#panelsStayOpen-collapse' + index"
                aria-expanded="false"
                :aria-controls="'panelsStayOpen-collapse' + index"
              >
                <span style="width: inherit">
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
                  &nbsp;
                </span>
                <strong class="AccordionHeaderState">{{
                  String(
                    machines[index]["plc_state"]["message_from_plc"]
                  ).split(";")[1]
                }}</strong>
                &nbsp;
              </button>
            </h2>
            <div
              :id="'panelsStayOpen-collapse' + index"
              class="accordion-collapse collapse"
              :aria-labelledby="'panelsStayOpen-heading' + index"
            >
              <span class="accordion-body" v-if="checkedMachines[index]">
                <ul>
                  <li
                    class="nostyle accordion-content1"
                    v-for="(item, index) in machines[index]['main']"
                    :key="index"
                  >
                    {{ index }} = <strong>{{ item }}</strong> <br />
                  </li>
                  <li
                    class="nostyle accordion-content1"
                    v-for="(item, index) in machines[index]['counters']"
                    :key="index"
                  >
                    {{ index }} = <strong>{{ item }}</strong> <br />
                  </li>
                  <li
                    class="nostyle accordion-content1"
                    v-for="(item, index) in machines[index]['plc_state']"
                    :key="index"
                  >
                    {{ index }} = <strong>{{ item }}</strong> <br />
                  </li>
                </ul>
              </span>
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
// import Alert from "../components/Alert.vue";
import VueSpeedometer from "vue-speedometer";
import axios from "axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Bottling",
  props: ["intervalGetId"],
  data() {
    return {
      message: "",
      showMessage: false,
      machines: [],
      checkedMachines: [],
      checkedZone: [null, true, true, true],
      productList: [],
      machineState: [],
      machineNames: [],
    };
  },
  components: {
    AccordionStations,
    // eslint-disable-next-line vue/no-unused-components
    VueSpeedometer,
  },
  template: "<vue-speedometer value='333'/>",
  methods: {
    async getIds() {
      const f = await fetch(
        "http://192.168.100.100/terminal/markstation/get_all_stat"
      );
      const data = await f.json();
      //console.log(data);
      this.machines = data;
      let machineState = [];
      for (let i = 0; i < this.machines.length; i++) {
        let y = null;
        if (data[i]["plc_state"]["machine_status"] === "1") {
          y = "greenClass";
        } else {
          y = "redClass";
          this.showMessage = true;
          this.message =
            data[i]["main"]["id"] +
            " " +
            String(data[i]["plc_state"]["message_from_plc"]).split(";")[1];
        }
        machineState.push(String(y));
      }
      //console.log(machineState);
      console.log("machineState");
      this.machineState = machineState;
    },
    checkedIds() {
      // Auto checking the checkboxes
      for (let i = 0; i < 30; i++) {
        this.checkedMachines.push(true);
      }
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
    this.getIds();
    this.checkedIds();
  },
  mounted() {
    let intervalGetId = setInterval(async () => {
      await this.getIds();
    }, 10000);
    intervalGetId;
  },
  unmounted() {
    clearInterval(this.intervalGetId);
  },
};
</script>
