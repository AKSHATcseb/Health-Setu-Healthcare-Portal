const axios = require("axios");

async function getDistanceGeoapify(origin, destination) {
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    const response = await axios.get(
      "https://api.geoapify.com/v1/routing",
      {
        params: {
          waypoints: `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`,
          mode: "drive",
          apiKey: apiKey,
        },
      }
    );

    const route = response.data.features[0].properties;

    return {
      distanceText: (route.distance / 1000).toFixed(2) + " km",
      distanceValue: route.distance,
      durationText: Math.round(route.time / 60) + " mins",
      durationValue: route.time,
    };

  } catch (err) {
    console.error("Geoapify error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = getDistanceGeoapify;