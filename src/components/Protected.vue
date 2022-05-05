<template>
  <div>
    <div class="container text-center">
      <h2>Please enter password to access this page.</h2>

      <div class="row">
        <div class="col-md-6 offset-md-3">
          <form v-on:submit.prevent="validateBeforeSubmit">
            <div class="form-group text-left">
              <input
                id="password"
                class="form-control password-field"
                type="password"
                name="password"
                v-model.trim="password"
              />
              <span class="error help-block"></span>
            </div>
            <div class="text-danger" v-if="error">
              <p>Incorrect password.</p>
            </div>
            <br />
            <button class="btn btn-primary" type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storageHelper from "storage-helper";
import router from "@/router";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Protected",
  data() {
    return {
      error: null,
      password: null,
    };
  },
  methods: {
    validateBeforeSubmit() {
      if (this.password === "61325") {
        this.error = false;
        storageHelper.setItem("user-password", this.password);
        // eslint-disable-next-line no-undef
        router.push("manage");
      } else {
        this.error = true;
      }
    },
  },
  mounted() {
    document.getElementById("password").focus();
  },
};
</script>
