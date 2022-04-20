<template>
  <div id="wrapper">
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
            <button class="nav-button">
              <div>Розлив</div>
            </button>
          </router-link>
          <router-link to="/history">
            <button class="nav-button">
              <div>История</div>
            </button>
          </router-link>
          <router-link to="/products">
            <button class="nav-button">
              <div>Продукты</div>
            </button>
          </router-link>
        </div>
      </div>
    </nav>
    <div class="d-flex flex-column" id="content-wrapper">
      <div id="content>">
        <div class="container-fluid main-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./assets/style.css"></style>
