<template>
  <div class="favourite-block">
    <div class="favourite-block-title">
      <h2>{{ weatherData.city }}</h2>
      <img :src="iconUrlHandler(weatherData.icon)" />
    </div>
    <div class="favourite-block-controls">
      <RadioButton v-model="modelValue"></RadioButton>
    </div>
    <div v-if="modelValue" class="favourite-block-content">
      <div class="favourite-block-content__temp">
        {{ weatherData.temp }}&deg;
      </div>
    </div>
    <div v-else class="favourite-block-content">
      <div class="favourite-block-content__forecast">
        <div
          class="favourite-block-content__forecast-item"
          v-for="forecastData in weatherData.forecastWeather"
          :key="forecastData.id"
        >
          <div class="favourite-block-content__forecast-item-date">
            {{ forecastData.textTime.time }} <br />
            {{ forecastData.textTime.date }}
          </div>
          <div class="favourite-block-content__forecast-item-icon">
            <img :src="iconUrlHandler(forecastData.icon)" />
          </div>
          <div class="favourite-block-content__forecast-item-temp">
            {{ forecastData.temp }} &deg;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import RadioButton from "@/components/RadioButton.vue";
import { ref, computed, defineProps } from "vue";
import { iconUrlHandler } from "@/utils/iconUrlHandler";
const COUNT_OF_HOURLY_ITEMS = 24;
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
const modelValue = ref(weatherData.value.showDefaultHourlyWeather);
</script>

<style scoped>
.favourite-block {
  border: 1px solid gray;
  padding: 20px;
  border-radius: 10px;
  background-color: #3d6aa2;
  color: #fff;

  .favourite-block-title {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .favourite-block-content {
    margin-top: 20px;
  }

  .favourite-block-content__temp {
    font-size: 50px;
    font-weight: 700;
  }

  .favourite-block-content__forecast {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 5px;
  }

  .favourite-block-content__forecast-item {
    display: flex;
    flex-direction: column;
    border: 1px solid #194d8c;
    border-radius: 5px;
    flex-grow: 1;
    align-items: center;
    text-align: center;
    padding: 5px;
  }

  .favourite-block-content__forecast-item-temp {
    font-size: 20px;
  }
}
</style>
