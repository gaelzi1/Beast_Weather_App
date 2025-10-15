/**
 * @file recomendacionesClima.js
 * @description Genera listas aleatorias de recomendaciones según el clima.
 */

export function generateGeneralRecommendations() {
  const recs = [
    "Revisa la presión de tus llantas.",
    "Aprovecha para ventilar tu casa.",
    "Usa protector solar incluso con nubes.",
    "Haz ejercicio al aire libre.",
    "Lava tu auto hoy, el clima es ideal.",
    "Lleva siempre agua contigo.",
    "Ideal para un paseo o leer afuera."
  ];
  return recs.sort(() => 0.5 - Math.random()).slice(0, 5);
}

export function generateHotWeatherRecommendations() {
  const recs = [
    "Usa ropa clara y transpirable.",
    "Evita el sol de 11 a 4.",
    "Come frutas frescas y ligeras.",
    "Toma mucha agua.",
    "No dejes mascotas en autos."
  ];
  return recs.sort(() => 0.5 - Math.random()).slice(0, 4);
}

export function generateColdWeatherRecommendations() {
  const recs = [
    "Vístete en capas.",
    "Toma bebidas calientes.",
    "Usa guantes y bufanda.",
    "Evita corrientes de aire frío.",
    "Usa bálsamo labial para no resecarte."
  ];
  return recs.sort(() => 0.5 - Math.random()).slice(0, 4);
}
