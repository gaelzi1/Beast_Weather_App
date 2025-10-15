/**
 * @file main.js
 * @description Punto de entrada principal de la app.
 */

import { fetchWeatherData } from "./api.js";
import { renderDayNavigation, renderDetails } from "./ui.js";

const sidebarWeatherEl = document.getElementById("sidebar-weather-content");
const dayNavigationEl = document.getElementById("day-navigation");
const selectedDateEl = document.getElementById("selected-date");
const infoSectionEl = document.getElementById("info-section");
const detailsCardsEl = document.getElementById("details-cards");

let forecastByDay = {};

function processForecastData(forecastList) {
  forecastByDay = {};
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" });
    if (!forecastByDay[date]) forecastByDay[date] = { hourly: [], temps: [] };
    forecastByDay[date].hourly.push(item);
    forecastByDay[date].temps.push(item.main.temp);
  });
}

async function init() {
  try {
    const data = await fetchWeatherData();
    processForecastData(data.list);
    renderDayNavigation(forecastByDay, sidebarWeatherEl, dayNavigationEl, displayDayDetails);
    displayDayDetails(Object.keys(forecastByDay)[0]);
  } catch (err) {
    sidebarWeatherEl.innerHTML = `<p class="text-red-500">${err.message}</p>`;
  }
}

function displayDayDetails(dateKey) {
  renderDetails(dateKey, forecastByDay, selectedDateEl, detailsCardsEl, infoSectionEl);
}

init();
