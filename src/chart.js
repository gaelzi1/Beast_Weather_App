/**
 * @file chart.js
 * @description Genera las tres gráficas con Chart.js
 */

let tempChart, humidityChart, windChart;

export function renderHourlyCharts(hourlyData) {
  const tempChartEl = document.getElementById("temp-chart");
  const humidityChartEl = document.getElementById("humidity-chart");
  const windChartEl = document.getElementById("wind-chart");

  const labels = hourlyData.map(i => new Date(i.dt * 1000).toLocaleTimeString("es-MX", { hour: "2-digit" }));
  const temps = hourlyData.map(i => i.main.temp);
  const humidity = hourlyData.map(i => i.main.humidity);
  const wind = hourlyData.map(i => i.wind.speed * 3.6);

  if (tempChart) tempChart.destroy();
  if (humidityChart) humidityChart.destroy();
  if (windChart) windChart.destroy();

  tempChart = new Chart(tempChartEl, {
    type: "line",
    data: { labels, datasets: [{ label: "Temperatura (°C)", data: temps, borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", fill: true, tension: 0.4 }] }
  });

  humidityChart = new Chart(humidityChartEl, {
    type: "bar",
    data: { labels, datasets: [{ label: "Humedad (%)", data: humidity, backgroundColor: "#3b82f6", borderRadius: 4 }] },
    options: { scales: { y: { beginAtZero: true, max: 100 } } }
  });

  windChart = new Chart(windChartEl, {
    type: "line",
    data: { labels, datasets: [{ label: "Viento (km/h)", data: wind, borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", fill: true, tension: 0.4 }] }
  });
}
