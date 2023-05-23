<template style="margin-top: 50px">
  <div aria-live="polite" aria-atomic="true" class="toast-alerts">
    <div class="toast-container">
      <div
        class="toast bg-light"
        id="toastLive"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">Alert</strong>
          <small>just now</small>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body bg-info">
          Hello, world! This is a toast message.
        </div>
      </div>
    </div>
  </div>
  <div class="card-group" id="dashboard-cards">
    <div
      id="customCardDashboard"
      class="card"
      v-for="(item, index) in machines"
      :key="index"
    >
      <router-link
        style="text-decoration: none; color: inherit"
        :to="'/?station=' + index"
      >
        <div
          class="card-body dashboardCard-body"
          :class="{
            greenClass: machineState[index] === 'greenClass',
            redClass: machineState[index] === 'redClass',
            greyClass: machineState[index] === 'greyClass',
          }"
        >
          <vue-speedometer
            class="inner-card"
            :maxSegmentLabels="0"
            :segments="5"
            :needleHeightRatio="0.6"
            :value="machinesProdValue[index]"
            :maxValue="machinesMaxProdValue[index]"
            :width="100"
            :height="60"
            :ringWidth="30"
            data-html="true"
            :title="
              'Скорость ' +
              machinesProdValue[index] +
              ' из ' +
              machinesMaxProdValue[index]
            "
          />
          <h5 class="card-title">{{ machines[index]["main"]["id"] }}</h5>
          <p class="card-text dashboard-card-text">
            {{
              productList[
                productList
                  .map((x) => x.cod_gp)
                  .indexOf(String(machines[index]["main"]["current_cod_gp"]), 0)
              ].name_gp.split("(")[0]
            }}
          </p>
          <strong
            :title="
              String(machines[index]['plc_state']['message_from_plc']).split(
                ';'
              )[0]
            "
            class="AccordionHeaderState"
            >{{
              String(machines[index]["plc_state"]["message_from_plc"]).split(
                ";"
              )[1]
            }}</strong
          >
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VueSpeedometer from "vue-speedometer";
import axios from "axios";
import { Toast } from "bootstrap/dist/js/bootstrap.esm.js";
import { onUnmounted } from "vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "dashboard",
  data() {
    onUnmounted(() => {
      console.log("dashboard unmounted");
      clearInterval(this.interValue);
    });
    return {
      machineErrors: [],
      machines: [],
      checkedMachines: [],
      checkedZone: [],
      productList: [],
      machineState: [],
      interValue: null,
      machinesMaxProdValue: [],
      machinesProdValue: [],
    };
  },
  components: {
    VueSpeedometer,
  },
  methods: {
    async getIds() {
      const f = await fetch(
        "http://192.168.100.100/terminal/markstation/get_all_stat"
      );
      const data = await f.json();
      //console.log(data);
      for (let i in data) {
        if (
          data[i]["main"]["id"] === "A9-99" ||
          data[i]["main"]["id"] === "A9-98"
        ) {
          data.splice(i);
        }
      }
      this.machines = data;
      let machineState = [];
      let machinesMaxProdValue = [];
      let machinesProdValue = [];
      for (let i = 0; i < this.machines.length; i++) {
        let y = null;
        if (data[i]["options"]["last_seen_timeout"] > 90) {
          y = "greyClass";
        } else if (data[i]["plc_state"]["machine_status"] === "1") {
          y = "greenClass";
        } else {
          y = "redClass";
        }
        machineState.push(String(y));
        machinesMaxProdValue.push(
          this.machines[i]["options"]["max_items_per_minute"]
        );
        machinesProdValue.push(this.machines[i]["options"]["items_per_minute"]);
      }
      //console.log("machineState = " + machineState);
      //console.log("machineState");
      this.machineState = machineState;
      this.machinesMaxProdValue = machinesMaxProdValue;
      this.machinesProdValue = machinesProdValue;
      //console.log(this.machinesProdValue);
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
    startInterval() {
      if (this.interValue) return;
      this.interValue = setInterval(() => {
        this.getIds();
      }, 10000);
    },
    stopInterval() {
      clearInterval(this.interValue);
      this.interValue = null;
    },
    toastMethod() {
      const toastLive = document.getElementById("toastLive");
      const toast = new Toast(toastLive);
      toast.show();
      console.log("hello");
    },
  },
  created() {
    console.log("dashboard created");
    this.getProduct();
    this.checkedIds();
  },
  mounted() {
    this.startInterval();
  },
  beforeUnmount() {
    this.stopInterval();
  },
};
</script>
