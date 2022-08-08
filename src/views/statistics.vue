<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 innerContent" style="margin-top: -75px">
        <div class="row">
          <h1 id="titleWithDate">Статистика</h1>
        </div>
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
        <table class="table">
          <thead>
            <tr>
              <th v-if="switch1 == 0" scope="row">Станция</th>
              <th scope="col">Продукт</th>
              <th scope="col">Всего</th>
              <th scope="col">Хорошо</th>
              <th scope="col">Плохо</th>
              <th scope="col">Вывод</th>
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
              <td>{{ mainList[index]["total"] }}</td>
              <td>{{ mainList[index]["good"] }}</td>
              <td>{{ mainList[index]["bad"] }}</td>
              <td>{{ mainList[index]["remove"] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "vue3-datepicker";
//import { ref } from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "statistics.vue",
  components: {
    Datepicker,
  },
  data() {
    const picked = new Date();
    return {
      picked,
      switch1: 0, // 0 - по станциям, 1 - по продукту
      mainList: {},
    };
  },
  watch: {
    picked(newValue) {
      newValue.setHours(newValue.getHours() + 10);
      let pickedISO = newValue.toISOString().slice(0, 10);
      console.log(pickedISO);
      console.log(this.picked);
    },
  },
  methods: {
    async getJson(url, switcher) {
      this.mainList = [];
      this.switch1 = switcher;
      const f = await fetch(url);
      const data = await f.json();
      this.mainList = data;
      console.log(this.mainList);
    },
  },
  created() {
    const byLine = "http://10.10.3.18:8021/by_line";
    // eslint-disable-next-line no-unused-vars
    const byProduct = "http://10.10.3.18:8021/by_product";
    this.getJson(byLine, 0);
  },
};
</script>

<style scoped></style>
