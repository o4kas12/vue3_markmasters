<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 innerContent" style="margin-top: -75px">
        <div class="row">
          <h1 id="titleWithDate">События</h1>
        </div>
        <br />
        <div class="row">
          <select
            @change="this.getLogs"
            id="selected_day"
            v-model="payload['days_ago']"
            class="form-select"
            style="width: 250px; margin-left: 10px"
          >
            <option value="0" selected="selected">Сегодня</option>
            <option value="1">1 день назад</option>
            <option value="2">2 дня назад</option>
            <option value="3">3 дня назад</option>
            <option value="4">4 дня назад</option>
            <option value="5">5 дней назад</option>
          </select>
          <select
            @change="this.getLogs"
            id="station_ip"
            v-model="payload['ip']"
            class="form-select"
            style="width: 250px; margin-left: 10px"
          >
            <option
              v-for="(item, index) in machines"
              :key="index"
              :value="machines[index]['main']['ip']"
            >
              {{ machines[index]["main"]["id"] }}
            </option>
          </select>
          <button
            class="btn btn-primary"
            style="width: 250px; margin-left: 10px"
            @click="this.getLogs"
          >
            Показать
          </button>
        </div>
        <br />
        <app-spinner v-if="loadLogs" />
        <div
          v-for="(item, index) in message"
          :key="index"
          class="container"
          id="textLogs"
          :title="message[index].split(';')[3]"
        >
          <div
            v-if="message[index].includes('start')"
            style="background-color: limegreen"
          >
            <strong
              >{{ message[index].split(";")[1].split("T")[0] + " " }}
              {{ message[index].split(";")[1].split("T")[1] + " " }}
            </strong>
            {{ message[index].split(";")[2] }}
          </div>
          <div
            v-else-if="message[index].includes('stop')"
            style="background-color: indianred"
          >
            <strong
              >{{ message[index].split(";")[1].split("T")[0] + " " }}
              {{ message[index].split(";")[1].split("T")[1] + " " }}
            </strong>
            {{ message[index].split(";")[2] }}
          </div>
          <div
            v-else-if="message[index].includes('reset')"
            style="background-color: yellow"
          >
            <strong
              >{{ message[index].split(";")[1].split("T")[0] + " " }}
              {{ message[index].split(";")[1].split("T")[1] + " " }}
            </strong>
            {{ message[index].split(";")[2] }}
          </div>
          <div
            v-else-if="message[index].includes('Дата производства')"
            style="background-color: lightpink"
          >
            <strong
              >{{ message[index].split(";")[1].split("T")[0] + " " }}
              {{ message[index].split(";")[1].split("T")[1] + " " }}
            </strong>
            {{ message[index].split(";")[2] }}
          </div>
          <div v-else style="background-color: lightcyan">
            <strong>{{ message[index].split(";")[1] }} </strong>
            {{ message[index].split(";")[2] }}
            <div v-if="message.length < 2">{{ message[index] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSpinner from "@/components/AppSpinner";
import { ref } from "vue";
import axios from "axios";

// eslint-disable-next-line no-unused-vars
const loadLogs = ref(false);

export default {
  name: "logs-page",
  components: {
    AppSpinner: AppSpinner,
  },
  data() {
    return {
      loadLogs, //spinner
      payload: {
        ip: "192.168.240.213",
        days_ago: 0,
      },
      message: "",
      machines: [],
    };
  },
  methods: {
    async getLogs() {
      loadLogs.value = true;
      this.payload["days_ago"] = parseInt(this.payload["days_ago"]);
      this.message = "";
      const path = "http://192.168.100.100/terminal/markstation/get_events_log";
      axios.post(path, JSON.stringify(this.payload)).then((res) => {
        console.log(JSON.stringify(this.payload));
        console.log(JSON.stringify(res.data));
        if (res.data["status"] === "error") {
          this.message = "0";
        } else if (res.data["message"] == "") {
          this.message = ["Пусто"];
        } else {
          this.message = res.data["message"];
        }
        loadLogs.value = false;
      });
    },
    async getMachines() {
      if (this.machines.length < 1) {
        loadLogs.value = true;
      }
      const f = await fetch(
        "http://192.168.100.100/terminal/markstation/get_all_stat"
      );
      this.machines = await f.json();
    },
  },
  created() {
    if (JSON.parse(localStorage.getItem("machines")).length > 1) {
      this.machines = JSON.parse(localStorage.getItem("machines"));
    } else {
      this.getMachines();
    }
  },
  mounted() {
    if (this.payload === "null") {
      return (this.payload = {
        ip: "192.168.240.213",
        days_ago: 0,
      });
    } else {
      this.payload = JSON.parse(localStorage.getItem("payload"));
    }
    if (this.message === "") {
      this.getLogs();
    }
  },
  beforeUnmount() {
    localStorage.setItem("payload", JSON.stringify(this.payload));
    localStorage.setItem("machines", JSON.stringify(this.machines));
    console.log(localStorage.getItem("payload"));
  },
};
</script>

<style scoped></style>
