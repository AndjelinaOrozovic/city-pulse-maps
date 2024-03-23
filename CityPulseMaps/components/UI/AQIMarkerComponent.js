import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import {Colors} from "../../constants/colors";

const AQIMarkerComponent = ({ marker, onPress }) => {
  const aqiColor = getAqiColor(marker.weight);

  return (
    <Marker
      zIndex={marker.weight}
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude,
      }}
      onPress={onPress}
      key={marker.key}
    >
      <View style={[styles.circle, { backgroundColor: aqiColor }]}>
        <Text style={styles.text}>{marker.weight}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.white,
    fontWeight: "bold",
  },
});

export default AQIMarkerComponent;

function getAqiColor(aqi) {
  if (aqi <= 50) {
    return Colors.lightGreen;
  } else if (aqi <= 100) {
    return Colors.yellow;
  } else if (aqi <= 150) {
    return Colors.orange;
  } else if (aqi <= 200) {
    return Colors.red;
  } else if (aqi <= 300) {
    return Colors.purple;
  } else {
    return Colors.maroon;
  }
}
