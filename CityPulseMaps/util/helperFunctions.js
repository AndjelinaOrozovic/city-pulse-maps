export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula to calculate the distance between two points on the earth
  const R = 6371e3; // metres
  const f1 = (lat1 * Math.PI) / 180;
  const f2 = (lat2 * Math.PI) / 180;
  const F1 = ((lat2 - lat1) * Math.PI) / 180;
  const F2 = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(F1 / 2) * Math.sin(F1 / 2) +
    Math.cos(f1) * Math.cos(f2) * Math.sin(F2 / 2) * Math.sin(F2 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const dist = R * c; // in metres
  return dist;
};

export const calculateAQIfromPM25 = (pm25) => {
  let iLow, iHigh, cLow, cHigh;
  if (pm25 <= 12) {
    iLow = 0;
    iHigh = 50;
    cLow = 0;
    cHigh = 12;
  } else if (pm25 <= 35.4) {
    iLow = 51;
    iHigh = 100;
    cLow = 12.1;
    cHigh = 35.4;
  } else if (pm25 <= 55.4) {
    iLow = 101;
    iHigh = 150;
    cLow = 35.5;
    cHigh = 55.4;
  } else if (pm25 <= 150.4) {
    iLow = 151;
    iHigh = 200;
    cLow = 55.5;
    cHigh = 150.4;
  } else if (pm25 <= 250.4) {
    iLow = 201;
    iHigh = 300;
    cLow = 150.5;
    cHigh = 250.4;
  } else if (pm25 <= 350.4) {
    iLow = 301;
    iHigh = 400;
    cLow = 250.5;
    cHigh = 350.4;
  } else if (pm25 <= 500.4) {
    iLow = 401;
    iHigh = 500;
    cLow = 350.5;
    cHigh = 500.4;
  } else {
    return 500; // PM2.5 concentration above 500.4 µg/m³ is considered beyond the AQI scale
  }

  const aqi = ((iHigh - iLow) / (cHigh - cLow)) * (pm25 - cLow) + iLow;
  return Math.round(aqi);
};
