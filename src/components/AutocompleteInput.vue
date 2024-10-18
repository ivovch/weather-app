<template>
  <div class="autocomplete-wrapper">
    <div class="input-wrapper">
      <input
        type="text"
        v-model="inputData"
        placeholder="City"
        @input="inputHandler"
        @focusout="focusOutHandler"
      />
      <div
        v-show="getAutocompleteResults(props.id)"
        class="autocomplete-input-list"
      >
        <div
          class="autocomplete-input-list__item"
          v-for="city in getAutocompleteResults(props.id)"
          :key="city?.city"
          @click="autocompleteListItemHandler(city.city)"
        >
          <div class="autocomplete-input-list__item-name">
            {{ city?.city }}
          </div>
          <div class="autocomplete-input-list__country-country">
            {{ city?.country }}
          </div>
        </div>
      </div>
    </div>
    <button
      class="autocomplete-wrapper__button"
      :disabled="isButtonDisabled"
      @click="getWeatherHandler"
    >
      Search
    </button>
  </div>
</template>
<script setup>
import { ref, computed, defineEmits, defineProps, watch } from "vue";
import { debounce } from "@/utils/Debounce";
import useState from "@/store/store";
const defaultDebounceTimer = 500;
const {
  weatherBlocks,
  clearAutocompleteResult,
  getAutocompleteResults,
  getCityNameByInputData,
} = useState();
const emit = defineEmits(["searchedCity"]);
const props = defineProps(["cityName", "id"]);
const inputData = ref("");
const isButtonDisabled = computed(() => !inputData.value.length);

const initDebounce = debounce((cityName) => {
  if (cityName.length) {
    getCityNameByInputData(props.id, cityName);
  } else {
    clearAutocompleteResult(props.id);
  }
}, defaultDebounceTimer);

watch(
  () => props.cityName,
  (newVal) => {
    inputData.value = newVal;
  },
  { immediate: true }
);

function inputHandler(e) {
  initDebounce(e.target.value);
}
function focusOutHandler() {
  clearAutocompleteResult(props.id);
}
function getWeatherHandler() {
  emit("searchedCity", inputData.value);
}
function autocompleteListItemHandler(city) {
  inputData.value = city;
  clearAutocompleteResult(props.id);
}
</script>
<style scoped>
.autocomplete-wrapper {
  display: flex;

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;

    input {
      width: 300px;
      padding: 10px 20px 10px 5px;
    }

    .autocomplete-input-list {
      box-sizing: border-box;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: #fff;
      z-index: 9;

      .autocomplete-input-list__item {
        padding: 5px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid darkgray;
        color: #333;
      }
    }
  }

  .autocomplete-wrapper__button {
    padding: 5px 20px;
    cursor: pointer;
  }
}

@media (max-width: 576px) {
  .autocomplete-wrapper {
    .input-wrapper {
      input {
        width: 100%;
      }
    }
  }
}
</style>
