<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 innerContent" style="margin-top: -75px">
        <div class="row">
          <h1 id="titleWithDate">Логи</h1>
        </div>
        <br />
        <div class="row">
          <select id="selected_day" v-model="selected_day" class="form-select">
            <option value="0" selected="selected">Сегодня</option>
            <option value="1">1 день назад</option>
            <option value="2">2 дня назад</option>
          </select>
          <select id="station_ip" v-model="station_ip" class="form-select">
            <option value="192.168.240.213" selected="selected">A1-99</option>
            <option value="192.168.240.213">A1-98</option>
            <option value="192.168.240.213">A1-97</option>
          </select>
          <br />
          <div>
            <button class="btn btn-primary" @click="l">Показать</button>
          </div>
        </div>
        <br />
        <app-spinner v-if="loadLogs" />
        <div class="container" id="textLogs" style="background-color: #42b983">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSpinner from "@/components/AppSpinner";
import { ref } from "vue";

// eslint-disable-next-line no-unused-vars
const loadLogs = ref(false);

export default {
  name: "logs-page",
  components: {
    AppSpinner: AppSpinner,
  },
  data() {
    return {
      loadLogs,
      selected_day: 0,
      station_ip: "192.168.240.213",
      message: [],
      errorMessage: "",
      postId: [],
    };
  },
  methods: {
    async getLogs() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip: this.station_ip,
          days_ago: this.selected_day,
        }),
      };
      fetch(
        "http://192.168.100.100/terminal/markstation/get_events_log",
        requestOptions
      )
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          this.postId = data.id;
          console.log(this.postId);
          this.message = data.id;
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
  },
  mounted() {
    console.log("mounted");
    this.getLogs();
  },
};
</script>

<style scoped></style>
