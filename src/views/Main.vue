<template>
  <div class="weather-blocks-wrapper">
    <TransitionGroup name="list">
      <WeatherBlock
        v-for="weatherBlock in weatherBlocks"
        :key="weatherBlock.id"
        :weather-data="weatherBlock"
        @getNewCityData="getDataForNewCityHandler"
        @isFavourite="isFavouriteHandler"
        @open-modal="openModalHandler"
      />
    </TransitionGroup>
  </div>
  <div class="weather-blocks-button-wrapper">
    <button
      v-show="isAddWeatherBlockButtonVisible"
      class="weather-blocks-button-wrapper__button"
      @click="addWeatherBlockHandler"
    >
      Add weather block
    </button>
  </div>

  <Teleport to="#modal">
    <ConfirmModal
      v-if="modal.show.value"
      @closeModal="closeModalHandler"
      @confirmation="confirmModalHandler"
    >
      Do you confirm to close {{ cityName }} weather block ?
    </ConfirmModal>
  </Teleport>
</template>

<script setup>
import { computed, markRaw, ref } from "vue";
import WeatherBlock from "@/components/WeatherBlock.vue";
import useState from "@/store/store";
import { useModal } from "@/composables/useModal";

import ConfirmModal from "@/components/ConfirmModal.vue";
const MAX_WEATHER_BLOCK_COUNT = 5;

const {
  initNewEmptyWeatherBlock,
  weatherBlocks,
  updateWeatherData,
  setFavoriteItem,
  isItemFavourite,
  isLocalStorageItemsLimitReached,
  removeFavoriteItem,
  removeWeatherBlock,
} = useState();
const modal = useModal();
let isAddWeatherBlockButtonVisible = computed(
  () => !(weatherBlocks.value.length >= MAX_WEATHER_BLOCK_COUNT)
);
const cityName = ref("");
const deletedWeatherBlockId = ref();
function getDataForNewCityHandler(params) {
  updateWeatherData(params.id, params.city);
}
function addWeatherBlockHandler() {
  initNewEmptyWeatherBlock();
}
function isFavouriteHandler(city) {
  if (isLocalStorageItemsLimitReached() && !isItemFavourite(city)) {
    alert("Max count of local storage items, please remove some");
  } else if (isItemFavourite(city)) {
    removeFavoriteItem(city);
  } else {
    setFavoriteItem(city);
  }
}
function openModalHandler({ id, city }) {
  cityName.value = city || "Empty";
  deletedWeatherBlockId.value = id;
  modal.component.value = markRaw(ConfirmModal);
  modal.openModal();
}
function closeModalHandler() {
  modal.closeModal();
}

function confirmModalHandler() {
  removeWeatherBlock(deletedWeatherBlockId.value);
  modal.closeModal();
}
</script>

<style scoped>
.weather-blocks-wrapper {
  margin-top: 50px;
}

.weather-blocks-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.weather-blocks-button-wrapper__button {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
}

.weather-blocks-button-wrapper__button:hover,
.weather-blocks-button-wrapper__button:focus {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: rgba(0, 0, 0, 0.65);
}

.weather-blocks-button-wrapper__button:hover {
  transform: translateY(-1px);
}

.weather-blocks-button-wrapper__button:active {
  background-color: #f0f0f1;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
