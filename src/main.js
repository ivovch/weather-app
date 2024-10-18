import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import httpClient from "@/services/http/httpClient";
import {
  getIpApi,
  getGeoByIpApi,
  getCoordinatesFromCityNameApi,
  geWeatherDataApi,
} from "@/services/http/httpClient";
import WeatherBlock from "./components/WeatherBlock.vue";
import AutocompleteInput from "./components/AutocompleteInput.vue";
import useState from "@/store/store";
import { uniqueId } from "@/utils/uniqueId";

const app = createApp(App).use(router).mount("#app");
const { getDefaultUserWeather } = useState();

(async function () {
  await getDefaultUserWeather();
})();
