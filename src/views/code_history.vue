<template>
  <h1 class="hello" style="margin-top: -80px">История кода</h1>
  <br />
  <div class="row" id="input_row" style="max-width: 80%; margin: 5px">
    <div class="col-12">
      <input
        type="text"
        class="input-group"
        id="input-field"
        placeholder="Код сюда"
        style="font-size: 20px"
      />
    </div>
    <div class="col-6 col-lg-2 col-md-3 col-sm-6">
      <a type="button" class="btn btn-primary" @click="get_history"
        >Запустить</a
      >
    </div>
    <div class="col-6 col-lg-2 col-md-3 col-sm-6">
      <a type="button" class="btn btn-danger" @click="eraseInputCommand"
        >Очистить</a
      >
    </div>
    <div class="col-6 col-lg-2 col-md-3 col-sm-6">
      <a type="button" class="btn btn-danger" @click="get_bearer_token()"
        >Get_bearer_token</a
      >
    </div>
  </div>
  <br />
  <app-spinner v-if="loadAlerts" />
  <template v-if="showMessage">
    <br />
    <alert></alert>
  </template>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import AppSpinner from "@/components/AppSpinner";
import axios from "axios";
import { ref } from "vue";
import Alert from "@/components/Alert";

// eslint-disable-next-line no-unused-vars
const loadAlerts = ref(false);

export default {
  name: "code_history",
  data() {
    return {
      bearer_token: "",
      message: [],
      showMessage: false,
      loadAlerts,
    };
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    alert: Alert,
    // eslint-disable-next-line vue/no-unused-components
    AppSpinner: AppSpinner,
  },
  methods: {
    get_bearer_token() {
      loadAlerts.value = true;
      const path =
        "/api/request/marking/marking_line/MarkingSuz/get_token_api?session=2";
      axios
        .post(path)
        .then((res) => {
          this.bearer_token = res.data["token"];
          // console.log(this.bearer_token);
        })
        .finally(() => {
          loadAlerts.value = false;
        });
    },
    eraseInputCommand() {
      let inputCommand = document.getElementById("input-field");
      inputCommand.value = "";
      this.showMessage = false;
    },
    get_history() {
      loadAlerts.value = true;
      const path = "http://192.168.100.111/getCodeHistory";
      let code = String(document.getElementById("input-field").value);
      console.log("CIS код:", code);

      // Проверьте, что токен существует и его формат
      if (!this.bearer_token) {
        console.error("Токен отсутствует!");
        this.get_bearer_token();
        if (!this.bearer_token) {
          console.log("Ошибка токена");
          loadAlerts.value = false;
          return;
        }
      }

      // console.log("Bearer токен:", this.bearer_token);

      const config = {
        headers: {
          Authorization: `Bearer ${this.bearer_token}`,
        },
      };

      axios
        .post(path + "?cis=" + code, {}, config)
        .then((res) => {
          console.log("Ответ сервера:", res.data);
        })
        .catch((error) => {
          if (error.response) {
            console.error("Ошибка ответа от сервера:", error.response.data);
            console.error("Код ошибки:", error.response.status);
            console.error("Заголовки ошибки:", error.response.headers);
          } else if (error.request) {
            console.error(
              "Запрос был отправлен, но ответа не получено:",
              error.request
            );
          } else {
            console.error("Ошибка настройки запроса:", error.message);
          }
        })
        .finally(() => {
          loadAlerts.value = false;
        });
    },
  },
};
</script>

<style scoped></style>
