import { reactive, toRefs } from "vue";
import httpClient, {
  getCityNameApi,
  geWeatherDataApi,
  getCoordinatesFromCityNameApi,
  getIpApi,
  getGeoByIpApi,
  getWeatherForecast,
} from "@/services/http/httpClient";
import { uniqueId } from "@/utils/uniqueId";
export const state = reactive({
  weatherBlocks: [],
  favorites: [],
});

export default function useState() {
  const initNewEmptyWeatherBlock = () => {
    const newWeatherBlockData = {
      id: uniqueId(),
      isLoading: true,
      isError: false,
      isFavourite: false,
      city: "",
      autocompleteResults: [],
      currentTemp: null,
      currentWeatherIcon: null,
      showDefaultHourlyWeather: true,
      forecastWeather: [],
      hourlyWeather: [],
    };

    state.weatherBlocks.push(newWeatherBlockData);
    return newWeatherBlockData.id;
  };
  const clearAutocompleteResult = (id) => {
    state.weatherBlocks.find((wb) => wb.id === id).autocompleteResults = [];
  };
  const setAutocompleteResult = (id, citiesArray) => {
    state.weatherBlocks.find((wb) => wb.id === id).autocompleteResults =
      citiesArray.map((city) => {
        return {
          city: city.name,
          country: city.country,
          localisation: {
            en: city.local_names?.eu,
            uk: city.local_names?.uk,
          },
        };
      });
  };
  const getAutocompleteResults = (id) => {
    return state.weatherBlocks.find((wb) => wb.id === id).autocompleteResults;
  };
  const getCityByIp = async () => {
    // Get IP
    const ipData = await httpClient.get(getIpApi);
    const ip = ipData.data?.ip;
    // Get City name by IP
    const geoData = await httpClient.get(getGeoByIpApi, {
      params: {
        ip,
      },
    });
    return geoData.data?.city;
  };
  const getCityCoordinates = async (city) => {
    const cityCoordinates = await httpClient.get(
      getCoordinatesFromCityNameApi,
      {
        params: {
          q: city,
        },
      }
    );
    return {
      lat: cityCoordinates.data[0]?.lat,
      lon: cityCoordinates.data[0]?.lon,
    };
  };
  const getWeatherByCityCoordinates = async (lat, lon) => {
    const weatherData = await httpClient.get(geWeatherDataApi, {
      params: {
        lat,
        lon,
        units: "metric",
        exclude: "alerts,minutely,daily",
      },
    });

    return weatherData.data;
  };
  const getFiveDaysWeatherForecast = async (lat, lon) => {
    const weatherForecast = await httpClient.get(getWeatherForecast, {
      params: {
        lat,
        lon,
        units: "metric",
      },
    });

    return weatherForecast.data;
  };
  // Use to get initial info about user GEO and get current weather data
  const getDefaultUserWeather = async () => {
    const newWeatherBlockId = initNewEmptyWeatherBlock();
    const newWeatherBLock = state.weatherBlocks.find(
      (block) => block.id === newWeatherBlockId
    );

    try {
      const city = await getCityByIp();
      const { lat, lon } = await getCityCoordinates(city);
      const weather = await getWeatherByCityCoordinates(lat, lon);
      const fiveDaysForecast = await getFiveDaysWeatherForecast(lat, lon);

      newWeatherBLock.city = city;
      newWeatherBLock.currentTemp = weather.current.temp;
      newWeatherBLock.currentWeatherIcon = weather.current.weather[0].icon;
      newWeatherBLock.hourlyWeather = weather.hourly;
      newWeatherBLock.forecastWeather = fiveDaysForecast.list;
      newWeatherBLock.isLoading = false;
      newWeatherBLock.isFavourite = isItemFavourite(city);
      newWeatherBLock.isError = false;
    } catch (err) {
      newWeatherBLock.isLoading = false;
      newWeatherBLock.isError = true;
    }
  };
  const getCityNameByInputData = async (id, city) => {
    try {
      const data = await httpClient.get(getCityNameApi, {
        params: {
          q: city,
        },
      });

      setAutocompleteResult(id, data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const updateWeatherData = async (id, city) => {
    const weatherBlockToChange = state.weatherBlocks.find((wb) => wb.id === id);
    weatherBlockToChange.isLoading = true;

    try {
      const { lat, lon } = await getCityCoordinates(city);
      const weather = await getWeatherByCityCoordinates(lat, lon);
      const fiveDaysForecast = await getFiveDaysWeatherForecast(lat, lon);

      weatherBlockToChange.city = city;
      weatherBlockToChange.currentTemp = weather.current.temp;
      weatherBlockToChange.currentWeatherIcon =
        weather.current.weather[0]?.icon;
      weatherBlockToChange.hourlyWeather = weather.hourly;
      weatherBlockToChange.forecastWeather = fiveDaysForecast.list;
      weatherBlockToChange.isFavourite = isItemFavourite(city);

      weatherBlockToChange.isLoading = false;
      weatherBlockToChange.isError = false;
    } catch (err) {
      weatherBlockToChange.isLoading = false;
      weatherBlockToChange.isError = true;
    }
  };
  const updateDisplayWeatherDataState = (id, state) => {
    state.weatherBlocks.find((wb) => wb.id === id).showDefaultHourlyWeather =
      state;
  };
  const setFavoriteItem = (city) => {
    const weatherBLock = state.weatherBlocks.find(
      (wb) => wb.city.toLowerCase() === city.toLowerCase()
    );

    // const localStorageItemData = {
    //   city: weatherBLock.city,
    //   currentTemp: weatherBLock.currentTemp,
    //   currentWeatherIcon: weatherBLock.currentWeatherIcon,
    //   hourlyWeather: weatherBLock.hourlyWeather,
    //   forecastWeather: weatherBLock.forecastWeather,
    // };

    const localStorageItemData = weatherBLock;

    weatherBLock.isFavourite = true;
    localStorage.setItem(
      city.toLowerCase(),
      JSON.stringify(localStorageItemData)
    );
  };
  const isItemFavourite = (city) => {
    return !!localStorage.getItem(city?.toLowerCase());
  };
  const isLocalStorageItemsLimitReached = () => {
    return Object.keys(localStorage).length >= 5;
  };
  const removeFavoriteItem = (city) => {
    state.weatherBlocks.find(
      (wb) => wb.city.toLowerCase() === city.toLowerCase()
    ).isFavourite = false;
    localStorage.removeItem(city.toLowerCase());
  };
  const removeWeatherBlock = (id) => {
    const searchedWeatherBlock = state.weatherBlocks.find((wb) => wb.id === id);
    const index = state.weatherBlocks.indexOf(searchedWeatherBlock);
    state.weatherBlocks = state.weatherBlocks.filter((wb) => wb.id !== id);
  };

  return {
    ...toRefs(state),
    initNewEmptyWeatherBlock,
    clearAutocompleteResult,
    getAutocompleteResults,
    setAutocompleteResult,
    getDefaultUserWeather,
    getCityNameByInputData,
    updateWeatherData,
    updateDisplayWeatherDataState,
    setFavoriteItem,
    isItemFavourite,
    isLocalStorageItemsLimitReached,
    removeFavoriteItem,
    removeWeatherBlock,
  };
}
