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
  </ul>
  <hr v-if="machines.length > 0" />
  <a type="button" class="btn btn-primary" @click="takeCheckboxes()"
    >SHOW MESSAGE</a
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
        ip: [],
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
      this.machines = data;
    },
    // метод для Post запроса на сервер, прнимает json
    command(payload) {
      const path = "http://192.168.100.100/terminal/markstation/send_command";
      axios.post(path, payload).then((res) => {
        console.log(res.data);
        this.listToSetting["ip"].length > 0
          ? (this.showMessage = true)
          : (this.showMessage = false);
        this.message = res.data;
      });
    },
    // метод для отлавливания чекбоксов
    takeCheckboxes() {
      this.listToSetting["ip"] = [];
      for (let i = 0; i < this.checkedMachines.length; i++) {
        if (this.checkedMachines[i] === true) {
          this.listToSetting["ip"].push(this.machines[i]["main"]["ip"]);
        }
      }
      this.command(JSON.stringify(this.listToSetting));
    },
  },
  created() {
    this.getIds();
  },
};
</script>
