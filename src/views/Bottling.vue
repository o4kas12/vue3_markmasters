<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12" style="margin-top: -75px">
        <div style="height: 50px; display: -webkit-box; margin: auto">
          <p style="text-align: left; margin: 4px 72px">
            <a
              class="btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapseID"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
              style="position: absolute"
            >
              Фильтр
            </a>
          </p>
          <h1 style="margin: 0 21px 0">
            <AccordionStations />
          </h1>
        </div>
        <div class="collapse" id="collapseID">
          <div class="card card-body">
            <!--
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
              </li>
              {{
                checkedMachines
              }}
            </ul>
            <hr v-if="machines.length > 0" />
            -->
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
              <li class="nostyle checkboxesAccordion">
                <input
                  type="checkbox"
                  checked="checked"
                  :value="checkedZone[9]"
                  v-model="checkedZone[9]"
                />
                TEST
              </li>
            </ul>
          </div>
        </div>
        <app-spinner v-if="loadAccordion" />
        <div class="accordion" id="accordionPanelsStayOpen">
          <div
            class="accordion-item"
            :id="machines[index]['main']['id']"
            v-for="(item, index) in machines"
            v-bind:key="index"
          >
            <h2
              class="accordion-header"
              :id="'header_' + machines[index]['main']['id']"
            >
              <button
                class="accordion-button collapsed"
                :class="{
                  greenClass: machineState[index] === 'greenClass',
                  redClass: machineState[index] === 'redClass',
                  greyClass: machineState[index] === 'greyClass',
                }"
                type="button"
                v-if="
                  //checkedMachines[index] ||
                  checkedZone[String(machines[index]['main']['id']).slice(1, 2)]
                "
                data-bs-toggle="collapse"
                :data-bs-target="'#panelsStayOpen-collapse' + index"
                aria-expanded="false"
                :aria-controls="'panelsStayOpen-collapse' + index"
              >
                <div class="itemsPerMinute">
                  {{ machinesProdValue[index] }}
                </div>
                <div class="speedometerDiv">
                  <vue-speedometer
                    :maxSegmentLabels="0"
                    :segments="5"
                    :needleHeightRatio="0.6"
                    :value="machinesProdValue[index]"
                    :maxValue="machinesMaxProdValue[index]"
                    :width="100"
                    :height="60"
                    :ringWidth="30"
                  />
                </div>

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
                <div class="speedometerDivInner">
                  <vue-speedometer
                    :maxSegmentLabels="0"
                    :segments="100"
                    :value="machinesProdValue[index]"
                    :maxValue="machinesMaxProdValue[index]"
                  />
                </div>
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
import VueSpeedometer from "vue-speedometer";
// import Alert from "../components/Alert.vue";
import AppSpinner from "@/components/AppSpinner";
import axios from "axios";
import { onUnmounted, ref } from "vue";

const loadAccordion = ref(false);

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Bottling",
  props: ["intervalGetId"],
  data() {
    onUnmounted(() => {
      console.log("bottling unmounted");
      clearInterval(this.interValue);
    });
    return {
      message: "",
      showMessage: false,
      machines: [],
      checkedMachines: [],
      checkedZone: [],
      productList: [],
      machineState: [],
      machineNames: [],
      interValue: null,
      machinesMaxProdValue: [],
      machinesProdValue: [],
      loadAccordion,
      openedStation: "",
      scrollToStation: "",
    };
  },
  components: {
    AccordionStations,
    VueSpeedometer,
    AppSpinner,
  },
  watch: {
    loadAccordion(newValue) {
      if (newValue === false) {
        //console.log("loadAccordion ready");
        setTimeout(() => this.getParamFromUrl(), 10);
      } else {
        //console.log("not ready");
      }
    },
  },
  methods: {
    async getIds() {
      if (this.machines.length < 1) {
        loadAccordion.value = true;
      }
      const f = await fetch(
        "http://192.168.100.100/terminal/markstation/get_all_stat"
      );
      const data = await f.json();
      //console.log(data);
      this.machines = data;
      let machineState = [];
      let machinesMaxProdValue = [];
      let machinesProdValue = [];
      try {
        for (let i = 0; i < this.machines.length; i++) {
          let y = null;
          if (data[i]["options"]["last_seen_timeout"] > 90) {
            y = "greyClass";
          } else if (data[i]["plc_state"]["machine_status"] === "1") {
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
          machinesMaxProdValue.push(
            this.machines[i]["options"]["max_items_per_minute"]
          );
          machinesProdValue.push(
            this.machines[i]["options"]["items_per_minute"]
          );
        }
      } catch (error) {
        console.log("Ошибка Bottling.vue 243 строка");
        console.log(error);
      }
      //console.log("machineState = " + machineState);
      //console.log("machineState");
      this.machineState = machineState;
      this.machinesMaxProdValue = machinesMaxProdValue;
      this.machinesProdValue = machinesProdValue;
      //console.log(this.machinesProdValue);
      if (loadAccordion.value === true) {
        loadAccordion.value = false;
      }
    },

    checkedIds() {
      // Auto checking the checkboxes
      for (let i = 0; i < 30; i++) {
        this.checkedMachines.push(true);
        this.checkedZone.push(true);
      }
    },
    getProduct() {
      const path =
        "http://192.168.100.100/terminal/markstation/get_product_list";
      axios.get(path).then((res) => {
        this.productList = res.data;
        console.log("getProduct");
        this.getIds();
      });
    },
    interVal() {
      if (this.interValue) return;
      const interValue = setInterval(() => {
        this.getIds();
      }, 10000);
      this.interValue = interValue;
    },
    getParamFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const station = urlParams.get("station");
      this.openedStation = "panelsStayOpen-collapse" + station;
      this.scrollToStation =
        "panelsStayOpen-collapse" + String(Number(station) - 1);
      try {
        if (station > 0) {
          document.getElementById(this.openedStation).classList.add("show");
          let someElem = document.getElementById(this.openedStation);
          let elementPosition = someElem.getBoundingClientRect().top;
          let element = elementPosition + window.pageYOffset - 45;
          window.scrollTo({ top: element, behavior: "smooth" });
        } else if (station == 0) {
          document.getElementById(this.openedStation).classList.add("show");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    console.log("bottling created");
    this.getProduct();
    this.checkedIds();
    this.interVal();
  },
};
</script>
