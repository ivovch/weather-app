import axios from "axios";

export const getIpApi = "https://api.ipify.org?format=json";
const getGeoAccessKey = "5cffa8cd-5cd4-48d2-95da-7b93e2afc7a6";
export const getGeoByIpApi = `https://apiip.net/api/check?&accessKey=${getGeoAccessKey}`;

const weatherApiKey = "41994e4c6c80188b3d2b36314f83700d";
export const getCoordinatesFromCityNameApi = `https://api.openweathermap.org/geo/1.0/direct?appid=${weatherApiKey}`;
export const geWeatherDataApi = `https://api.openweathermap.org/data/3.0/onecall?appid=${weatherApiKey}`;
export const getCityNameApi = `https://api.openweathermap.org/geo/1.0/direct?appid=${weatherApiKey}`;
export const getWeatherForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${weatherApiKey}`;

const httpClient = axios.create();
export default httpClient;
