<template>
  <div class="app-wrapper">
    <nav class="app-wrapper-tabs">
      <div class="app-wrapper-tabs__item">
        <router-link to="/">Main</router-link>
      </div>
      <div class="app-wrapper-tabs__item">
        <router-link to="/favorites">Favorites</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import "./assets/css/main.css";
</script>

<style scoped>
.app-wrapper {
  max-width: 1200px;
  min-width: 360px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 50px;

  .app-wrapper-tabs {
    display: flex;
    gap: 15px;
  }

  .app-wrapper-tabs__item {
    border: 1px solid;
    padding: 10px 20px;
    border-radius: 5px;

    a {
      text-decoration: none;
      color: #333;
      font-size: 20px;
    }
  }

  .app-wrapper-tabs__item:has(a.router-link-active.router-link-exact-active) {
    background-color: #3d6aa2;

    a {
      color: #ffffff;
    }
  }
}

@media (max-width: 768px) {
  .app-wrapper {
    padding: 10px;
  }
}
</style>
