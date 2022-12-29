<template>
  <h1 class="hello" style="margin-top: -80px">Управление</h1>
  <a
    type="button"
    id="SelectAllButton"
    class="btn btn-secondary"
    @click="checkboxesGetTrue()"
    >Выделить всё</a
  >
  <hr />
  <ul class="input-group col-sm-9">
    <li
      class="nostyle checkboxesManage"
      v-for="(item, index) in machines"
      v-bind:key="index"
    >
      <input
        type="checkbox"
        :id="machines[index]['main']['ip']"
        :name="machines[index]['main']['id']"
        :value="checkedMachines[index]"
        v-model="checkedMachines[index]"
      />
      &nbsp;
      <a
        target="_blank"
        :href="
          'http://' +
          machines[index]['main']['ip'] +
          ':8090/line/static_files/html/markirovka/index.html'
        "
      >
        {{ machines[index]["main"]["id"] }}
      </a>
    </li>
  </ul>
  <hr v-if="machines.length > 0" />
  <a
    type="button"
    class="btn btn-primary"
    style="margin: 5px"
    @click="showMesButton()"
    >SHOW MESSAGE</a
  >
  <a
    type="button"
    class="btn btn-primary"
    style="margin: 5px"
    @click="pgStatReplication()"
    >Отставание репликации</a
  >
  <br />
  <div class="row" id="input_row" style="max-width: 80%; margin: 5px">
    <div class="col-12">
      <input
        type="text"
        class="input-group"
        id="input-field"
        placeholder="Введите команду для запуска"
        style="font-size: 20px"
      />
    </div>
    <div class="col-6 col-lg-2 col-md-3 col-sm-6">
      <a type="button" class="btn btn-primary" @click="customCommand"
        >Запустить</a
      >
    </div>
    <div class="col-6 col-lg-2 col-md-3 col-sm-6">
      <a type="button" class="btn btn-danger" @click="eraseInputCommand"
        >Очистить</a
      >
    </div>
  </div>
  <br />
  <a class="btn btn-warning" style="margin: 5px" @click="resetStatistics"
    >Сброс статистики по линиям</a
  >
  <a
    style="text-decoration: none"
    class="status redText"
    v-if="showStatus"
    :class="{ greenText: status === 'ok' }"
  >
    {{ status }}
  </a>
  <br />
  <a
    style="margin: 5px"
    href="http://192.168.100.100/terminal/markstation/get_all_stat"
    >Статистика по станциям</a
  >
  <a
    style="margin: 5px"
    href="http://192.168.100.100/terminal/markstation/get_product_list"
    >Коды и наименования продуктов</a
  >
  <br />
  <app-spinner v-if="loadAlerts" />
  <template v-if="showMessage">
    <br />
    <alert
      v-for="(item, index) in message"
      :key="index"
      :message="
        'Ответ от ' +
        machineNames[
          machineNames
            .map((x) => x.ip_address)
            .indexOf(String(message[index]['ip']), 0)
        ].station_name +
        ' (' +
        message[index]['ip'] +
        ') = ' +
        message[index]['message']
      "
    ></alert>
  </template>
  <br />
  <div class="accordion" id="accordionPOST">
    <div class="accordion-item">
      <h2 class="accordion-header" id="POST_Header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="false"
          aria-controls="collapseOne"
        >
          Здесь будет POST-запрос
        </button>
      </h2>
      <div
        id="collapseOne"
        class="accordion-collapse collapse"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body">
          <form>
            <div class="row">
              <div class="col-auto">
                <div class="row">
                  <label for="markstation_id2" class="visually-hidden"
                    >markstation_id</label
                  >
                  <input
                    type="text"
                    readonly
                    class="form-control-plaintext"
                    id="markstation_id2"
                    value="markstation_id&cod_gp"
                  />
                </div>
                <div class="row">
                  <label for="gen_all" class="visually-hidden"
                    >Произведено всего</label
                  >
                  <input
                    type="number"
                    class="form-control-plaintext"
                    id="gen_all"
                    value="gen_all"
                  />
                </div>
              </div>
              <div class="col-auto">
                <div class="row">
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="postedJSON['markstation_id']"
                  >
                    <option
                      v-for="(item, index) in by_line"
                      :key="index"
                      :value="index"
                    >
                      {{ index.split("'")[1] + " - " + index.split("'")[3] }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col" style="background-color: #42b983">
                <pre v-html="JSON.stringify(postedJSON, null, 2)"></pre>
              </div>
            </div>
            <br />
            <button class="btn btn-primary">Отправить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Alert from "@/components/Alert";
import axios from "axios";
import AppSpinner from "@/components/AppSpinner";
import { ref } from "vue";

const loadAlerts = ref(false);
let postedJSON = {
  markstation_id: "",
  source_date: "2022-10-31",
  good_codes: 0,
  defect_codes: 0,
  total_codes: 0,
  duplicates_codes: 0,
  current_gtin: "4602547000176",
  current_cod_gp: "",
  current_batch_date: "2022-11-01",
  plc_state: {
    alarm_no_scanner: "1",
    time_imp_upakovki: "0",
    scaner_noread_counter: "0",
    scaner_trigger_counter: "1",
    count_no_zapusk_scaner: "0",
    count_no_trans_metka: "0",
    count_brak_no_zazor: "0",
    time_imp_upakovki_2: "0",
    scaner_noread_counter_2: "0",
    scaner_trigger_counter_2: "0",
    count_no_zapusk_scaner_2: "0",
    count_no_trans_metka_2: "0",
    count_brak_no_zazor_2: "0",
    machine_status: "1",
    message_from_plc: "10:40:12;OK                              ",
  },
};

// eslint-disable-next-line no-unused-vars
const byLine = "http://192.168.100.100:8021/by_line";
// eslint-disable-next-line no-unused-vars
const byProduct = "http://192.168.100.100:8021/by_product";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "manage",
  data() {
    return {
      machines: [],
      by_line: [],
      machineNames: [],
      checkedMachines: [],
      listToSetting: {
        ip: [],
        command: null,
      },
      message: [],
      showMessage: false,
      status: [],
      showStatus: false,
      loadAlerts,
      postedJSON,
    };
  },
  components: {
    alert: Alert,
    AppSpinner: AppSpinner,
  },
  methods: {
    // собираем данные в переменную machines
    // собираем словарь ip:id
    async getIds() {
      const f = await fetch(
        "http://192.168.100.100/terminal/markstation/get_all_stat"
      );
      const data = await f.json();
      this.machines = data;
      for (let i = 0; i < this.machines.length; i++) {
        this.machineNames.push({
          ip_address: this.machines[i]["main"]["ip"],
          station_name: this.machines[i]["main"]["id"],
        });
      }
      const d = await fetch("http://192.168.100.100:8021/by_line");
      const data_by_line = await d.json();
      this.by_line = data_by_line;
    },
    // метод для отлавливания чекбоксов
    takeCheckboxes() {
      this.listToSetting["ip"] = [];
      for (let i = 0; i < this.machines.length; i++) {
        if (this.checkedMachines[i] === true) {
          this.listToSetting["ip"].push(this.machines[i]["main"]["ip"]);
        }
      }
      // ОТПРАВЛЯЕМ ЗАПРОС
      this.command(JSON.stringify(this.listToSetting));
    },
    // метод для Post запроса на сервер, прнимает json
    command(payload) {
      loadAlerts.value = true;
      const path = "http://192.168.100.100/terminal/markstation/send_command";
      axios.post(path, payload).then((res) => {
        console.log(res.data);
        this.listToSetting["ip"].length > 0
          ? (this.showMessage = true)
          : (this.showMessage = false);
        if (res.data.status === "error") {
          this.message[0] = res.data.message;
        } else {
          this.message = res.data;
        }
        //console.log("this.message " + this.message);
        //console.log("this.showMessage " + this.showMessage);
        //console.log("this.listToSetting[ip] " + this.listToSetting["ip"]);
      });
      loadAlerts.value = false;
    },
    checkboxesGetTrue() {
      let checkedMachines = [];
      let sel_but = document.getElementById("SelectAllButton");
      if (this.checkedMachines[29] === true) {
        for (let i = 0; i < 30; i++) {
          checkedMachines.push(false);
        }
        this.checkedMachines = checkedMachines;
        //console.log(this.checkedMachines);
        sel_but.innerText = "Выделить всё";
      } else {
        for (let i = 0; i < 30; i++) {
          checkedMachines.push(true);
        }
        this.checkedMachines = checkedMachines;
        //console.log(this.checkedMachines);
        sel_but.innerText = "Снять всё";
      }
    },
    showMesButton() {
      this.listToSetting["command"] =
        "cat /opt/markirovka_on_line-master/settings.conf|grep id";
      this.takeCheckboxes();
    },
    pgStatReplication() {
      this.listToSetting["command"] =
        "psql --csv -U postgres -d molzavod -c'select sent_lsn - replay_lsn as replication_delay from pg_stat_replication';";
      this.takeCheckboxes();
    },
    customCommand() {
      let inputCommand = document.getElementById("input-field");
      this.listToSetting["command"] = String(inputCommand.value);
      this.takeCheckboxes();
    },
    eraseInputCommand() {
      let inputCommand = document.getElementById("input-field");
      inputCommand.value = "";
      this.showMessage = false;
    },
    resetStatistics() {
      const path = "http://192.168.100.100/terminal/markstation/reset_stat";
      axios.get(path).then((res) => {
        this.status = String(res.data);
        this.showStatus = true;
        setTimeout(() => {
          this.showStatus = false;
        }, 5000);
        let intervalId = setInterval(this.getIds, 10000);
        setTimeout(() => {
          //console.log("interval cleared");
          clearInterval(intervalId);
        }, 61000);
      });
    },
  },
  created() {
    this.getIds();
  },
};
</script>
