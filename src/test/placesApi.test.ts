import { fetchTips } from "../controller/places_api_controller";

const apiKey ="AIzaSyAgJRnFfiP_ChMFPXSDnyI5beDQRl4DprY";

if (!apiKey) {
  console.error("Google API key is not provided.");
  process.exit(1);
}

describe("-- Places API Tests --", () => {
  test("Places API - fetch tips for each country", async () => {
    const tips = await fetchTips(apiKey, "Eiffel Tower, Paris, France");
    console.log("Tips for", "Eiffel Tower, Paris, France", ":", tips);
    expect(tips.length).toBeGreaterThan(0);
  });
});
