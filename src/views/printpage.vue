<template>
  <div class="container">
    <h1 class="hello">Печать на коробках</h1>
    <form @submit.prevent="sendPrintRequest">
      <div class="form-group">
        <label for="printer-ip">IP-адрес принтера:</label>
        <input type="text" v-model="printerIp" id="printer-ip" required />
      </div>

      <div class="form-group">
        <label for="product">Выберите продукт:</label>
        <select v-model="selectedProductIndex" id="product">
          <option
            v-for="(product, index) in productList"
            :key="index"
            :value="index"
          >
            {{ product.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="quantity">Количество:</label>
        <input
          type="number"
          v-model="quantity"
          id="quantity"
          min="1"
          required
        />
      </div>

      <div class="form-group">
        <label for="date">Дата производства:</label>
        <input type="date" v-model="productionDate" id="date" required />
      </div>

      <button type="submit">Отправить</button>
      <button type="button" @click="stopPrint" class="stop-button">
        Остановить печать
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "PrintPage",
  data() {
    return {
      printerIp: "192.168.100.121",
      selectedProductIndex: 0,
      quantity: 1,
      productionDate: new Date().toISOString().substr(0, 10),
      productList: [
        { name: "Сливки Клевер 10% 500г", gtin: "4602547000022" },
        { name: "Сливки Клевер 20% 500г", gtin: "4602547001203" },
        { name: "Сливки Клевер 35% 500г", gtin: "4602547000329" },
        { name: "Молоко Клеверок 2,5% 500Г", gtin: "4602547000169" },
      ],
    };
  },
  methods: {
    async sendPrintRequest() {
      let selectedProduct = this.productList[this.selectedProductIndex];
      // eslint-disable-next-line
      const response = await fetch("http://10.10.3.27:5000/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          printerIp: this.printerIp,
          product: selectedProduct.name,
          quantity: this.quantity,
          gtin: selectedProduct.gtin,
          productionDate: this.productionDate,
        }),
      });
    },
    async stopPrint() {
      // eslint-disable-next-line
      const response = await fetch("http://10.10.3.27:5000/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printerIp: this.printerIp }),
      });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  text-align: center;
  padding-top: 50px;
}

h1 {
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 300px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

button {
  background-color: blue;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

button:hover {
  background-color: darkblue;
}

.stop-button {
  background-color: red;
  margin-top: 10px;
}

.stop-button:hover {
  background-color: darkred;
}
</style>
