// =============================
// CONFIGURACIÓN
// =============================
const API_KEY = "21acc721387d02416159e944b157bc5f"; // Tu clave de API
const CIUDAD = "Querétaro,mx";
const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CIUDAD}&units=metric&appid=${API_KEY}&lang=es`;

// =============================
// ELEMENTOS DEL DOM
// =============================
const sidebarWeatherEl = document.getElementById("sidebar-weather-content");
const dayNavigationEl = document.getElementById("day-navigation");
const selectedDateEl = document.getElementById("selected-date");
const infoSectionEl = document.getElementById("info-section");
const detailsCardsEl = document.getElementById("details-cards");
const tempChartEl = document.getElementById('temp-chart');
const humidityChartEl = document.getElementById('humidity-chart');
const windChartEl = document.getElementById('wind-chart');

// Variables globales
let forecastByDay = {};
let tempChart, humidityChart, windChart;

// =============================
// FUNCIONES
// =============================

/**
 * Inicia la aplicación.
 */
async function init() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al conectar con la API.");
        const data = await response.json();
        
        processForecastData(data.list);
        renderDayNavigation();
        displayDayDetails(Object.keys(forecastByDay)[0]);

    } catch (error) {
        sidebarWeatherEl.innerHTML = `<p class="text-red-500 p-4">${error.message}</p>`;
    }
}

/**
 * Agrupa los datos del pronóstico por día.
 */
function processForecastData(forecastList) {
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
        if (!forecastByDay[date]) {
            forecastByDay[date] = { hourly: [], temps: [] };
        }
        forecastByDay[date].hourly.push(item);
        forecastByDay[date].temps.push(item.main.temp);
    });
}

/**
 * Renderiza las tarjetas de navegación de los días.
 */
function renderDayNavigation() {
    const todayKey = Object.keys(forecastByDay)[0];
    const todayData = forecastByDay[todayKey];
    const todayAvgTemp = todayData.temps.reduce((a, b) => a + b, 0) / todayData.temps.length;
    
    sidebarWeatherEl.innerHTML = `
        <p class="text-lg font-semibold text-gray-500">${todayKey}</p>
        <img src="https://openweathermap.org/img/wn/${todayData.hourly[0].weather[0].icon}@4x.png" alt="Clima" class="w-32 h-32">
        <p class="text-5xl font-bold">${Math.round(todayAvgTemp)}<span class="text-3xl align-top">°C</span></p>
        <p class="text-gray-600 capitalize">${todayData.hourly[0].weather[0].description}</p>
    `;

    Object.keys(forecastByDay).forEach((dateKey, index) => {
        const day = forecastByDay[dateKey];
        const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
        const card = document.createElement('div');
        card.className = `day-card flex items-center p-3 rounded-lg cursor-pointer transition-colors bg-gray-100 hover:bg-blue-200`;
        if (index === 0) card.classList.add('active-day');
        
        card.dataset.dateKey = dateKey;
        card.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${day.hourly[0].weather[0].icon}@2x.png" alt="clima" class="w-12 h-12">
            <div class="flex-1 ml-3 text-left">
                <p class="font-bold text-gray-800">${dateKey.split(',')[0]}</p>
                <p class="text-sm text-gray-600 capitalize">${day.hourly[0].weather[0].description}</p>
            </div>
            <p class="text-lg font-bold text-gray-800">${Math.round(avgTemp)}°C</p>
        `;

        card.addEventListener('click', () => {
            document.querySelectorAll('.day-card').forEach(c => c.classList.remove('active-day'));
            card.classList.add('active-day');
            displayDayDetails(dateKey);
        });
        dayNavigationEl.appendChild(card);
    });
}

/**
 * Muestra los detalles del día seleccionado.
 */
function displayDayDetails(dateKey) {
    const dayData = forecastByDay[dateKey];
    selectedDateEl.textContent = `Pronóstico para el ${dateKey}`;

    const maxTemp = Math.max(...dayData.temps);
    const minTemp = Math.min(...dayData.temps);
    const avgHumidity = dayData.hourly.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.hourly.length;
    const maxWind = Math.max(...dayData.hourly.map(item => item.wind.speed));

    renderInfoSection(dayData);
    detailsCardsEl.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-temperature-high text-2xl text-red-500 mb-2"></i><p class="font-bold text-xl">${Math.round(maxTemp)}°C</p><p class="text-gray-500 text-sm">Temp. Máxima</p></div>
        <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-temperature-low text-2xl text-blue-500 mb-2"></i><p class="font-bold text-xl">${Math.round(minTemp)}°C</p><p class="text-gray-500 text-sm">Temp. Mínima</p></div>
        <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-tint text-2xl text-cyan-500 mb-2"></i><p class="font-bold text-xl">${Math.round(avgHumidity)}%</p><p class="text-gray-500 text-sm">Humedad Prom.</p></div>
        <div class="bg-white p-4 rounded-lg shadow-md text-center"><i class="fas fa-wind text-2xl text-gray-500 mb-2"></i><p class="font-bold text-xl">${(maxWind * 3.6).toFixed(1)} km/h</p><p class="text-gray-500 text-sm">Viento Máx.</p></div>
    `;
    
    renderHourlyCharts(dayData.hourly);
}

/**
 * Muestra advertencias o una lista aleatoria de recomendaciones.
 */
function renderInfoSection(dayData) {
    infoSectionEl.innerHTML = '';
    const maxTemp = Math.max(...dayData.temps);
    const minTemp = Math.min(...dayData.temps);
    let content = '';

    if (maxTemp > 30) {
        const recommendations = generateHotWeatherRecommendations();
        content = `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <p class="font-bold">Advertencia de Calor</p>
                <p>Se esperan temperaturas superiores a 30°C. Mantente hidratado y evita la exposición prolongada al sol.</p>
                <hr class="border-red-200 my-2">
                <p class="font-bold text-sm mb-1">Consejos adicionales:</p>
                <ul class="list-disc list-inside text-sm space-y-1">
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>`;
    } else if (minTemp < 20) {
        const recommendations = generateColdWeatherRecommendations(); // <-- CAMBIO AQUÍ
        content = `
            <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
                <p class="font-bold">Advertencia de Frío</p>
                <p>Las temperaturas bajarán de los 20°C. Se recomienda llevar una chaqueta, especialmente por la mañana o noche.</p>
                <hr class="border-blue-200 my-2">
                <p class="font-bold text-sm mb-1">Consejos adicionales:</p>
                <ul class="list-disc list-inside text-sm space-y-1">
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>`;
    } else {
        const recommendations = generateGeneralRecommendations();
        content = `
            <div class="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg">
                <p class="font-bold mb-2 flex items-center"><i class="fas fa-lightbulb mr-2"></i>Consejos para tu día</p>
                <ul class="list-disc list-inside text-sm space-y-1">
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>`;
    }
    infoSectionEl.innerHTML = content;
}

/**
 * Genera una lista aleatoria de recomendaciones para clima templado.
 */
function generateGeneralRecommendations() {
    const allRecommendations = [
        "Revisa la presión de tus llantas, los cambios de temperatura pueden afectarla.", "Un paseo por la mañana es ideal con este clima.", "Es un buen día para organizar tus actividades al aire libre.", "Aprovecha para ventilar tu casa y renovar el aire.", "Recuerda usar protector solar, incluso en días nublados.", "Si tienes plantas, revisa si necesitan agua.", "El clima es perfecto para leer un libro en un parque.", "Considera lavar tu auto hoy, el pronóstico es favorable.", "Mantén una botella de agua contigo para mantenerte hidratado.", "Planifica una comida al aire libre si tienes oportunidad.", "La noche podría ser fresca, ten a la mano una manta ligera.", "Verifica el pronóstico antes de salir para planificar tu atuendo.", "Un buen día para hacer ejercicio al aire libre.", "Si eres alérgico, ten en cuenta el polen en días ventosos.", "Disfruta de una bebida caliente o fría según la hora del día."
    ];
    const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 6) + 5; // Entre 5 y 10
    return shuffled.slice(0, count);
}

/**
 * Genera una lista aleatoria de recomendaciones para clima caluroso.
 */
function generateHotWeatherRecommendations() {
    const allRecommendations = [
        "Usa ropa de colores claros y tejidos transpirables como el algodón.", "Busca la sombra, especialmente durante las horas pico de sol (11 a.m. a 4 p.m.).", "Come comidas ligeras y frescas como ensaladas o frutas.", "Evita las bebidas azucaradas o con cafeína, ya que pueden deshidratar.", "Date una ducha o baño con agua fresca para bajar la temperatura corporal.", "Cierra cortinas y persianas durante el día para mantener tu casa fresca.", "Nunca dejes a niños o mascotas en un vehículo estacionado.", "Presta atención a síntomas de agotamiento por calor, como mareos o náuseas.", "Congela botellas de agua para tener una fuente de frescor durante más tiempo.", "Si haces ejercicio, elige las primeras horas de la mañana o el atardecer."
    ];
    const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 3; // Entre 3 y 5
    return shuffled.slice(0, count);
}

/**
 * NUEVA FUNCIÓN: Genera una lista aleatoria de recomendaciones para clima frío.
 */
function generateColdWeatherRecommendations() {
    const allRecommendations = [
        "Vístete en capas para adaptarte fácilmente a los cambios de temperatura.",
        "Una bebida caliente como té o café te ayudará a mantener el calor.",
        "Asegúrate de que tus ventanas y puertas sellen bien para evitar corrientes de aire.",
        "Usa bálsamo labial para evitar que tus labios se resequen con el frío.",
        "No olvides usar guantes y una bufanda si vas a estar mucho tiempo afuera.",
        "Es un buen momento para preparar sopas o guisos calientes.",
        "Si tienes mascotas, asegúrate de que tengan un lugar cálido para resguardarse.",
        "El aire frío puede ser seco; considera usar un humidificador en casa.",
        "Realiza un calentamiento adecuado antes de hacer ejercicio al aire libre."
    ];
    const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 3; // Entre 3 y 5
    return shuffled.slice(0, count);
}


/**
 * Crea o actualiza las tres gráficas horarias.
 */
function renderHourlyCharts(hourlyData) {
    const labels = hourlyData.map(item => new Date(item.dt * 1000).toLocaleTimeString('es-MX', { hour: '2-digit' }));
    const tempData = hourlyData.map(item => item.main.temp);
    const humidityData = hourlyData.map(item => item.main.humidity);
    const windData = hourlyData.map(item => item.wind.speed * 3.6); // Convertir a km/h

    if (tempChart) tempChart.destroy();
    if (humidityChart) humidityChart.destroy();
    if (windChart) windChart.destroy();

    tempChart = new Chart(tempChartEl.getContext('2d'), {
        type: 'line', data: { labels, datasets: [{ label: 'Temperatura', data: tempData, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4 }] }
    });
    humidityChart = new Chart(humidityChartEl.getContext('2d'), {
        type: 'bar', data: { labels, datasets: [{ label: 'Humedad', data: humidityData, backgroundColor: '#3b82f6', borderRadius: 4 }] }, options: { scales: { y: { beginAtZero: true, max: 100 } } }
    });
    windChart = new Chart(windChartEl.getContext('2d'), {
        type: 'line', data: { labels, datasets: [{ label: 'Viento (km/h)', data: windData, borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', fill: true, tension: 0.4 }] }, options: { scales: { y: { beginAtZero: true } } }
    });
}

// =============================
// INICIALIZACIÓN
// =============================
init();