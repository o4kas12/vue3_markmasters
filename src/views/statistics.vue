<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 innerContent" style="margin-top: -75px">
        <div class="row">
          <h1 id="titleWithDate">Статистика</h1>
        </div>
        <app-spinner v-if="loadStat" />
        <br />
        <div class="row">
          <Datepicker class="datepicker" v-model="picked"></Datepicker>
          <div
            class="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
            id="buttonSwitch"
          >
            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="byLine"
              autocomplete="off"
              @click="getJson('http://10.10.3.18:8021/by_line', 0)"
              checked
            />
            <label class="btn btn-outline-primary" for="byLine"
              >По станциям</label
            >

            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="byProduct"
              autocomplete="off"
              @click="getJson('http://10.10.3.18:8021/by_product', 1)"
            />
            <label class="btn btn-outline-primary" for="byProduct"
              >По коду продукта</label
            >
          </div>
        </div>
        <table class="table" style="table-layout: auto" v-if="count != 0">
          <thead>
            <tr>
              <th v-if="switch1 == 0" scope="row">Станция</th>
              <th scope="col">Продукт</th>
              <th v-if="switch1 == 1" scope="col">Готовая</th>
              <th scope="col">Промаркировано</th>
              <th v-if="switch1 == 1" scope="col">Разница</th>
              <th scope="col">Отбраковано</th>
              <th scope="col">Дубли</th>
              <th scope="col">Сканер</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in mainList" :key="index">
              <th v-if="switch1 == 0" scope="row">{{ index.split("'")[1] }}</th>
              <td v-if="switch1 == 0">
                {{ index.split("'")[3] + " " + mainList[index]["name"] }}
              </td>
              <td v-else-if="switch1 == 1">
                {{ index + " " + mainList[index]["name"] }}
              </td>
              <td v-if="switch1 == 1" :id="'inputField' + index">
                <input
                  v-model="listOfReady[index]"
                  @input="inputListOfReady(index)"
                  type="number"
                />
              </td>
              <td :id="'goodMark' + index">{{ mainList[index]["good"] }}</td>
              <td v-if="switch1 == 1" :id="'differ' + index">
                {{ listOfDiff[index] }}
              </td>
              <td>{{ mainList[index]["bad"] }}</td>
              <td>{{ mainList[index]["duplicate"] }}</td>
              <td>{{ mainList[index]["remove"] }}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <h1 v-if="count == 0">Пусто, выберите другую дату</h1>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "vue3-datepicker";
import { ref } from "vue";
import AppSpinner from "@/components/AppSpinner";

const loadStat = ref(false);
const byLine = "http://10.10.3.18:8021/by_line";
// eslint-disable-next-line no-unused-vars
const byProduct = "http://10.10.3.18:8021/by_product";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "statistics.vue",
  components: {
    AppSpinner,
    Datepicker,
  },
  data() {
    const picked = new Date();
    const dateISO = "";
    return {
      picked,
      dateISO,
      loadStat,
      listOfReady: {},
      listOfGood: {},
      listOfDiff: {},
      count: 0,
      switch1: 0, // 0 - по станциям, 1 - по продукту
      mainList: {},
    };
  },
  watch: {
    picked(newValue) {
      newValue.setHours(newValue.getHours() + 10);
      let pickedISO = newValue.toISOString().slice(0, 10);
      this.dateISO = pickedISO;
      this.getJson(byLine, this.switch1);
      this.listOfReady = {};
      this.listOfDiff = {};
    },
  },
  methods: {
    async getJson(url, switcher) {
      loadStat.value = true;
      this.mainList = [];
      this.switch1 = switcher;
      let urlNew = byLine;
      if (this.switch1 == 1) {
        urlNew = byProduct;
      } else {
        urlNew = byLine;
      }
      //console.log(urlNew + this.addDate(this.dateISO));
      //console.log(this.switch1);
      const f = await fetch(urlNew + this.addDate(this.dateISO));
      this.mainList = await f.json();
      this.count = 0;
      // eslint-disable-next-line no-unused-vars
      for (let key in this.mainList) {
        this.count++;
        if (this.switch1 == 1) {
          console.log(key);
          this.listOfGood[key] = this.mainList[key]["good"];
        }
      }
      loadStat.value = false;
      //console.log(this.mainList);
      //console.log(this.addDate(this.dateISO));
    },
    addDate(date) {
      if (date === "") {
        return date;
      } else {
        date = "?date=" + date;
        return date;
      }
    },
    inputListOfReady(index) {
      console.log("inputListOfReady = " + this.listOfReady[index]);
      this.listOfDiff[index] = this.listOfReady[index] - this.listOfGood[index];
    },
  },
  created() {
    this.getJson(byLine, 0);
    console.log("statistics created");
  },
};
</script>

<style scoped></style>
