import {
  generateGeneralRecommendations,
  generateHotWeatherRecommendations,
  generateColdWeatherRecommendations
} from "../src/recommendations.js";

describe("Recomendaciones climáticas", () => {
  test("general: entre 5 y 10 elementos", () => {
    const recs = generateGeneralRecommendations();
    expect(recs.length).toBeGreaterThanOrEqual(5);
    expect(recs.length).toBeLessThanOrEqual(10);
  });

  test("calor: entre 3 y 5 elementos", () => {
    const recs = generateHotWeatherRecommendations();
    expect(recs.length).toBeGreaterThanOrEqual(3);
    expect(recs.length).toBeLessThanOrEqual(5);
  });

  test("frío: entre 3 y 5 elementos", () => {
    const recs = generateColdWeatherRecommendations();
    expect(recs.length).toBeGreaterThanOrEqual(3);
    expect(recs.length).toBeLessThanOrEqual(5);
  });

  test("todas las recomendaciones son strings", () => {
    const recs = generateGeneralRecommendations();
    recs.forEach(r => expect(typeof r).toBe("string"));
  });

  test("las recomendaciones varían entre ejecuciones", () => {
    const recs1 = generateGeneralRecommendations();
    const recs2 = generateGeneralRecommendations();
    expect(JSON.stringify(recs1)).not.toBe(JSON.stringify(recs2));
  });
});
