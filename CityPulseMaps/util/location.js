import { Alert } from "react-native";
import { Point } from "../models/point";
import { calculateAQIfromPM25 } from "./helperFunctions";
import Constants from 'expo-constants';

const GOOGLE_API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

let cache = {};

const getCacheKey = (lat, lng, placeType, radius) =>
  `lat=${lat}&lng=${lng}&type=${placeType}&radius=${radius}`;

const constructUrl = (lat, lng, placeType, radius, nextPageToken = "") => {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${placeType}&key=${GOOGLE_API_KEY}&fields=name,geometry,rating,types`;
  if (nextPageToken) {
    url += `&pagetoken=${nextPageToken}`;
  }
  return url;
};

const fetchPointsPage = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching results page:", error);
    throw error;
  }
};

const fetchAllPages = async (
  lat,
  lng,
  placeType,
  radius,
  nextPageToken = "",
) => {
  const url = constructUrl(lat, lng, placeType, radius, nextPageToken);
  const data = await fetchPointsPage(url);

  if (data.status === "ZERO_RESULTS") {
    Alert.alert(
      "No Results Found",
      "There are no results near your location.",
      [{ text: "OK" }],
    );
    return [];
  } else {
    const points = data.results.map((googlePlace) => {
      return new Point(
        googlePlace.geometry.location.lat,
        googlePlace.geometry.location.lng,
        1,
        googlePlace.place_id,
        googlePlace.name,
      );
    });

    if (data.next_page_token) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const nextPagePoints = await fetchAllPages(
        lat,
        lng,
        placeType,
        radius,
        data.next_page_token,
      );
      return points.concat(nextPagePoints);
    } else {
      return points;
    }
  }
};

export const getPoints = async (lat, lng, placeType, radius) => {
  const cacheKey = getCacheKey(lat, lng, placeType, radius);
  const now = new Date();

  if (cache[cacheKey] && cache[cacheKey].expiry > now) {
    if (cache[cacheKey].data.length === 0) {
      Alert.alert(
        "No Results Found",
        "There are no results near your location.",
        [{ text: "OK" }],
      );
    }
    return cache[cacheKey].data;
  }

  try {
    const data = await fetchAllPages(lat, lng, placeType, radius);
    cache[cacheKey] = {
      data: data,
      expiry: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    };
    return data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

export const fetchAirQualityData = async (lat, lng, radius) => {
  const url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lng}&radius=${radius}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    let pm25Measurement = null;
    let points = [];
    let i = 0;
    if (data.results?.length > 0) {
      points = data.results
        .map((location) => {
          pm25Measurement = location.measurements.find(
            (measurement) => measurement.parameter === "pm25",
          );

          if (!pm25Measurement) {
            pm25Measurement = location.measurements.find(
              (measurement) => measurement.parameter === "pm10",
            );
          }

          const { latitude, longitude } = location.coordinates;
          const aqi = calculateAQIfromPM25(pm25Measurement.value);
          return new Point(latitude, longitude, aqi, ++i, location.location);
        })
        .filter(Boolean);
    } else {
      Alert.alert(
        "No Results Found",
        "There are no Air Quality measurements stations near your location.",
        [{ text: "OK" }],
      );
    }
    return points;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return [];
  }
};
