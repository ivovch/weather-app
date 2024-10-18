<template>
  <div class="weather-block">
    <div class="weather-block-header">
      <AutocompleteInput
        :cityName="weatherData.city"
        :id="weatherData.id"
        @searchedCity="getWeatherHandler"
      />
      <div class="weather-block-header__button-group">
        <button
          v-show="!weatherData.isError && !weatherData.isLoading"
          class="weather-block-header__button-like"
          :class="setButtonClass"
          @click="favouriteHandler"
        >
          <span v-if="weatherData.isFavourite">Remove from favourites</span>
          <span v-else>Add to favorite</span>
        </button>
        <button
          class="weather-block-header__button-close"
          @click="openConfirmationModal"
          :disabled="isCloseButtonDisabled"
        >
          Close
        </button>
      </div>
    </div>
    <div v-if="modelValue" class="weather-block-content">
      <div class="weather-block-content__controls">
        <RadioButton v-model="modelValue"></RadioButton>
      </div>
      <div class="weather-block-content__title">
        <h2 v-if="weatherData.isLoading">
          <Skeleton style="width: 200px; height: 30px" />
        </h2>
        <h2 v-else-if="weatherData.isError">Error: no data for this city</h2>
        <h2 v-else>{{ weatherData.city }}</h2>

        <div>
          <Skeleton
            v-if="weatherData.isLoading"
            style="width: 30px; height: 30px; border-radius: 50%"
          />
          <img
            v-else-if="!weatherData.isLoading && !weatherData.isError"
            :src="iconUrlHandler(weatherData.icon)"
          />
        </div>
      </div>
      <div class="weather-block-content__temp">
        <Skeleton
          v-if="weatherData.isLoading"
          style="width: 100px; height: 60px"
        />
        <span v-else-if="!weatherData.isLoading && !weatherData.isError"
          >{{ weatherData.temp }} &deg;</span
        >
      </div>
    </div>
    <div v-else class="weather-block-content">
      <RadioButton v-model="modelValue"></RadioButton>
      <div class="weather-block-content__title">
        <h2>{{ weatherData.city }}</h2>
      </div>
      <div class="weather-block-content__forecast-wrapper">
        <div
          class="weather-block-content__forecast-item"
          v-for="forecastData in weatherData.forecastWeather"
          :key="forecastData.id"
        >
          <div class="weather-block-content__forecast-item-date">
            {{ forecastData.textTime.time }} <br />
            {{ forecastData.textTime.date }}
          </div>
          <div class="weather-block-content__forecast-item-icon">
            <img :src="iconUrlHandler(forecastData.icon)" />
          </div>
          <div class="weather-block-content__forecast-item-temp">
            {{ forecastData.temp }} &deg;
          </div>
        </div>
      </div>
    </div>
    <Chart
      v-if="!weatherData.isError"
      :id="weatherData.id"
      :chartData="typeOfChartWeatherData"
      :showDefaultWeather="modelValue"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, computed, defineEmits, markRaw } from "vue";
import AutocompleteInput from "@/components/AutocompleteInput.vue";
import Skeleton from "@/components/Skeleton.vue";
import { iconUrlHandler } from "@/utils/iconUrlHandler";
import Chart from "@/components/Chart.vue";
import useState, { state } from "@/store/store";
import RadioButton from "@/components/RadioButton.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
// Chart will display temp. for next 24 hours
const COUNT_OF_HOURLY_ITEMS = 24;

const { weatherBlocks, isItemFavourite } = useState();
const emits = defineEmits(["getNewCityData", "isFavourite", "openModal"]);
const props = defineProps(["weatherData"]);
const weatherData = computed(() => {
  return {
    id: props.weatherData.id,
    city: props.weatherData.city,
    isLoading: props.weatherData.isLoading,
    isError: props.weatherData.isError,
    isFavourite: props.weatherData.isFavourite,
    temp: Math.round(props.weatherData.currentTemp),
    icon: props.weatherData.currentWeatherIcon,
    showDefaultHourlyWeather: props.weatherData.showDefaultHourlyWeather,
    hourly: props.weatherData.hourlyWeather
      ?.map((hourlyData) => {
        return {
          time: new Date(hourlyData.dt * 1000),
          temp: Math.round(hourlyData.temp),
          icon: hourlyData.weather[0]?.icon,
        };
      })
      .splice(0, COUNT_OF_HOURLY_ITEMS),
    forecastWeather: props.weatherData.forecastWeather.map((forecastData) => {
      return {
        id: forecastData.dt,
        time: new Date(forecastData.dt * 1000),
        temp: Math.round(forecastData.main.temp),
        icon: forecastData.weather[0]?.icon,
        textTime: {
          date: forecastData.dt_txt.split(" ")[0],
          time: forecastData.dt_txt.split(" ")[1].substring(0, 5),
        },
      };
    }),
  };
});
const setButtonClass = computed(() => {
  return {
    "weather-block-header__button-like_active": isItemFavourite(
      weatherData.value.city
    ),
  };
});
const modelValue = ref(weatherData.value.showDefaultHourlyWeather);
// Hourly or 5 days forecast, that depends on `modelValue`
const typeOfChartWeatherData = computed(() =>
  modelValue.value
    ? weatherData.value.hourly
    : weatherData.value.forecastWeather
);
const isCloseButtonDisabled = computed(() => state.weatherBlocks.length <= 1);
function getWeatherHandler(city) {
  emits("getNewCityData", { id: weatherData.value.id, city });
}
function favouriteHandler() {
  emits("isFavourite", weatherData.value.city);
}
function openConfirmationModal(id) {
  emits("openModal", {
    id: weatherData.value.id,
    city: weatherData.value.city,
  });
}
</script>

<style scoped>
.weather-block {
  border: 1px solid gray;
  padding: 20px;
  border-radius: 10px;
  background-color: #3d6aa2;
  color: #fff;
  margin-top: 50px;

  .weather-block-header {
    display: flex;
    justify-content: space-between;

    .weather-block-header__button-group {
      display: flex;
      gap: 15px;
    }

    .weather-block-header__button-like {
      padding: 5px 20px;
      cursor: pointer;
    }

    .weather-block-header__button-like.weather-block-header__button-like_active {
      background-color: red;
      color: #fff;
    }

    .weather-block-header__button-close {
      padding: 5px 20px;
      cursor: pointer;
    }
  }

  .weather-block-content__title {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .weather-block-content__temp {
    font-size: 50px;
    font-weight: 700;
  }

  .weather-block-content__forecast-wrapper {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 5px;
  }

  .weather-block-content__forecast-item {
    display: flex;
    flex-direction: column;
    border: 1px solid #194d8c;
    border-radius: 5px;
    flex-grow: 1;
    align-items: center;
    text-align: center;
    padding: 5px;
  }

  .weather-block-content__forecast-item-temp {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .weather-block {
    padding: 10px;

    .weather-block-header {
      flex-direction: column-reverse;
      gap: 10px;
    }

    .weather-block-header__button-group {
      justify-content: flex-end;
    }
  }
}
</style>
