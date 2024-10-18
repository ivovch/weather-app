<template>
  <div class="favourites-wrapper">
    <Favourite
      v-for="favorite in weatherData"
      :key="favorite.id"
      :weatherData="favorite"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Favourite from "@/components/Favourite.vue";
const weatherData = computed(() =>
  Object.keys(localStorage).map((key) => JSON.parse(localStorage.getItem(key)))
);
</script>

<style scoped>
.favourites-wrapper {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
