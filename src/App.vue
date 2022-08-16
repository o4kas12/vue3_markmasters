<template>
  <div class="d-flex" id="wrapper">
    <div class="border-end bg-white" id="fakeSidebar"></div>
    <!-- Sidebar-->
    <div class="border-end bg-white" id="sidebar-wrapper">
      <br />
      <div id="sidebarContent">
        <a href="/" class="logoCard">
          <img
            alt="Vue logo"
            class="logoPMZ w-65"
            src="./assets/logo_pmz.png"
          />
        </a>
        <div class="list-group list-group-flush">
          <br />
          <router-link
            to="/"
            active-class="active"
            class="list-group-item list-group-item-action list-group-item-light p-3"
            >Розлив</router-link
          >
          <router-link
            to="/statistics"
            active-class="active"
            class="list-group-item list-group-item-action list-group-item-light p-3"
            >Статистика</router-link
          >
          <router-link
            to="/dashboard"
            active-class="active"
            class="list-group-item list-group-item-action list-group-item-light p-3"
            >Dashboard</router-link
          >
          <router-link
            to="/manage"
            active-class="active"
            class="list-group-item list-group-item-action list-group-item-light p-3"
            >Settings</router-link
          >
        </div>
      </div>
    </div>
    <!-- Page content wrapper-->
    <div id="page-content-wrapper">
      <!-- Top navigation-->
      <div
        class="navbar navbar-expand-lg navbar-light border-bottom"
        id="header-menu"
      >
        <div class="container-fluid" style="position: relative; height: 40px">
          <button class="btn btn-primary" id="sidebarToggle">МЕНЮ</button>
          <div
            class="collapse navbar-collapse"
            id="navbarSupportedContent"
          ></div>
        </div>
      </div>
      <!-- Page content-->
      <div class="container-fluid">
        <br />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};

// eslint-disable-next-line no-unused-vars
window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    // eslint-disable-next-line no-shadow
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
