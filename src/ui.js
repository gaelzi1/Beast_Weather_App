/**
 * @file ui.js
 * @description Renderiza los componentes visuales: navegación, tarjetas e info.
 */

import { generateColdWeatherRecommendations, generateHotWeatherRecommendations, generateGeneralRecommendations } from "./recomendacionesClima.js";
import { renderHourlyCharts } from "./chart.js";

export function renderDayNavigation(forecastByDay, sidebarWeatherEl, dayNavigationEl, displayDayDetails) {
  const todayKey = Object.keys(forecastByDay)[0];
  const todayData = forecastByDay[todayKey];
  const todayAvgTemp = todayData.temps.reduce((a, b) => a + b, 0) / todayData.temps.length;

  sidebarWeatherEl.innerHTML = `
    <p class="text-lg font-semibold text-gray-500">${todayKey}</p>
    <img src="https://openweathermap.org/img/wn/${todayData.hourly[0].weather[0].icon}@4x.png" class="w-32 h-32">
    <p class="text-5xl font-bold">${Math.round(todayAvgTemp)}<span class="text-3xl align-top">°C</span></p>
    <p class="text-gray-600 capitalize">${todayData.hourly[0].weather[0].description}</p>
  `;

  Object.keys(forecastByDay).forEach((dateKey, index) => {
    const day = forecastByDay[dateKey];
    const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
    const card = document.createElement("div");
    card.className = "day-card flex items-center p-3 rounded-lg cursor-pointer transition-colors bg-gray-100 hover:bg-blue-200";
    if (index === 0) card.classList.add("active-day");
    card.dataset.dateKey = dateKey;

    card.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${day.hourly[0].weather[0].icon}@2x.png" class="w-12 h-12">
      <div class="flex-1 ml-3 text-left">
        <p class="font-bold text-gray-800">${dateKey.split(",")[0]}</p>
        <p class="text-sm text-gray-600 capitalize">${day.hourly[0].weather[0].description}</p>
      </div>
      <p class="text-lg font-bold text-gray-800">${Math.round(avgTemp)}°C</p>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".day-card").forEach(c => c.classList.remove("active-day"));
      card.classList.add("active-day");
      displayDayDetails(dateKey);
    });
    dayNavigationEl.appendChild(card);
  });
}

export function renderInfoSection(dayData, infoSectionEl) {
  infoSectionEl.innerHTML = "";
  const maxTemp = Math.max(...dayData.temps);
  const minTemp = Math.min(...dayData.temps);
  let content = "";

  if (maxTemp > 30) {
    const recommendations = generateHotWeatherRecommendations();
    content = `
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        <p class="font-bold">Advertencia de Calor</p>
        <p>Se esperan temperaturas superiores a 30°C.</p>
        <ul class="list-disc list-inside text-sm mt-2">${recommendations.map(r => `<li>${r}</li>`).join("")}</ul>
      </div>`;
  } else if (minTemp < 20) {
    const recommendations = generateColdWeatherRecommendations();
    content = `
      <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
        <p class="font-bold">Advertencia de Frío</p>
        <p>Las temperaturas bajarán de los 20°C.</p>
        <ul class="list-disc list-inside text-sm mt-2">${recommendations.map(r => `<li>${r}</li>`).join("")}</ul>
      </div>`;
  } else {
    const recommendations = generateGeneralRecommendations();
    content = `
      <div class="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg">
        <p class="font-bold mb-2 flex items-center"><i class="fas fa-lightbulb mr-2"></i>Consejos</p>
        <ul class="list-disc list-inside text-sm">${recommendations.map(r => `<li>${r}</li>`).join("")}</ul>
      </div>`;
  }

  infoSectionEl.innerHTML = content;
}

export function renderDetails(dateKey, forecastByDay, selectedDateEl, detailsCardsEl, infoSectionEl) {
  const dayData = forecastByDay[dateKey];
  selectedDateEl.textContent = `Pronóstico para el ${dateKey}`;

  const maxTemp = Math.max(...dayData.temps);
  const minTemp = Math.min(...dayData.temps);
  const avgHumidity = dayData.hourly.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.hourly.length;
  const maxWind = Math.max(...dayData.hourly.map(item => item.wind.speed));

  renderInfoSection(dayData, infoSectionEl);
  detailsCardsEl.innerHTML = `
    <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-temperature-high text-2xl text-red-500 mb-2"></i><p class="font-bold text-xl">${Math.round(maxTemp)}°C</p><p class="text-gray-500 text-sm">Temp. Máxima</p></div>
    <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-temperature-low text-2xl text-blue-500 mb-2"></i><p class="font-bold text-xl">${Math.round(minTemp)}°C</p><p class="text-gray-500 text-sm">Temp. Mínima</p></div>
    <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-tint text-2xl text-cyan-500 mb-2"></i><p class="font-bold text-xl">${Math.round(avgHumidity)}%</p><p class="text-gray-500 text-sm">Humedad Prom.</p></div>
    <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-wind text-2xl text-gray-500 mb-2"></i><p class="font-bold text-xl">${(maxWind * 3.6).toFixed(1)} km/h</p><p class="text-gray-500 text-sm">Viento Máx.</p></div>
  `;

  renderHourlyCharts(dayData.hourly);
}
