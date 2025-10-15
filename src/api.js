/**
 * @file api.js
 * @description Maneja la comunicación con la API del clima.
 */

const API_KEY = "21acc721387d02416159e944b157bc5f";
const CIUDAD = "Querétaro,mx";

/**
 * Llama al endpoint de OpenWeather.
 * @returns {Promise<Object>} Datos completos del pronóstico.
 */
export async function fetchWeatherData() {
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CIUDAD}&units=metric&appid=${API_KEY}&lang=es`;

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al conectar con la API.");
  }
  return await response.json();
}
