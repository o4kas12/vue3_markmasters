<template>
  <div class="d-flex" id="wrapper">
    <nav
      class="navbar navbar-dark align-items-start sidebar accordion bg-gradient-primary p-0"
    >
      <div class="container-fluid d-flex flex-column p-0">
        <div class="w-100">
          <a href="/" class="logoCard">
            <img alt="Vue logo" class="logoPMZ" src="./assets/logo_pmz.png" />
          </a>
          <br />
          <hr />
          <router-link to="/">
            <button
              class="btn nav-button btn-secondary"
              style="border-radius: 0"
            >
              <div>Розлив</div>
            </button>
          </router-link>
          <router-link to="/history">
            <button
              class="btn nav-button btn-secondary"
              style="border-radius: 0"
            >
              <div>История</div>
            </button>
          </router-link>
          <router-link to="/products">
            <button
              class="btn nav-button btn-secondary"
              style="border-radius: 0"
            >
              <div>Продукты</div>
            </button>
          </router-link>
          <router-link to="/manage">
            <button
              class="btn nav-button btn-secondary"
              style="border-radius: 0"
            >
              <div>Settings</div>
            </button>
          </router-link>
        </div>
      </div>
    </nav>
    <div class="d-flex flex-column" id="content-wrapper">
      <div id="content>">
        <div class="container-fluid main-content">
          <button class="btn btn-lg" id="sidebarToggle">|||</button>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
window.addEventListener("DOMContentLoaded", (event) => {
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }
});
</script>

<style src="./assets/style.css"></style>
