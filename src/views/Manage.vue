<template>
  <alert :message="message" v-if="showMessage"></alert>
  <h1 class="hello">Управление</h1>
  <hr />
  <ul class="input-group col-sm-9">
    <li
      class="nostyle checkboxesAccordion"
      v-for="(item, index) in machines"
      v-bind:key="index"
    >
      <input
        type="checkbox"
        :id="'chkbx' + machines[index]['main']['ip']"
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
  <a type="button" class="btn btn-primary" @click="takeCheckboxes()"
    >IP TO CONSOLE</a
  >
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Alert from "@/components/Alert";
import axios from "axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "manage",
  data() {
    return {
      machines: [],
      checkedMachines: [],
      listToSetting: {
        ip: ["192.168.240.213"],
        command: "cat /opt/markirovka_on_line-master/settings.conf|grep id",
      },
      message: null,
      showMessage: false,
    };
  },
  components: {
    alert: Alert,
  },
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
    command() {
      const path = "http://192.168.100.100/terminal/markstation/send_command";
      axios.post(path, this.listToSetting).then((res) => {
        console.log(res.data);
        this.showMessage = true;
        this.message = res.data;
      });
    },
    takeCheckboxes() {
      for (let i = 0; i < this.checkedMachines.length; i++) {
        console.log(this.machines[i]["main"]["ip"]);
      }
    },
  },
  created() {
    this.getIds();
  },
};
</script>
